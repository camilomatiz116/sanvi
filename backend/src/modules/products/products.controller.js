import { query } from '../../config/db.js';
import { parseVideoUrl } from '../media/videoParser.js';

// Catálogo ampliado y diverso de San Victorino (Ropa, Tecnología, Juguetes, Belleza, Hogar, Morrales, Calzado)
export let MOCK_PRODUCTS = [
  // ==========================================
  // 1. TECNOLOGÍA & ACCESORIOS (TecnoMayoristas Sanvi)
  // ==========================================
  {
    id: 'prod-tec-001',
    store_id: 'store-006',
    store_name: 'TecnoMayoristas San Victorino',
    commercial_center: 'Plaza San Victorino',
    local_number: 'Local 38 - Pasaje Tecnológico',
    phone_whatsapp: '573118901234',
    title: 'Smartwatch T900 Ultra Series Reloj Inteligente HD Carga Inalámbrica',
    slug: 'smartwatch-t900-ultra-hd',
    description: 'Reloj inteligente con pantalla de 2.02 pulgadas, llamadas bluetooth, monitor de ritmo cardíaco, resistente a salpicaduras. Incluye 2 correas.',
    price_retail: 35000,
    price_wholesale: 19500,
    min_wholesale_qty: 6,
    original_price: 75000,
    discount_percentage: 53,
    stock: 650,
    is_madrugon_deal: true,
    video_url: 'https://www.youtube.com/shorts/dQw4w9WgXcQ',
    video_parsed: parseVideoUrl('https://www.youtube.com/shorts/dQw4w9WgXcQ'),
    images: [
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop'
    ],
    variants: { colors: ['Naranja Ultra', 'Negro Mate', 'Plata'] },
    views_count: 4890,
    whatsapp_clicks: 380,
    category: 'Tecnología & Celulares',
    is_active: true
  },
  {
    id: 'prod-tec-002',
    store_id: 'store-006',
    store_name: 'TecnoMayoristas San Victorino',
    commercial_center: 'Plaza San Victorino',
    local_number: 'Local 38 - Pasaje Tecnológico',
    phone_whatsapp: '573118901234',
    title: 'Aro de Luz LED 26cm con Trípode Metálico 2.1m y Soporte Celular 3 Tonos',
    slug: 'aro-de-luz-led-26cm-tripode',
    description: 'Iluminación profesional para TikTok, transmisiones en vivo y fotos. Luz cálida, fría y neutra con 10 niveles de brillo.',
    price_retail: 28000,
    price_wholesale: 15500,
    min_wholesale_qty: 6,
    original_price: 60000,
    discount_percentage: 53,
    stock: 480,
    is_madrugon_deal: true,
    video_url: null,
    video_parsed: null,
    images: [
      'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&auto=format&fit=crop'
    ],
    variants: { sizes: ['26cm + Trípode 2.1m'] },
    views_count: 2100,
    whatsapp_clicks: 165,
    category: 'Tecnología & Celulares',
    is_active: true
  },
  {
    id: 'prod-tec-003',
    store_id: 'store-006',
    store_name: 'TecnoMayoristas San Victorino',
    commercial_center: 'Plaza San Victorino',
    local_number: 'Local 38 - Pasaje Tecnológico',
    phone_whatsapp: '573118901234',
    title: 'Audífonos Inalámbricos Bluetooth Pro TWS Estuche de Carga Digital',
    slug: 'audifonos-inalambricos-pro-tws',
    description: 'Cancelación pasiva de ruido, sonido bass reforzado, indicador digital de batería en estuche. Batería de 5 horas continuas.',
    price_retail: 22000,
    price_wholesale: 12500,
    min_wholesale_qty: 12,
    original_price: 50000,
    discount_percentage: 56,
    stock: 1200,
    is_madrugon_deal: true,
    video_url: 'https://www.tiktok.com/@tecnosanvi/video/7891234567',
    video_parsed: parseVideoUrl('https://www.tiktok.com/@tecnosanvi/video/7891234567'),
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop'
    ],
    variants: { colors: ['Blanco', 'Negro'] },
    views_count: 3600,
    whatsapp_clicks: 290,
    category: 'Tecnología & Celulares',
    is_active: true
  },

  // ==========================================
  // 2. JUGUETERÍA & PIÑATERÍA (Mundo Juguetes Sanvi)
  // ==========================================
  {
    id: 'prod-jug-001',
    store_id: 'store-007',
    store_name: 'Mundo Juguetes & Piñatería Sanvi',
    commercial_center: 'Calle 11 Mayorista',
    local_number: 'Bodega 12 - Frente a Parque San Victorino',
    phone_whatsapp: '573134567890',
    title: 'Carro Acrobático a Control Remoto 360° Todo Terreno con Luces LED',
    slug: 'carro-acrobatico-control-remoto-360',
    description: 'Gira en 360 grados, llantas de goma todoterreno para asfalto, tierra y grama. Batería recargable incluida con cable USB.',
    price_retail: 39000,
    price_wholesale: 24000,
    min_wholesale_qty: 6,
    original_price: 85000,
    discount_percentage: 54,
    stock: 350,
    is_madrugon_deal: true,
    video_url: 'https://www.youtube.com/shorts/dQw4w9WgXcQ',
    video_parsed: parseVideoUrl('https://www.youtube.com/shorts/dQw4w9WgXcQ'),
    images: [
      'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=600&auto=format&fit=crop'
    ],
    variants: { colors: ['Rojo Fuego', 'Azul Eléctrico', 'Verde Neón'] },
    views_count: 2750,
    whatsapp_clicks: 210,
    category: 'Juguetería & Niños',
    is_active: true
  },
  {
    id: 'prod-jug-002',
    store_id: 'store-007',
    store_name: 'Mundo Juguetes & Piñatería Sanvi',
    commercial_center: 'Calle 11 Mayorista',
    local_number: 'Bodega 12 - Frente a Parque San Victorino',
    phone_whatsapp: '573134567890',
    title: 'Set Bloques de Construcción Magnéticos 64 Piezas Didácticas 3D',
    slug: 'set-bloques-magneticos-64-piezas',
    description: 'Imanes de neodimio potentes, plástico ABS no tóxico de esquinas redondeadas. Estimula la creatividad espacial.',
    price_retail: 35000,
    price_wholesale: 21500,
    min_wholesale_qty: 6,
    original_price: 75000,
    discount_percentage: 53,
    stock: 420,
    is_madrugon_deal: false,
    video_url: null,
    video_parsed: null,
    images: [
      'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&auto=format&fit=crop'
    ],
    variants: { sizes: ['Caja 64 Piezas'] },
    views_count: 1820,
    whatsapp_clicks: 145,
    category: 'Juguetería & Niños',
    is_active: true
  },

  // ==========================================
  // 3. BELLEZA & MAQUILLAJE (Glam Bogotá)
  // ==========================================
  {
    id: 'prod-bel-001',
    store_id: 'store-008',
    store_name: 'Cosméticos & Belleza Glam Bogotá',
    commercial_center: 'Neos Centro',
    local_number: 'Local 412 - Piso Belleza',
    phone_whatsapp: '573167890123',
    title: 'Kit Set 12 Brochas Profesionales de Maquillaje con Estuche de Lujo',
    slug: 'kit-12-brochas-profesionales-estuche',
    description: 'Cerdas sintéticas ultra suaves que no botan pelo, mangos de madera barnizada y virola de aluminio reforzado.',
    price_retail: 24000,
    price_wholesale: 13500,
    min_wholesale_qty: 12,
    original_price: 52000,
    discount_percentage: 54,
    stock: 800,
    is_madrugon_deal: true,
    video_url: 'https://www.tiktok.com/@glambogota/video/7345612345',
    video_parsed: parseVideoUrl('https://www.tiktok.com/@glambogota/video/7345612345'),
    images: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop'
    ],
    variants: { colors: ['Rose Gold', 'Negro Mate', 'Menta'] },
    views_count: 3120,
    whatsapp_clicks: 270,
    category: 'Belleza & Cuidado Personal',
    is_active: true
  },
  {
    id: 'prod-bel-002',
    store_id: 'store-008',
    store_name: 'Cosméticos & Belleza Glam Bogotá',
    commercial_center: 'Neos Centro',
    local_number: 'Local 412 - Piso Belleza',
    phone_whatsapp: '573167890123',
    title: 'Plancha para Cabello Cerámica Profesional Nano Titanium 450°F',
    slug: 'plancha-cabello-nano-titanium-450f',
    description: 'Placas flotantes de titanio que no maltratan la fibra capilar, calentamiento instantáneo en 30 segundos, cable giratorio 360.',
    price_retail: 48000,
    price_wholesale: 31000,
    min_wholesale_qty: 6,
    original_price: 105000,
    discount_percentage: 54,
    stock: 310,
    is_madrugon_deal: true,
    video_url: null,
    video_parsed: null,
    images: [
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&auto=format&fit=crop'
    ],
    variants: { colors: ['Azul Eléctrico', 'Gris Plata'] },
    views_count: 2400,
    whatsapp_clicks: 195,
    category: 'Belleza & Cuidado Personal',
    is_active: true
  },

  // ==========================================
  // 4. HOGAR, COCINA & CACHARRERÍA NOVEDADES (El Triunfo)
  // ==========================================
  {
    id: 'prod-hog-001',
    store_id: 'store-009',
    store_name: 'Hogar, Novedades & Cacharrería El Triunfo',
    commercial_center: 'Centro Mayorista Visto',
    local_number: 'Local 204 - Nivel Hogar',
    phone_whatsapp: '573145678901',
    title: 'Picatodo Mini Procesador Eléctrico Inalámbrico USB para Ajo y Verduras',
    slug: 'picatodo-mini-procesador-usb',
    description: 'Cuchillas de acero inoxidable 304 de triple filo, vaso de 250ml libre de BPA, recargable por USB. El producto más viral de TikTok.',
    price_retail: 18000,
    price_wholesale: 9800,
    min_wholesale_qty: 12,
    original_price: 42000,
    discount_percentage: 57,
    stock: 1400,
    is_madrugon_deal: true,
    video_url: 'https://www.youtube.com/shorts/dQw4w9WgXcQ',
    video_parsed: parseVideoUrl('https://www.youtube.com/shorts/dQw4w9WgXcQ'),
    images: [
      'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop'
    ],
    variants: { colors: ['Blanco', 'Verde Pastel', 'Rosa'] },
    views_count: 5120,
    whatsapp_clicks: 430,
    category: 'Hogar & Cocina',
    is_active: true
  },
  {
    id: 'prod-hog-002',
    store_id: 'store-009',
    store_name: 'Hogar, Novedades & Cacharrería El Triunfo',
    commercial_center: 'Centro Mayorista Visto',
    local_number: 'Local 204 - Nivel Hogar',
    phone_whatsapp: '573145678901',
    title: 'Lámpara Proyector Astronauta Galaxia y Estrellas con Control Remoto',
    slug: 'lampara-proyector-astronauta-galaxia',
    description: 'Cabeza magnética giratoria 360°, 8 modos de nebulosa con estrellas láser verdes, temporizador automático de apagado.',
    price_retail: 42000,
    price_wholesale: 26000,
    min_wholesale_qty: 6,
    original_price: 90000,
    discount_percentage: 53,
    stock: 450,
    is_madrugon_deal: true,
    video_url: 'https://www.tiktok.com/@hogarsanvi/video/7456789012',
    video_parsed: parseVideoUrl('https://www.tiktok.com/@hogarsanvi/video/7456789012'),
    images: [
      'https://images.unsplash.com/photo-1507499739999-097706ad8914?w=600&auto=format&fit=crop'
    ],
    variants: { colors: ['Blanco Astronauta'] },
    views_count: 4200,
    whatsapp_clicks: 340,
    category: 'Hogar & Cocina',
    is_active: true
  },
  {
    id: 'prod-hog-003',
    store_id: 'store-009',
    store_name: 'Hogar, Novedades & Cacharrería El Triunfo',
    commercial_center: 'Centro Mayorista Visto',
    local_number: 'Local 204 - Nivel Hogar',
    phone_whatsapp: '573145678901',
    title: 'Cobija Térmica Piel de Conejo Doble Faz Extra Suave Cama Doble 2x2m',
    slug: 'cobija-termica-piel-conejo-doble-faz',
    description: 'Piel de conejo sintética por un lado y ovejero térmico abrigado por el reverso. No suelta motas, ideal para frío bogotano.',
    price_retail: 45000,
    price_wholesale: 29000,
    min_wholesale_qty: 6,
    original_price: 95000,
    discount_percentage: 52,
    stock: 380,
    is_madrugon_deal: true,
    video_url: null,
    video_parsed: null,
    images: [
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&auto=format&fit=crop'
    ],
    variants: { colors: ['Gris Plomo', 'Palo de Rosa', 'Azul Petróleo', 'Café Moka'] },
    views_count: 2900,
    whatsapp_clicks: 230,
    category: 'Hogar & Cocina',
    is_active: true
  },

  // ==========================================
  // 5. MORRALES, MALETAS & BOLSOS (Élite Sanvi)
  // ==========================================
  {
    id: 'prod-mor-001',
    store_id: 'store-010',
    store_name: 'Morrales & Maletas Élite San Victorino',
    commercial_center: 'El Trébol',
    local_number: 'Local 118 - Piso 1',
    phone_whatsapp: '573178901234',
    title: 'Morral Antirrobo Impermeable para Portátil 15.6" con Puerto USB y Clave',
    slug: 'morral-antirrobo-impermeable-usb',
    description: 'Cremalleras ocultas traseras, candado con clave numérica integrado, lona Oxford impermeable de alta resistencia.',
    price_retail: 42000,
    price_wholesale: 26500,
    min_wholesale_qty: 6,
    original_price: 88000,
    discount_percentage: 52,
    stock: 520,
    is_madrugon_deal: true,
    video_url: 'https://www.youtube.com/shorts/dQw4w9WgXcQ',
    video_parsed: parseVideoUrl('https://www.youtube.com/shorts/dQw4w9WgXcQ'),
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop'
    ],
    variants: { colors: ['Negro Ejecutivo', 'Gris Oxford', 'Azul Marino'] },
    views_count: 3800,
    whatsapp_clicks: 310,
    category: 'Morrales & Maletas',
    is_active: true
  },
  {
    id: 'prod-mor-002',
    store_id: 'store-010',
    store_name: 'Morrales & Maletas Élite San Victorino',
    commercial_center: 'El Trébol',
    local_number: 'Local 118 - Piso 1',
    phone_whatsapp: '573178901234',
    title: 'Bolso Riñonera Manos Libres Cruzada Táctica Multibolsillos',
    slug: 'rinonera-manos-libres-tactica',
    description: 'Lona impermeable cordura, correa ajustable para llevar al pecho o cintura, 4 compartimientos con cremallera.',
    price_retail: 22000,
    price_wholesale: 13000,
    min_wholesale_qty: 12,
    original_price: 48000,
    discount_percentage: 54,
    stock: 750,
    is_madrugon_deal: false,
    video_url: null,
    video_parsed: null,
    images: [
      'https://images.unsplash.com/photo-1546938576-6e6a64f317cc?w=600&auto=format&fit=crop'
    ],
    variants: { colors: ['Negro', 'Camuflado Verde', 'Azul Oscuro'] },
    views_count: 1950,
    whatsapp_clicks: 160,
    category: 'Morrales & Maletas',
    is_active: true
  },

  // ==========================================
  // 6. ROPA & MODA (Don Lucho Denim, Urban Neos, Chic, Calzado)
  // ==========================================
  {
    id: 'prod-001',
    store_id: 'store-001',
    store_name: 'Confecciones Don Lucho Denim',
    commercial_center: 'El Gran San',
    local_number: 'Local 142 - Piso 1',
    phone_whatsapp: '573102345678',
    title: 'Jean Levanta Cola Tiro Alto Rígido Denim 100% Colombiano',
    slug: 'jean-levanta-cola-tiro-alto-denim',
    description: 'Jean clásico con control de abdomen, tela índigo de alto gramaje, confección 100% colombiana.',
    price_retail: 38000,
    price_wholesale: 24500,
    min_wholesale_qty: 6,
    original_price: 78000,
    discount_percentage: 51,
    stock: 450,
    is_madrugon_deal: true,
    video_url: 'https://www.youtube.com/shorts/dQw4w9WgXcQ',
    video_parsed: parseVideoUrl('https://www.youtube.com/shorts/dQw4w9WgXcQ'),
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop'
    ],
    variants: { sizes: ['6', '8', '10', '12', '14'], colors: ['Azul Clásico', 'Azul Oscuro', 'Hielo'] },
    views_count: 1840,
    whatsapp_clicks: 112,
    category: 'Moda & Confección',
    is_active: true
  },
  {
    id: 'prod-004',
    store_id: 'store-002',
    store_name: 'Urban Street Neos Bogotá',
    commercial_center: 'Neos Centro',
    local_number: 'Local 205 - Pasillo Juvenil',
    phone_whatsapp: '573209876543',
    title: 'Buzo Hoodie Oversize Algodón Perchado Mónaco Premium',
    slug: 'buzo-hoodie-oversize-algodon-perchado',
    description: 'Buzo con capota amplia, tela perchada térmica abrigada para clima frío. Serigrafía tacto cero que no se agrieta.',
    price_retail: 42000,
    price_wholesale: 27000,
    min_wholesale_qty: 6,
    original_price: 85000,
    discount_percentage: 51,
    stock: 320,
    is_madrugon_deal: true,
    video_url: 'https://www.tiktok.com/@urbanneos/video/7123456789',
    video_parsed: parseVideoUrl('https://www.tiktok.com/@urbanneos/video/7123456789'),
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop'
    ],
    variants: { sizes: ['S', 'M', 'L', 'XL'], colors: ['Negro Azabache', 'Beige Arena', 'Verde Militar'] },
    views_count: 2430,
    whatsapp_clicks: 168,
    category: 'Moda & Confección',
    is_active: true
  },
  {
    id: 'prod-010',
    store_id: 'store-005',
    store_name: 'Calzado & Cuero Pasaje Rivas',
    commercial_center: 'Pasaje Rivas',
    local_number: 'Local 45 - Entrada Calle Décima',
    phone_whatsapp: '573004443322',
    title: 'Botas Caña Media 100% Cuero Genuino Suela Track Antideslizante',
    slug: 'botas-cuero-genuino-suela-track',
    description: 'Cuero nobuk natural vacuno cosido directamente a la suela. Calzado artesanal bogotano de altísima durabilidad.',
    price_retail: 95000,
    price_wholesale: 64000,
    min_wholesale_qty: 6,
    original_price: 190000,
    discount_percentage: 50,
    stock: 180,
    is_madrugon_deal: true,
    video_url: 'https://www.youtube.com/shorts/dQw4w9WgXcQ',
    video_parsed: parseVideoUrl('https://www.youtube.com/shorts/dQw4w9WgXcQ'),
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop'
    ],
    variants: { sizes: ['37', '38', '39', '40', '41', '42'], colors: ['Café Miel', 'Negro Graso'] },
    views_count: 3100,
    whatsapp_clicks: 245,
    category: 'Calzado & Cuero',
    is_active: true
  }
];

