-- ========================================================
-- PROYECTO SANVI - BASE DE DATOS POSTGRESQL
-- Arquitectura limpia para el comercio mayorista/detal de San Victorino
-- ========================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. TABLA DE TIENDAS / COMERCIANTES
CREATE TABLE IF NOT EXISTS stores (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) UNIQUE NOT NULL,
    owner_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    commercial_center VARCHAR(100) NOT NULL, -- Ej: 'El Gran San', 'Neos Centro', 'Visto', 'El Trébol'
    local_number VARCHAR(50) NOT NULL,       -- Ej: 'Local 214 - Piso 2'
    phone_whatsapp VARCHAR(30) NOT NULL,     -- Ej: '573123456789'
    logo_url VARCHAR(500),
    banner_url VARCHAR(500),
    description TEXT,
    is_verified BOOLEAN DEFAULT TRUE,        -- Validación de local físico en Bogotá
    status VARCHAR(30) DEFAULT 'ACTIVE',     -- 'ACTIVE', 'PENDIENTE_PAGO', 'SUSPENDIDO'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABLA DE MEMBRESÍAS ($120.000 COP MENSUALES)
CREATE TABLE IF NOT EXISTS memberships (
    id VARCHAR(100) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    store_id VARCHAR(100) NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) DEFAULT 120000.00, -- Cuota fija mensual
    status VARCHAR(30) DEFAULT 'ACTIVE',     -- 'ACTIVE', 'EXPIRED', 'TRIAL', 'PENDING'
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    next_billing_date DATE NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'NEQUI_DAVIPLATA_PSE',
    payment_reference VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. PRODUCTOS (ESTILO TEMU CON DOBLE PRECIO COLOMBIANO, VENTAS Y RESEÑAS)
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(100) PRIMARY KEY,
    store_id VARCHAR(100) NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL,
    title VARCHAR(250) NOT NULL,
    slug VARCHAR(250) NOT NULL,
    description TEXT,
    price_retail NUMERIC(10, 2) NOT NULL,        -- Precio al detal (ej: $35.000)
    price_wholesale NUMERIC(10, 2) NOT NULL,     -- Precio por mayor (ej: $22.000)
    min_wholesale_qty INT DEFAULT 6,             -- Mínimo de unidades para precio mayorista
    original_price NUMERIC(10, 2),               -- Precio de referencia tachado (ej: $60.000)
    discount_percentage INT DEFAULT 0,           -- % de descuento visible estilo Temu
    stock INT DEFAULT 100,
    sold_count INT DEFAULT 0,                    -- Número de ventas realizadas
    rating NUMERIC(3, 1) DEFAULT 4.9,            -- Calificación promedio
    reviews_count INT DEFAULT 0,                 -- Cantidad de reseñas
    is_madrugon_deal BOOLEAN DEFAULT FALSE,      -- Oferta relámpago Madrugón
    video_url VARCHAR(500),                      -- Enlace TikTok o YouTube Short
    images JSONB DEFAULT '[]'::jsonb,            -- Lista de fotos comprimidas en WebP
    variants JSONB DEFAULT '{"sizes": ["S", "M", "L", "XL"], "colors": ["Negro", "Azul", "Blanco"]}'::jsonb,
    reviews JSONB DEFAULT '[]'::jsonb,           -- Historial de reseñas de compra
    views_count INT DEFAULT 0,
    whatsapp_clicks INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. TABLA DE RESEÑAS DE COMPRA POR PRODUCTO
CREATE TABLE IF NOT EXISTS reviews (
    id VARCHAR(100) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    product_id VARCHAR(100) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_name VARCHAR(150) NOT NULL,
    avatar VARCHAR(500),
    city VARCHAR(100) DEFAULT 'Bogotá, Colombia',
    rating INT DEFAULT 5,
    comment TEXT NOT NULL,
    variant_info VARCHAR(200),
    helpful_votes INT DEFAULT 0,
    is_verified_purchase BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. TABLA DE CLIENTES / COMPRADORES
CREATE TABLE IF NOT EXISTS customers (
    id VARCHAR(100) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE,
    phone VARCHAR(50),
    avatar VARCHAR(500),
    city VARCHAR(100) DEFAULT 'Bogotá, Colombia',
    login_type VARCHAR(50) DEFAULT 'Google',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. MÉTRICAS DE VENTAS Y CONTACTOS POR WHATSAPP
CREATE TABLE IF NOT EXISTS whatsapp_leads (
    id VARCHAR(100) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    store_id VARCHAR(100) NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    product_id VARCHAR(100) REFERENCES products(id) ON DELETE SET NULL,
    purchase_type VARCHAR(20) DEFAULT 'DETAL',   -- 'DETAL' o 'MAYOR'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ÍNDICES PARA BÚSQUEDA RÁPIDA
CREATE INDEX IF NOT EXISTS idx_products_store ON products(store_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
