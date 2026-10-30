import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MOCK_STORES } from '../modules/stores/stores.controller.js';
import { MOCK_PRODUCTS } from '../modules/products/products.controller.js';

const { Client } = pg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function setup() {
  console.log('🔄 Iniciando configuración de base de datos PostgreSQL en Sanvi...');

  // 1. Conectar a postgres administrativo para crear sanvi_db si no existe
  const adminClient = new Client({
    connectionString: 'postgresql://postgres:postgres@localhost:5432/postgres'
  });

  try {
    await adminClient.connect();
    console.log('✓ Conectado a PostgreSQL local (puerto 5432).');

    const checkDb = await adminClient.query(
      "SELECT 1 FROM pg_database WHERE datname = 'sanvi_db'"
    );

    if (checkDb.rows.length === 0) {
      await adminClient.query('CREATE DATABASE sanvi_db');
      console.log('✓ Base de datos "sanvi_db" creada exitosamente.');
    } else {
      console.log('✓ Base de datos "sanvi_db" ya existe.');
    }
  } catch (err) {
    console.error('❌ Error conectando a PostgreSQL administrativo:', err.message);
    process.exit(1);
  } finally {
    await adminClient.end();
  }

  // 2. Conectar a sanvi_db y ejecutar schema.sql
  const sanviClient = new Client({
    connectionString: 'postgresql://postgres:postgres@localhost:5432/sanvi_db'
  });

  try {
    await sanviClient.connect();
    console.log('✓ Conectado a la base de datos "sanvi_db".');

    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await sanviClient.query(schemaSql);
    console.log('✓ Tablas creadas correctamente (stores, products, reviews, customers, memberships, whatsapp_leads).');

    // 3. Poblar Tiendas si están vacías
    const checkStores = await sanviClient.query('SELECT count(*) FROM stores');
    if (parseInt(checkStores.rows[0].count) === 0) {
      console.log('⏳ Poblando tiendas iniciales...');
      for (const s of MOCK_STORES) {
        await sanviClient.query(
          `INSERT INTO stores (
            id, name, slug, owner_name, email, password_hash, commercial_center,
            local_number, phone_whatsapp, logo_url, banner_url, description, is_verified, status
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
          ON CONFLICT (id) DO NOTHING`,
          [
            s.id,
            s.name,
            s.slug,
            s.owner_name,
            s.email,
            s.password_hash || 'hash_default',
            s.commercial_center,
            s.local_number,
            s.phone_whatsapp,
            s.logo_url || null,
            s.banner_url || null,
            s.description || '',
            Boolean(s.is_verified),
            s.status || 'ACTIVE'
          ]
        );
      }
      console.log(`✓ ${MOCK_STORES.length} tiendas guardadas en PostgreSQL.`);
    } else {
      console.log(`✓ Ya existen ${checkStores.rows[0].count} tiendas en la base de datos.`);
    }

    // 4. Poblar Productos si están vacíos
    const checkProds = await sanviClient.query('SELECT count(*) FROM products');
    if (parseInt(checkProds.rows[0].count) === 0) {
      console.log('⏳ Poblando catálogo de productos...');
      for (const p of MOCK_PRODUCTS) {
        await sanviClient.query(
          `INSERT INTO products (
            id, store_id, category, title, slug, description, price_retail, price_wholesale,
            min_wholesale_qty, original_price, discount_percentage, stock, sold_count, rating,
            reviews_count, is_madrugon_deal, video_url, images, variants, reviews, views_count, whatsapp_clicks, is_active
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
          ON CONFLICT (id) DO NOTHING`,
          [
            p.id,
            p.store_id || 'store-001',
            p.category || 'Varios',
            p.title,
            p.slug,
            p.description || '',
            p.price_retail,
            p.price_wholesale,
            p.min_wholesale_qty || 6,
            p.original_price || (p.price_retail * 1.5),
            p.discount_percentage || 0,
            p.stock || 100,
            p.sold_count || 120,
            p.rating || 4.9,
            p.reviews_count || 10,
            Boolean(p.is_madrugon_deal),
            p.video_url || null,
            JSON.stringify(p.images || []),
            JSON.stringify(p.variants || {}),
            JSON.stringify(p.reviews || []),
            p.views_count || 0,
            p.whatsapp_clicks || 0,
            true
          ]
        );
      }
      console.log(`✓ ${MOCK_PRODUCTS.length} productos guardados en PostgreSQL.`);
    } else {
      console.log(`✓ Ya existen ${checkProds.rows[0].count} productos en la base de datos.`);
    }

    // 5. Poblar Cliente de prueba (Camilo Matiz)
    await sanviClient.query(
      `INSERT INTO customers (id, name, email, city, login_type)
       VALUES ('cust-camilo', 'Camilo Matiz', 'camilomatiz114@gmail.com', 'Bogotá, Colombia', 'Google')
       ON CONFLICT (email) DO NOTHING`
    );
    console.log('✓ Cliente Camilo Matiz registrado en la base de datos.');

    console.log('\n======================================================');
    console.log('🎉 ¡BASE DE DATOS POSTGRESQL TOTALMENTE ACTIVA Y LISTA!');
    console.log('======================================================\n');
  } catch (err) {
    console.error('❌ Error configurando tablas:', err.message);
  } finally {
    await sanviClient.end();
  }
}

setup();