export async function getProducts(req, res) {
  const { category, search, madrugon, store_slug, commercial_center, sort } = req.query;

  try {
    let sql = `
      SELECT p.*, s.name as store_name, s.commercial_center, s.local_number, s.phone_whatsapp, s.slug as store_slug
      FROM products p
      JOIN stores s ON p.store_id = s.id
      WHERE p.is_active = true AND s.status = 'ACTIVE'
    `;
    const params = [];

    if (category && category !== 'Todos') {
      params.push(`%${category}%`);
      sql += ` AND (p.category ILIKE $${params.length})`;
    }

    if (search) {
      params.push(`%${search}%`);
      sql += ` AND (p.title ILIKE $${params.length} OR p.description ILIKE $${params.length} OR p.category ILIKE $${params.length})`;
    }

    if (madrugon === 'true') {
      sql += ` AND p.is_madrugon_deal = true`;
    }

    if (commercial_center) {
      params.push(`%${commercial_center}%`);
      sql += ` AND s.commercial_center ILIKE $${params.length}`;
    }

    if (sort === 'price_asc') {
      sql += ` ORDER BY p.price_retail ASC`;
    } else if (sort === 'price_desc') {
      sql += ` ORDER BY p.price_retail DESC`;
    } else {
      sql += ` ORDER BY p.is_madrugon_deal DESC, p.views_count DESC, p.created_at DESC`;
    }

    const result = await query(sql, params);
    if (result.rows.length > 0) return res.json(result.rows);
    return res.json(filterMockProducts(req.query));
  } catch (error) {
    return res.json(filterMockProducts(req.query));
  }
}

