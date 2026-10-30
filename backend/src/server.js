import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';

import storesRouter from './modules/stores/stores.routes.js';
import productsRouter from './modules/products/products.routes.js';
import membershipsRouter from './modules/memberships/memberships.routes.js';
import mediaRouter from './modules/media/media.routes.js';
import metricsRouter from './modules/metrics/metrics.routes.js';
import ordersRouter from './modules/orders/orders.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares globales
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir fotos comprimidas estáticas desde la carpeta /uploads
const UPLOAD_DIR = path.resolve('uploads');
app.use('/uploads', express.static(UPLOAD_DIR));

// Rutas modulares de la API
app.use('/api/stores', storesRouter);
app.use('/api/products', productsRouter);
app.use('/api/memberships', membershipsRouter);
app.use('/api/media', mediaRouter);
app.use('/api/metrics', metricsRouter);
app.use('/api/orders', ordersRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    project: 'Sanvi - El Temu Colombiano de San Victorino',
    currency: 'COP',
    membership_rate: '120.000 COP / mes',
    timestamp: new Date().toISOString()
  });
});

// Manejador de 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada en la API de Sanvi' });
});

// Servidor escuchando
app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 SANVI BACKEND corriendo en: http://localhost:${PORT}`);
  console.log(`🛍️ Modelo de Membresía: $120.000 COP / mes por comerciante`);
  console.log(`📸 Compresión WebP activa en /uploads`);
  console.log(`📹 Parser de TikTok y YouTube Shorts listo`);
  console.log(`======================================================\n`);
});

