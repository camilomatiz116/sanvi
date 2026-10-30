import { query } from '../../config/db.js';
import crypto from 'crypto';

// 8 Comerciantes Reales y Diversos de San Victorino (Ropa, Tecnología, Juguetería, Belleza, Hogar, Calzado, etc.)
export const MOCK_STORES = [
  // 1. ROPA DENIM
  {
    id: 'store-001',
    name: 'Confecciones Don Lucho Denim',
    slug: 'don-lucho-denim',
    category_focus: 'Moda & Confección',
    owner_name: 'Luis Fernando Gómez (Don Lucho)',
    email: 'donlucho@sanvi.com.co',
    password: 'Sanvi2026*Lucho',
    password_hash: '$2a$10$abcdefghijklmnopqrstuvwxyz123456',
    commercial_center: 'El Gran San',
    local_number: 'Local 142 - Piso 1',
    phone_whatsapp: '573102345678',
    logo_url: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=200&auto=format&fit=crop',
    banner_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop',
    description: 'Fabricantes directos de Jeans colombianos rígidos, levanta cola y chaquetas denim.',
    is_verified: true,
    status: 'ACTIVE',
    membership_status: 'ACTIVE',
    membership_fee: 120000,
    next_billing_date: '2026-11-28'
  },
  // 2. TECNOLOGÍA & ACCESORIOS
  {
    id: 'store-006',
    name: 'TecnoMayoristas San Victorino',
    slug: 'tecnomayoristas-sanvi',
    category_focus: 'Tecnología & Celulares',
    owner_name: 'Andrés Felipe Téllez',
    email: 'tecnosanvi@sanvi.com.co',
    password: 'Sanvi2026*Tecno',
    password_hash: '$2a$10$abcdefghijklmnopqrstuvwxyz123461',
    commercial_center: 'Plaza San Victorino',
    local_number: 'Local 38 - Pasaje Tecnológico',
    phone_whatsapp: '573118901234',
    logo_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&auto=format&fit=crop',
    banner_url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&auto=format&fit=crop',
    description: 'Importadores directos de Smartwatches, aros de luz, parlantes Bluetooth, audífonos TWS y cables para celular.',
    is_verified: true,
    status: 'ACTIVE',
    membership_status: 'ACTIVE',
    membership_fee: 120000,
    next_billing_date: '2026-12-05'
  },
  // 3. JUGUETERÍA & PIÑATERÍA
  {
    id: 'store-007',
    name: 'Mundo Juguetes & Piñatería Sanvi',
    slug: 'mundo-juguetes-sanvi',
    category_focus: 'Juguetería & Bebés',
    owner_name: 'Gloria Esperanza Rincón',
    email: 'juguetes@sanvi.com.co',
    password: 'Sanvi2026*Juguetes',
    password_hash: '$2a$10$abcdefghijklmnopqrstuvwxyz123462',
    commercial_center: 'Calle 11 Mayorista',
    local_number: 'Bodega 12 - Frente a Parque San Victorino',
    phone_whatsapp: '573134567890',
    logo_url: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=200&auto=format&fit=crop',
    banner_url: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=1200&auto=format&fit=crop',
    description: 'Juguetería por bulto y docena: carros a control remoto, bloques didácticos, muñecas y piñatería para revendedores.',
    is_verified: true,
    status: 'ACTIVE',
    membership_status: 'ACTIVE',
    membership_fee: 120000,
    next_billing_date: '2026-11-29'
  },
  // 4. BELLEZA & COSMÉTICOS
  {
    id: 'store-008',
    name: 'Cosméticos & Belleza Glam Bogotá',
    slug: 'glam-cosmeticos-sanvi',
    category_focus: 'Belleza & Cuidado Personal',
    owner_name: 'Diana Carolina Prada',
    email: 'glam@sanvi.com.co',
    password: 'Sanvi2026*Glam',
    password_hash: '$2a$10$abcdefghijklmnopqrstuvwxyz123463',
    commercial_center: 'Neos Centro',
    local_number: 'Local 412 - Piso Belleza',
    phone_whatsapp: '573167890123',
    logo_url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200&auto=format&fit=crop',
    banner_url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&auto=format&fit=crop',
    description: 'Distribución mayorista de maquillaje, planchas de titanio, kits de brochas, labiales y productos skincare.',
    is_verified: true,
    status: 'ACTIVE',
    membership_status: 'ACTIVE',
    membership_fee: 120000,
    next_billing_date: '2026-12-01'
  },
  // 5. HOGAR & CACHARRERÍA NOVEDADES
  {
    id: 'store-009',
    name: 'Hogar, Novedades & Cacharrería El Triunfo',
    slug: 'hogar-el-triunfo',
    category_focus: 'Hogar & Cocina',
    owner_name: 'Nelson Ricardo Castro',
    email: 'hogarsanvi@sanvi.com.co',
    password: 'Sanvi2026*Hogar',
    password_hash: '$2a$10$abcdefghijklmnopqrstuvwxyz123464',
    commercial_center: 'Centro Mayorista Visto',
    local_number: 'Local 204 - Nivel Hogar',
    phone_whatsapp: '573145678901',
    logo_url: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=200&auto=format&fit=crop',
    banner_url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&auto=format&fit=crop',
    description: 'Artículos virales de TikTok para el hogar: picatodo eléctrico, lámparas astronauta galaxia, cobijas térmicas y organizadores.',
    is_verified: true,
    status: 'ACTIVE',
    membership_status: 'ACTIVE',
    membership_fee: 120000,
    next_billing_date: '2026-11-26'
  },
  // 6. MORRALES & MALETAS
  {
    id: 'store-010',
    name: 'Morrales & Maletas Élite San Victorino',
    slug: 'morrales-elite-sanvi',
    category_focus: 'Morrales & Bolsos',
    owner_name: 'Yamile Sánchez',
    email: 'maletasanvi@sanvi.com.co',
    password: 'Sanvi2026*Maletas',
    password_hash: '$2a$10$abcdefghijklmnopqrstuvwxyz123465',
    commercial_center: 'El Trébol',
    local_number: 'Local 118 - Piso 1',
    phone_whatsapp: '573178901234',
    logo_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&auto=format&fit=crop',
    banner_url: 'https://images.unsplash.com/photo-1546938576-6e6a64f317cc?w=1200&auto=format&fit=crop',
    description: 'Morrales impermeables para portátil con puerto USB, maletas de viaje rígidas y bolsos manos libres.',
    is_verified: true,
    status: 'ACTIVE',
    membership_status: 'ACTIVE',
    membership_fee: 120000,
    next_billing_date: '2026-11-27'
  },
  // 7. URBAN STREETWEAR
  {
    id: 'store-002',
    name: 'Urban Street Neos Bogotá',
    slug: 'urban-street-neos',
    category_focus: 'Moda & Confección',
    owner_name: 'Camila Andrea Restrepo',
    email: 'urbanneos@sanvi.com.co',
    password: 'Sanvi2026*Neos',
    password_hash: '$2a$10$abcdefghijklmnopqrstuvwxyz123457',
    commercial_center: 'Neos Centro',
    local_number: 'Local 205 - Pasillo Juvenil',
    phone_whatsapp: '573209876543',
    logo_url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=200&auto=format&fit=crop',
    banner_url: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1200&auto=format&fit=crop',
    description: 'Buzos hoodie oversize, camisetas acid wash 240g y estilo streetwear con precios de madrugón.',
    is_verified: true,
    status: 'ACTIVE',
    membership_status: 'ACTIVE',
    membership_fee: 120000,
    next_billing_date: '2026-11-25'
  },
  // 8. CALZADO & CUERO
  {
    id: 'store-005',
    name: 'Calzado & Cuero Pasaje Rivas',
    slug: 'cuero-pasaje-rivas',
    category_focus: 'Calzado & Cuero',
    owner_name: 'William Eduardo Moreno',
    email: 'cuerorivas@sanvi.com.co',
    password: 'Sanvi2026*Rivas',
    password_hash: '$2a$10$abcdefghijklmnopqrstuvwxyz123460',
    commercial_center: 'Pasaje Rivas',
    local_number: 'Local 45 - Entrada Calle Décima',
    phone_whatsapp: '573004443322',
    logo_url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&auto=format&fit=crop',
    banner_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&auto=format&fit=crop',
    description: 'Botas 100% cuero legítimo de Restrepo/San Victorino y tenis deportivos tipo exportación.',
    is_verified: true,
    status: 'ACTIVE',
    membership_status: 'ACTIVE',
    membership_fee: 120000,
    next_billing_date: '2026-11-30'
  }
];