const SEED_REVIEWS = {
  'prod-001': [
    {
      id: 'rev-001-1',
      user_name: 'Marcela Gómez',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop',
      city: 'Medellín, Antioquia',
      rating: 5,
      date: 'Hace 3 días',
      is_verified_purchase: true,
      variant_info: 'Talla: 10 • Azul Clásico • Compra por Mayor (12 unidades)',
      comment: '¡Quedé fascinada con estos jeans! La tela rígida es 100% denim pesado como los de antes, no se deforma ni se estira con la postura. El tiro alto amolda la cintura divino. Mis clientas en Bello me los agotaron en el fin de semana. Seguiré surtiendo con Don Lucho.',
      helpful_votes: 38
    },
    {
      id: 'rev-001-2',
      user_name: 'Santiago Pardo',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop',
      city: 'Bogotá, D.C.',
      rating: 5,
      date: 'Hace 5 días',
      is_verified_purchase: true,
      variant_info: 'Talla: 8 • Azul Oscuro • Compra al Detal (1 unidad)',
      comment: 'Lo compré para un regalo a mi esposa. Le quedó a la medida exacta con la guía de tallas colombiana. Se nota que es confección de San Victorino de calidad, costuras impecables y el botón metálico bien remachado.',
      helpful_votes: 19
    },
    {
      id: 'rev-001-3',
      user_name: 'Yuliana Restrepo',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop',
      city: 'Cali, Valle del Cauca',
      rating: 5,
      date: 'Hace 1 semana',
      is_verified_purchase: true,
      variant_info: 'Talla: 12 • Hielo • Compra por Mayor (6 unidades)',
      comment: 'Muy buena calidad y el color hielo está en tendencia. El despacho por Envía llegó en dos días hábiles a Cali bien empacado con sus etiquetas de Sanvi. Muy recomendado para negocio.',
      helpful_votes: 14
    },
    {
      id: 'rev-001-4',
      user_name: 'Carlos Arturo M.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop',
      city: 'Bucaramanga, Santander',
      rating: 4,
      date: 'Hace 2 semanas',
      is_verified_purchase: true,
      variant_info: 'Talla: 14 • Azul Clásico • Compra por Mayor (6 unidades)',
      comment: 'El tiro alto es real, levanta y recoge muy bien. La tela es gruesa, no transparenta nada. Excelente precio de madrugón para reventa en Santander.',
      helpful_votes: 8
    }
  ],
  'prod-tec-001': [
    {
      id: 'rev-tec1-1',
      user_name: 'Andrés Felipe Castro',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop',
      city: 'Bogotá, D.C.',
      rating: 5,
      date: 'Hace 2 días',
      is_verified_purchase: true,
      variant_info: 'Color: Naranja Ultra • Compra al Detal',
      comment: 'Llegó el mismo día en Bogotá por mensajería Sanvi. La pantalla se ve súper nítida y las llamadas bluetooth se escuchan claras. Las dos correas son de buen material.',
      helpful_votes: 22
    },
    {
      id: 'rev-tec1-2',
      user_name: 'Camila Torres',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop',
      city: 'Barranquilla, Atlántico',
      rating: 5,
      date: 'Hace 4 días',
      is_verified_purchase: true,
      variant_info: 'Color: Negro Mate • Compra por Mayor (6 unidades)',
      comment: 'Excelente producto para mi local de accesorios. Vienen en su caja sellada con cargador inalámbrico magnético. Vuelvo a pedir.',
      helpful_votes: 17
    }
  ]
};

