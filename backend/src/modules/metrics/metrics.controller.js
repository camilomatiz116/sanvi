import { query } from '../../config/db.js';
import { MOCK_PRODUCTS } from '../products/products.controller.js';
import { MOCK_STORES } from '../stores/stores.controller.js';

export async function trackWhatsAppClick(req, res) {
  const { store_id, product_id, purchase_type } = req.body;

  try {
    if (product_id) {
      await query(
        `UPDATE products SET whatsapp_clicks = whatsapp_clicks + 1 WHERE id = $1`,
        [product_id]
      );
    }

    if (store_id) {
      await query(
        `INSERT INTO whatsapp_leads (store_id, product_id, purchase_type)
         VALUES ($1, $2, $3)`,
        [store_id, product_id || null, purchase_type || 'DETAL']
      );
    }

    return res.json({ success: true, message: 'Clic de WhatsApp registrado' });
  } catch (error) {
    if (product_id) {
      const prod = MOCK_PRODUCTS.find(p => p.id === product_id);
      if (prod) prod.whatsapp_clicks = (prod.whatsapp_clicks || 0) + 1;
    }
    return res.json({ success: true, message: 'Clic registrado (modo memoria)' });
  }
}

export async function getStoreMetrics(req, res) {
  const { storeId } = req.params;

  try {
    const leadsRes = await query(
      `SELECT COUNT(*) as total_clicks
       FROM whatsapp_leads
       WHERE store_id = $1`,
      [storeId]
    );

    const viewsRes = await query(
      `SELECT COALESCE(SUM(views_count), 0) as total_views,
              COALESCE(SUM(whatsapp_clicks), 0) as total_clicks
       FROM products
       WHERE store_id = $1`,
      [storeId]
    );

    const productsCountRes = await query(
      `SELECT COUNT(*) as total_active
       FROM products
       WHERE store_id = $1 AND is_active = true`,
      [storeId]
    );

    const views = Number(viewsRes.rows[0]?.total_views || 0);
    const clicks = Math.max(
      Number(viewsRes.rows[0]?.total_clicks || 0),
      Number(leadsRes.rows[0]?.total_clicks || 0)
    );
    const activeProducts = Number(productsCountRes.rows[0]?.total_active || 0);
    const conversionRate = views > 0 ? ((clicks / views) * 100).toFixed(1) : '0.0';

    return res.json({
      total_views: views,
      total_whatsapp_clicks: clicks,
      active_products: activeProducts,
      conversion_rate: conversionRate
    });
  } catch (error) {
    // Modo memoria / fallback con la suma de los productos del comerciante
    const store = MOCK_STORES.find(s => s.id === storeId || s.slug === storeId) || MOCK_STORES[0];
    const storeProducts = MOCK_PRODUCTS.filter(p => p.store_id === store.id || p.store_name === store.name);
    const totalViews = storeProducts.reduce((sum, p) => sum + (p.views_count || 0), 0);
    const totalClicks = storeProducts.reduce((sum, p) => sum + (p.whatsapp_clicks || 0), 0);
    const conversionRate = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : '0.0';

    return res.json({
      store_id: store.id,
      store_name: store.name,
      total_views: totalViews,
      total_whatsapp_clicks: totalClicks,
      active_products: storeProducts.length,
      conversion_rate: conversionRate
    });
  }
}