export async function getAllStores(req, res) {
  try {
    const result = await query(
      `SELECT s.*, m.status as membership_status, m.next_billing_date 
       FROM stores s 
       LEFT JOIN memberships m ON s.id = m.store_id 
       WHERE s.status = 'ACTIVE' 
       ORDER BY s.created_at DESC`
    );
    if (result.rows.length > 0) return res.json(result.rows);
    return res.json(MOCK_STORES);
  } catch (error) {
    return res.json(MOCK_STORES);
  }
}

export async function getStoreBySlug(req, res) {
  const { slug } = req.params;
  try {
    const result = await query(
      `SELECT s.*, m.status as membership_status 
       FROM stores s 
       LEFT JOIN memberships m ON s.id = m.store_id 
       WHERE s.slug = $1`,
      [slug]
    );

    if (result.rows.length === 0) {
      const mock = MOCK_STORES.find(s => s.slug === slug || s.id === slug);
      if (mock) return res.json(mock);
      return res.status(404).json({ error: 'Tienda no encontrada' });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    const mock = MOCK_STORES.find(s => s.slug === slug || s.id === slug);
    if (mock) return res.json(mock);
    return res.status(404).json({ error: 'Tienda no encontrada' });
  }
}

export async function createStore(req, res) {
  const {
    name,
    owner_name,
    email,
    password,
    commercial_center,
    local_number,
    phone_whatsapp,
    description
  } = req.body;

  if (!name || !email || !commercial_center || !local_number || !phone_whatsapp) {
    return res.status(400).json({ error: 'Faltan campos obligatorios para registrar el local' });
  }

  const slug = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  try {
    const storeRes = await query(
      `INSERT INTO stores (name, slug, owner_name, email, password_hash, commercial_center, local_number, phone_whatsapp, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [name, slug, owner_name || name, email, password || 'Sanvi2026*', commercial_center, local_number, phone_whatsapp, description || '']
    );

    const store = storeRes.rows[0];
    const nextMonth = new Date();
    nextMonth.setDate(nextMonth.getDate() + 30);

    await query(
      `INSERT INTO memberships (store_id, amount, status, start_date, next_billing_date)
       VALUES ($1, 120000.00, 'ACTIVE', CURRENT_DATE, $2)`,
      [store.id, nextMonth]
    );

    return res.status(201).json({
      message: '¡Tienda registrada con éxito en Sanvi!',
      store
    });
  } catch (error) {
    const newStore = {
      id: `store-${Date.now()}`,
      name,
      slug,
      owner_name,
      email,
      password: password || 'Sanvi2026*',
      commercial_center,
      local_number,
      phone_whatsapp,
      description,
      is_verified: true,
      status: 'ACTIVE',
      membership_status: 'ACTIVE',
      membership_fee: 120000,
      next_billing_date: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]
    };
    MOCK_STORES.unshift(newStore);
    return res.status(201).json({
      message: '¡Tienda registrada con éxito en Sanvi!',
      store: newStore
    });
  }
}

export async function updateStore(req, res) {
  const { id } = req.params;
  const {
    name,
    description,
    banner_url,
    logo_url,
    commercial_center,
    local_number,
    phone_whatsapp
  } = req.body;

  try {
    const result = await query(
      `UPDATE stores SET
        name = COALESCE($1, name),
        description = COALESCE($2, description),
        banner_url = COALESCE($3, banner_url),
        logo_url = COALESCE($4, logo_url),
        commercial_center = COALESCE($5, commercial_center),
        local_number = COALESCE($6, local_number),
        phone_whatsapp = COALESCE($7, phone_whatsapp),
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $8
       RETURNING *`,
      [
        name,
        description,
        banner_url,
        logo_url,
        commercial_center,
        local_number,
        phone_whatsapp,
        id
      ]
    );

    const mockIndex = MOCK_STORES.findIndex((s) => s.id === id || s.slug === id);
    if (mockIndex !== -1) {
      MOCK_STORES[mockIndex] = {
        ...MOCK_STORES[mockIndex],
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(banner_url && { banner_url }),
        ...(logo_url && { logo_url }),
        ...(commercial_center && { commercial_center }),
        ...(local_number && { local_number }),
        ...(phone_whatsapp && { phone_whatsapp })
      };
      return res.json({
        message: '¡Datos y portada de la tienda actualizados con éxito!',
        store: MOCK_STORES[mockIndex]
      });
    }

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tienda no encontrada para actualizar' });
    }

    return res.json({
      message: '¡Datos y portada de la tienda actualizados con éxito!',
      store: result.rows[0]
    });
  } catch (error) {
    const mockIndex = MOCK_STORES.findIndex((s) => s.id === id || s.slug === id);
    if (mockIndex !== -1) {
      MOCK_STORES[mockIndex] = {
        ...MOCK_STORES[mockIndex],
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(banner_url && { banner_url }),
        ...(logo_url && { logo_url }),
        ...(commercial_center && { commercial_center }),
        ...(local_number && { local_number }),
        ...(phone_whatsapp && { phone_whatsapp })
      };
      return res.json({
        message: '¡Datos y portada de la tienda actualizados con éxito!',
        store: MOCK_STORES[mockIndex]
      });
    }
    return res.status(404).json({ error: 'Tienda no encontrada' });
  }
}