function enrichProduct(product) {
  if (!product) return product;
  if (!product.sold_count) {
    product.sold_count = product.id === 'prod-001' ? 1420 : Math.max(320, Math.round((product.views_count || 1200) * 0.45));
  }
  if (!product.rating) {
    product.rating = 4.9;
  }
  if (!product.reviews) {
    product.reviews = SEED_REVIEWS[product.id] || [
      {
        id: `rev-${product.id}-1`,
        user_name: 'Claudia Patricia M.',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop',
        city: 'Bogotá, D.C.',
        rating: 5,
        date: 'Hace 3 días',
        is_verified_purchase: true,
        variant_info: 'Compra Verificada en San Victorino',
        comment: 'Excelente relación calidad-precio. Llegó en perfectas condiciones y tal como se ve en las fotos del catálogo.',
        helpful_votes: 15
      },
      {
        id: `rev-${product.id}-2`,
        user_name: 'Juan David Herrera',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop',
        city: 'Medellín, Antioquia',
        rating: 5,
        date: 'Hace 6 días',
        is_verified_purchase: true,
        variant_info: 'Compra Mayorista Verificada',
        comment: 'Despacho rápido y producto de primera calidad para negocio. La atención y el empaque impecables.',
        helpful_votes: 9
      }
    ];
  }
  if (!product.reviews_count) {
    product.reviews_count = product.reviews.length + 42;
  }
  return product;
}

