-- ========================================================
-- PROYECTO SANVI - BASE DE DATOS POSTGRESQL
-- Arquitectura limpia para el comercio mayorista/detal de San Victorino
-- ========================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. TABLA DE TIENDAS / COMERCIANTES
CREATE TABLE IF NOT EXISTS stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) UNIQUE NOT NULL,
    owner_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    commercial_center VARCHAR(100) NOT NULL, -- Ej: 'El Gran San', 'Neos Centro', 'Visto', 'El Trébol'
    local_number VARCHAR(50) NOT NULL,       -- Ej: 'Local 214 - Piso 2'
    phone_whatsapp VARCHAR(30) NOT NULL,     -- Ej: '573123456789'
    logo_url VARCHAR(255),
    banner_url VARCHAR(255),
    description TEXT,
    is_verified BOOLEAN DEFAULT TRUE,        -- Validación de local físico en Bogotá
    status VARCHAR(30) DEFAULT 'ACTIVE',     -- 'ACTIVE', 'PENDIENTE_PAGO', 'SUSPENDIDO'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABLA DE MEMBRESÍAS ($120.000 COP MENSUALES)
CREATE TABLE IF NOT EXISTS memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) DEFAULT 120000.00, -- Cuota fija mensual
    status VARCHAR(30) DEFAULT 'ACTIVE',     -- 'ACTIVE', 'EXPIRED', 'TRIAL', 'PENDING'
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    next_billing_date DATE NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'NEQUI_DAVIPLATA_PSE',
    payment_reference VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. CATEGORÍAS
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    icon VARCHAR(50) DEFAULT 'tag',
    sort_order INT DEFAULT 0
);

-- 4. PRODUCTOS (ESTILO TEMU CON DOBLE PRECIO COLOMBIANO)
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(250) NOT NULL,
    description TEXT,
    price_retail NUMERIC(10, 2) NOT NULL,        -- Precio al detal (ej: $35.000)
    price_wholesale NUMERIC(10, 2) NOT NULL,     -- Precio por mayor (ej: $22.000)
    min_wholesale_qty INT DEFAULT 6,             -- Mínimo de unidades para precio mayorista
    original_price NUMERIC(10, 2),               -- Precio de referencia tachado (ej: $60.000)
    discount_percentage INT DEFAULT 0,           -- % de descuento visible estilo Temu
    stock INT DEFAULT 100,
    is_madrugon_deal BOOLEAN DEFAULT FALSE,      -- Oferta relámpago Madrugón
    video_url VARCHAR(500),                      -- Enlace TikTok o YouTube Short
    images JSONB DEFAULT '[]'::jsonb,            -- Lista de fotos comprimidas en WebP
    variants JSONB DEFAULT '{"sizes": ["S", "M", "L", "XL"], "colors": ["Negro", "Azul", "Blanco"]}'::jsonb,
    views_count INT DEFAULT 0,
    whatsapp_clicks INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. MÉTRICAS DE VENTAS Y CONTACTOS POR WHATSAPP (DEMOSTRACIÓN DE VALOR AL COMERCIANTE)
CREATE TABLE IF NOT EXISTS whatsapp_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    purchase_type VARCHAR(20) DEFAULT 'DETAL',   -- 'DETAL' o 'MAYOR'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ÍNDICES PARA BÚSQUEDA RÁPIDA
CREATE INDEX IF NOT EXISTS idx_products_store ON products(store_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_stores_status ON stores(status);

