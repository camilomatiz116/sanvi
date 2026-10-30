import { query } from '../../config/db.js';

// Memoria volátil de respaldo para órdenes en caso de desconexión DB
const IN_MEMORY_ORDERS = [];

export async function createOrder(req, res) {
  const {
    customer_name,
    customer_email,
    customer_phone,
    shipping_address,
    shipping_city,
    shipping_notes,
    payment_method,
    payment_reference,
    items,
    total_amount,
    store_id
  } = req.body;

  if (!customer_name || !customer_phone || !shipping_address || !items || items.length === 0) {
    return res.status(400).json({ error: 'Faltan datos obligatorios para procesar la compra' });
  }

  // Generar código de orden profesional único ej: SNV-58392
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  const orderNumber = `SNV-${randomSuffix}`;
  const orderId = `order-${Date.now()}-${randomSuffix}`;
  const targetStoreId = store_id || items[0]?.store_id || 'store-001';

  try {
    const orderRes = await query(
      `INSERT INTO orders (
        id, order_number, store_id, customer_name, customer_email, customer_phone,
        shipping_address, shipping_city, shipping_notes, payment_method, payment_status,
        payment_reference, total_amount, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *`,
      [
        orderId,
        orderNumber,
        targetStoreId,
        customer_name,
        customer_email || '',
        customer_phone,
        shipping_address,
        shipping_city || 'Bogotá D.C.',
        shipping_notes || '',
        payment_method || 'WOMPI',
        payment_method === 'CONTRAENTREGA' ? 'PENDING' : 'PAID',
        payment_reference || `REF-${Date.now()}`,
        Number(total_amount) || 0,
        'PROCESSING'
      ]
    );

    const savedOrder = orderRes.rows[0];

    // Insertar items de la orden
    for (const item of items) {
      await query(
        `INSERT INTO order_items (
          order_id, product_id, title, quantity, unit_price, total_price, variant_size, variant_color
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          savedOrder.id,
          item.id || item.product_id,
          item.title,
          Number(item.quantity) || 1,
          Number(item.unitPrice || item.price_retail) || 0,
          Number(item.total || (item.unitPrice || item.price_retail) * item.quantity) || 0,
          item.selectedSize || '',
          item.selectedColor || ''
        ]
      );

      // Incrementar contador de ventas del producto
      if (item.id || item.product_id) {
        await query(
          `UPDATE products SET sold_count = COALESCE(sold_count, 0) + $1 WHERE id = $2`,
          [Number(item.quantity) || 1, item.id || item.product_id]
        ).catch(() => {});
      }
    }

    return res.status(201).json({
      message: '¡Orden de compra generada exitosamente en SANVI!',
      order: {
        ...savedOrder,
        items
      }
    });
  } catch (error) {
    console.warn('Fallo guardando en PostgreSQL, guardando en memoria:', error.message);
    const mockOrder = {
      id: orderId,
      order_number: orderNumber,
      store_id: targetStoreId,
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      shipping_city: shipping_city || 'Bogotá D.C.',
      shipping_notes,
      payment_method,
      payment_status: payment_method === 'CONTRAENTREGA' ? 'PENDING' : 'PAID',
      payment_reference: payment_reference || `REF-${Date.now()}`,
      total_amount,
      status: 'PROCESSING',
      created_at: new Date().toISOString(),
      items
    };
    IN_MEMORY_ORDERS.unshift(mockOrder);

    return res.status(201).json({
      message: '¡Orden de compra generada exitosamente en SANVI!',
      order: mockOrder
    });
  }
}

export async function getOrderById(req, res) {
  const { id } = req.params;
  try {
    const orderRes = await query(
      `SELECT o.*, s.name as store_name, s.commercial_center, s.local_number, s.phone_whatsapp
       FROM orders o
       LEFT JOIN stores s ON o.store_id = s.id
       WHERE o.id = $1 OR o.order_number = $1`,
      [id]
    );

    if (orderRes.rows.length === 0) {
      const found = IN_MEMORY_ORDERS.find(o => o.id === id || o.order_number === id);
      if (found) return res.json(found);
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    const order = orderRes.rows[0];
    const itemsRes = await query(
      `SELECT oi.*, p.images FROM order_items oi
       LEFT JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = $1`,
      [order.id]
    );

    return res.json({
      ...order,
      items: itemsRes.rows
    });
  } catch (err) {
    const found = IN_MEMORY_ORDERS.find(o => o.id === id || o.order_number === id);
    if (found) return res.json(found);
    return res.status(500).json({ error: err.message });
  }
}

export async function getStoreOrders(req, res) {
  const { storeId } = req.params;
  try {
    const orderRes = await query(
      `SELECT * FROM orders WHERE store_id = $1 ORDER BY created_at DESC`,
      [storeId]
    );
    return res.json(orderRes.rows);
  } catch (err) {
    return res.json(IN_MEMORY_ORDERS.filter(o => o.store_id === storeId));
  }
}