// Inicializar todos los mock products con datos de compras y reseñas
MOCK_PRODUCTS.forEach(enrichProduct);

function filterMockProducts({ category, search, madrugon, commercial_center, store_slug }) {
  let filtered = [...MOCK_PRODUCTS].map(enrichProduct);

  if (category && category !== 'Todos') {
    filtered = filtered.filter(p => p.category.toLowerCase().includes(category.toLowerCase()));
  }
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.store_name.toLowerCase().includes(q)
    );
  }
  if (madrugon === 'true') {
    filtered = filtered.filter(p => p.is_madrugon_deal);
  }
  if (commercial_center) {
    filtered = filtered.filter(p => p.commercial_center.toLowerCase().includes(commercial_center.toLowerCase()));
  }
  if (store_slug) {
    filtered = filtered.filter(p => p.store_slug === store_slug || p.store_id === store_slug);
  }

  return filtered;
}

export async function getProductById(req, res) {
  const { id } = req.params;

  try {
    const result = await query(
      `SELECT p.*, s.name as store_name, s.commercial_center, s.local_number, s.phone_whatsapp, s.slug as store_slug
       FROM products p
       JOIN stores s ON p.store_id = s.id
       WHERE p.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      const mock = MOCK_PRODUCTS.find(p => p.id === id || p.slug === id);
      if (mock) {
        enrichProduct(mock);
        return res.json(mock);
      }
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    query(`UPDATE products SET views_count = views_count + 1 WHERE id = $1`, [id]).catch(console.error);
    const enriched = enrichProduct(result.rows[0]);
    return res.json(enriched);
  } catch (error) {
    const mock = MOCK_PRODUCTS.find(p => p.id === id || p.slug === id);
    if (mock) {
      mock.views_count += 1;
      enrichProduct(mock);
      return res.json(mock);
    }
    return res.status(404).json({ error: 'Producto no encontrado' });
  }
}

export async function createProduct(req, res) {
  const {
    store_id,
    title,
    description,
    price_retail,
    price_wholesale,
    min_wholesale_qty,
    original_price,
    category,
    video_url,
    images,
    variants,
    is_madrugon_deal
  } = req.body;

  if (!title || !price_retail || !price_wholesale) {
    return res.status(400).json({ error: 'Título, precio al detal y precio mayorista son obligatorios' });
  }

  const slug = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const discount_percentage = original_price && original_price > price_retail
    ? Math.round(((original_price - price_retail) / original_price) * 100)
    : 0;

  const video_parsed = parseVideoUrl(video_url);

  try {
    const result = await query(
      `INSERT INTO products (
        store_id, title, slug, description, price_retail, price_wholesale, 
        min_wholesale_qty, original_price, discount_percentage, video_url, 
        images, variants, is_madrugon_deal, category
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *`,
      [
        store_id || 'store-006',
        title,
        slug,
        description || '',
        price_retail,
        price_wholesale,
        min_wholesale_qty || 6,
        original_price || (price_retail * 1.5),
        discount_percentage,
        video_url || null,
        JSON.stringify(images || []),
        JSON.stringify(variants || { standard: true }),
        Boolean(is_madrugon_deal),
        category || 'Tecnología & Celulares'
      ]
    );

    return res.status(201).json({
      message: '¡Producto publicado con éxito en Sanvi!',
      product: result.rows[0]
    });
  } catch (error) {
    const newProduct = {
      id: `prod-${Date.now()}`,
      store_id: store_id || 'store-006',
      store_name: 'TecnoMayoristas San Victorino',
      commercial_center: 'Plaza San Victorino',
      local_number: 'Local 38 - Pasaje Tecnológico',
      phone_whatsapp: '573118901234',
      title,
      slug,
      description,
      price_retail: Number(price_retail),
      price_wholesale: Number(price_wholesale),
      min_wholesale_qty: Number(min_wholesale_qty || 6),
      original_price: Number(original_price || price_retail * 1.5),
      discount_percentage,
      stock: 100,
      is_madrugon_deal: Boolean(is_madrugon_deal),
      video_url,
      video_parsed,
      images: images || ['https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop'],
      variants: variants || {},
      views_count: 1,
      whatsapp_clicks: 0,
      category: category || 'General',
      is_active: true
    };
    MOCK_PRODUCTS.unshift(newProduct);
    return res.status(201).json({
      message: '¡Producto publicado con éxito en Sanvi!',
      product: newProduct
    });
  }
}


export async function updateProduct(req, res) {
  const { id } = req.params;
  const {
    title,
    description,
    price_retail,
    price_wholesale,
    min_wholesale_qty,
    original_price,
    category,
    video_url,
    images,
    is_madrugon_deal,
    variants
  } = req.body;

  const discount_percentage = original_price && original_price > price_retail
    ? Math.round(((original_price - price_retail) / original_price) * 100)
    : 0;

  const video_parsed = video_url ? parseVideoUrl(video_url) : null;

  try {
    const result = await query(
      `UPDATE products SET
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        price_retail = COALESCE($3, price_retail),
        price_wholesale = COALESCE($4, price_wholesale),
        min_wholesale_qty = COALESCE($5, min_wholesale_qty),
        original_price = COALESCE($6, original_price),
        discount_percentage = $7,
        category = COALESCE($8, category),
        video_url = $9,
        images = COALESCE($10, images),
        is_madrugon_deal = COALESCE($11, is_madrugon_deal),
        variants = COALESCE($12, variants),
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $13
       RETURNING *`,
      [
        title,
        description,
        price_retail,
        price_wholesale,
        min_wholesale_qty,
        original_price,
        discount_percentage,
        category,
        video_url || null,
        images ? JSON.stringify(images) : null,
        is_madrugon_deal !== undefined ? Boolean(is_madrugon_deal) : null,
        variants ? JSON.stringify(variants) : null,
        id
      ]
    );

    const mockIndex = MOCK_PRODUCTS.findIndex((p) => p.id === id);
    if (mockIndex !== -1) {
      MOCK_PRODUCTS[mockIndex] = {
        ...MOCK_PRODUCTS[mockIndex],
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(price_retail && { price_retail: Number(price_retail) }),
        ...(price_wholesale && { price_wholesale: Number(price_wholesale) }),
        ...(min_wholesale_qty && { min_wholesale_qty: Number(min_wholesale_qty) }),
        ...(original_price && { original_price: Number(original_price) }),
        discount_percentage,
        ...(category && { category }),
        video_url: video_url !== undefined ? video_url : MOCK_PRODUCTS[mockIndex].video_url,
        video_parsed: video_url ? video_parsed : MOCK_PRODUCTS[mockIndex].video_parsed,
        ...(images && { images }),
        ...(variants && { variants }),
        ...(is_madrugon_deal !== undefined && { is_madrugon_deal: Boolean(is_madrugon_deal) })
      };
      return res.json({
        message: '¡Producto actualizado con éxito!',
        product: MOCK_PRODUCTS[mockIndex]
      });
    }

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado para actualizar' });
    }

    return res.json({
      message: '¡Producto actualizado con éxito!',
      product: result.rows[0]
    });
  } catch (error) {
    const mockIndex = MOCK_PRODUCTS.findIndex((p) => p.id === id);
    if (mockIndex !== -1) {
      MOCK_PRODUCTS[mockIndex] = {
        ...MOCK_PRODUCTS[mockIndex],
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(price_retail && { price_retail: Number(price_retail) }),
        ...(price_wholesale && { price_wholesale: Number(price_wholesale) }),
        ...(min_wholesale_qty && { min_wholesale_qty: Number(min_wholesale_qty) }),
        ...(original_price && { original_price: Number(original_price) }),
        discount_percentage,
        ...(category && { category }),
        video_url: video_url !== undefined ? video_url : MOCK_PRODUCTS[mockIndex].video_url,
        video_parsed: video_url ? video_parsed : MOCK_PRODUCTS[mockIndex].video_parsed,
        ...(images && { images }),
        ...(variants && { variants }),
        ...(is_madrugon_deal !== undefined && { is_madrugon_deal: Boolean(is_madrugon_deal) })
      };
      return res.json({
        message: '¡Producto actualizado con éxito!',
        product: MOCK_PRODUCTS[mockIndex]
      });
    }
    return res.status(404).json({ error: 'Producto no encontrado' });
  }
}

export async function deleteProduct(req, res) {
  const { id } = req.params;

  try {
    await query(`DELETE FROM products WHERE id = $1`, [id]);
    const mockIndex = MOCK_PRODUCTS.findIndex((p) => p.id === id);
    if (mockIndex !== -1) {
      MOCK_PRODUCTS.splice(mockIndex, 1);
    }
    return res.json({ message: 'Producto eliminado con éxito', id });
  } catch (error) {
    const mockIndex = MOCK_PRODUCTS.findIndex((p) => p.id === id);
    if (mockIndex !== -1) {
      MOCK_PRODUCTS.splice(mockIndex, 1);
    }
    return res.json({ message: 'Producto eliminado con éxito (modo memoria)', id });
  }
}

// ==========================================
// CALIFICACIONES Y RESEÑAS DE LA COMPRA (TEMU STYLE)
// ==========================================
export async function getProductReviews(req, res) {
  const { id } = req.params;
  const product = MOCK_PRODUCTS.find(p => p.id === id || p.slug === id);
  if (!product) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }
  enrichProduct(product);
  return res.json({
    product_id: product.id,
    rating: product.rating,
    reviews_count: product.reviews_count,
    sold_count: product.sold_count,
    reviews: product.reviews || []
  });
}

export async function addProductReview(req, res) {
  const { id } = req.params;
  const { user_name, rating, comment, city, variant_info, avatar } = req.body;

  if (!comment || !rating) {
    return res.status(400).json({ error: 'La calificación y el comentario son requeridos' });
  }

  const product = MOCK_PRODUCTS.find(p => p.id === id || p.slug === id);
  if (!product) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  enrichProduct(product);

  const newReview = {
    id: `rev-${Date.now()}`,
    user_name: user_name || 'Comprador Verificado',
    avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop',
    city: city || 'Bogotá, Colombia',
    rating: Number(rating) || 5,
    date: 'Justo ahora',
    is_verified_purchase: true,
    variant_info: variant_info || 'Compra Verificada en Sanvi',
    comment,
    helpful_votes: 1
  };

  product.reviews.unshift(newReview);
  product.reviews_count = (product.reviews_count || 0) + 1;
  const totalStars = product.reviews.reduce((acc, r) => acc + r.rating, 0);
  product.rating = Number((totalStars / product.reviews.length).toFixed(1));
  product.sold_count = (product.sold_count || 120) + 1;

  return res.status(201).json({
    message: '¡Reseña de compra publicada con éxito!',
    review: newReview,
    product: {
      id: product.id,
      rating: product.rating,
      reviews_count: product.reviews_count,
      sold_count: product.sold_count,
      reviews: product.reviews
    }
  });
}

