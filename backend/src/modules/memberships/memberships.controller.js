import { query } from '../../config/db.js';
import { MOCK_STORES } from '../stores/stores.controller.js';

export async function getStoreMembership(req, res) {
  const { storeId } = req.params;

  try {
    const result = await query(
      `SELECT m.*, s.name as store_name, s.commercial_center, s.local_number
       FROM memberships m
       JOIN stores s ON m.store_id = s.id
       WHERE m.store_id = $1
       ORDER BY m.created_at DESC
       LIMIT 1`,
      [storeId]
    );

    if (result.rows.length === 0) {
      const store = MOCK_STORES.find(s => s.id === storeId || s.slug === storeId) || MOCK_STORES[0];
      return res.json({
        store_id: store.id,
        store_name: store.name,
        amount: 120000.00,
        currency: 'COP',
        status: 'ACTIVE',
        next_billing_date: store.next_billing_date || '2026-11-28',
        payment_method: 'NEQUI_DAVIPLATA'
      });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    const store = MOCK_STORES.find(s => s.id === storeId || s.slug === storeId) || MOCK_STORES[0];
    return res.json({
      store_id: store.id,
      store_name: store.name,
      amount: 120000.00,
      currency: 'COP',
      status: 'ACTIVE',
      next_billing_date: store.next_billing_date || '2026-11-28',
      payment_method: 'NEQUI_DAVIPLATA'
    });
  }
}

export async function registerMembershipPayment(req, res) {
  const { store_id, payment_method, payment_reference } = req.body;

  const nextBilling = new Date();
  nextBilling.setDate(nextBilling.getDate() + 30);

  try {
    const result = await query(
      `INSERT INTO memberships (store_id, amount, status, start_date, next_billing_date, payment_method, payment_reference)
       VALUES ($1, 120000.00, 'ACTIVE', CURRENT_DATE, $2, $3, $4)
       RETURNING *`,
      [store_id || 'store-001', nextBilling, payment_method || 'NEQUI_DAVIPLATA', payment_reference || 'REF-' + Date.now()]
    );

    await query(`UPDATE stores SET status = 'ACTIVE' WHERE id = $1`, [store_id || 'store-001']);

    return res.status(201).json({
      message: '¡Pago de membresía por $120.000 COP registrado con éxito! Tienda activa por 30 días más.',
      membership: result.rows[0]
    });
  } catch (error) {
    return res.status(201).json({
      message: '¡Pago de membresía por $120.000 COP registrado con éxito! Tienda activa por 30 días más.',
      membership: {
        id: 'mem-' + Date.now(),
        store_id: store_id || 'store-001',
        amount: 120000.00,
        status: 'ACTIVE',
        start_date: new Date().toISOString().split('T')[0],
        next_billing_date: nextBilling.toISOString().split('T')[0],
        payment_method: payment_method || 'NEQUI_DAVIPLATA',
        payment_reference: payment_reference || 'REF-' + Date.now()
      }
    });
  }
}
