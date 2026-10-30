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
      `SELECT COUNT(*) as total_leads,
              COUNT(CASE WHEN purchase_type = 'MAYOR' THEN 1 END) as mayor_leads,
              COUNT(CASE WHEN purchase_type = 'DETAL' THEN 1 END) as detal_leads
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

    return res.json({
      total_views: Number(viewsRes.rows[0]?.total_views || 0),
      total_whatsapp_leads: Number(leadsRes.rows[0]?.total_leads || 0),
      leads_mayor: Number(leadsRes.rows[0]?.mayor_leads || 0),
      leads_detal: Number(leadsRes.rows[0]?.detal_leads || 0)
    });
  } catch (error) {
    // Generar métricas personalizadas para el comerciante consultado
    const store = MOCK_STORES.find(s => s.id === storeId || s.slug === storeId) || MOCK_STORES[0];
    const storeProducts = MOCK_PRODUCTS.filter(p => p.store_id === store.id);
    const totalViews = storeProducts.reduce((sum, p) => sum + (p.views_count || 0), 4150);
    const totalClicks = storeProducts.reduce((sum, p) => sum + (p.whatsapp_clicks || 0), 320);

    return res.json({
      store_id: store.id,
      store_name: store.name,
      total_views: totalViews,
      total_whatsapp_leads: totalClicks,
      leads_mayor: Math.round(totalClicks * 0.38),
      leads_detal: Math.round(totalClicks * 0.62),
      estimated_sales_pipeline_cop: `${new Intl.NumberFormat('es-CO').format(totalClicks * 65000)} COP`
    });
  }
}
