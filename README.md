# 🛍️ SANVI - El Temu Colombiano de San Victorino

**Sanvi** es la plataforma digital de comercio mayorista y al detal diseñada para empoderar a los confeccionistas y comerciantes del sector de San Victorino en Bogotá (El Gran San, Neos Centro, Centro Mayorista Visto, El Trébol, Pasaje Rivas), combatiendo la invasión de Temu y Shein con sus propias armas pero adaptada al mercado nacional.

---

## 💎 Modelo de Negocio Disruptivo

* **0% Comisiones por Venta:** A diferencia de MercadoLibre o Amazon, el comerciante no pierde entre el 12% y el 18% de su margen.
* **Membresía Fija:** **$120.000 COP / mes** por local.
* **Economía de Escala:**
  * 100 tiendas = **$12.000.000 COP / mes** de ingresos recurrentes (MRR).
  * Costo de servidor en Contabo VPS = **~$45.000 COP / mes**.
  * **Margen operativo superior al 95%.**

---

## ⚡ Características Estilo Temu Implementadas

1. **Psicología Visual & Urgencia Temu:**
   * Banner de **"Liquidación Madrugón Sanvi"** con reloj regresivo interactivo (horas : minutos : segundos).
   * Badges de oportunidad: `-% de Descuento`, `⚡ Madrugón`, `🇨🇴 Confección Nacional`.
2. **Doble Precio Colombiano:**
   * **Precio al Detal:** (ej: $38.000 COP)
   * **Tarifa Mayorista:** (ej: $24.500 COP llevando a partir de 6 o 12 unidades).
3. **Cero Gasto de Almacenamiento en Video (TikTok & Shorts):**
   * Los comerciantes pegan enlaces de sus videos de TikTok o YouTube Shorts modelando las prendas.
   * Reproductor emergente integrado sin consumir ancho de banda de tu servidor.
4. **Compresor Automático de Imágenes a WebP:**
   * **Lado Cliente:** Convierte fotos pesadas de celulares (4-10 MB) a WebP ultraligero (~70-120 KB) antes de enviarlas.
   * **Lado Servidor:** Procesamiento adicional con la librería `sharp`.
5. **Cierre de Ventas en WhatsApp:**
   * Botón directo con mensaje pre-armado y registro de métricas para demostrarle al comerciante que sus $120.000 valen cada peso.
6. **Módulo de Panel de Comerciante:**
   * Estadísticas de clientes recibidos, ventas estimadas y gestión de renovación de membresía.

---

## 🏗️ Arquitectura Modular (Cero Código Espagueti)

* **Backend:** Node.js (ES Modules) + Express + PostgreSQL.
  * Modularizado en: `auth`, `stores`, `products`, `memberships`, `media`, `metrics`.
* **Frontend:** React + Vite + Tailwind CSS + Lucide Icons.
  * Mobile-first, compilación ultrarrápida (3.5 segundos, 230 KB total gzipped).
* **Base de Datos:** PostgreSQL con soporte para JSONB (tallas, variantes) y búsqueda en español.
* **Infraestructura:** Optimizado para desplegar en un **VPS de Contabo** con Nginx y **Cloudflare CDN**.

---

## 🚀 Cómo Iniciar en Desarrollo Local

1. **Instalar dependencias (ya completado):**
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

2. **Iniciar el ecosistema:**
   * En Windows: ejecuta `.\start-dev.ps1`
   * O manualmente:
     * Terminal 1: `cd backend && npm run dev` (API en `http://localhost:4000`)
     * Terminal 2: `cd frontend && npm run dev` (Web en `http://localhost:3000`)

Consulta el archivo [CONTABO_DEPLOY_GUIDE.md](file:///c:/Users/Camilo/Desktop/temucolombia/CONTABO_DEPLOY_GUIDE.md) para el despliegue en producción.

