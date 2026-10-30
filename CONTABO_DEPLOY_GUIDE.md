# 🚀 GUÍA DE DESPLIEGUE EN CONTABO VPS: PROYECTO SANVI

Esta guía detalla el paso a paso exacto para desplegar **Sanvi** en un servidor VPS de **Contabo**, garantizando alta velocidad en Colombia, seguridad y cero costos innecesarios.

---

## 1. Selección del VPS en Contabo

* **Plan recomendado:** **Cloud VPS S** (suficiente para hasta 500 locales y 50.000 visitas al mes) o **Cloud VPS M**.
* **Ubicación del Datacenter (CRÍTICO):** Selecciona **US East (New York o Miami)**.
  * *Razón:* La latencia a Bogotá es de solo 50 a 80 ms. Nunca elijas Alemania/Europa (180-220 ms).
* **Sistema Operativo:** **Ubuntu 24.04 LTS** o **Ubuntu 22.04 LTS**.

---

## 2. Preparación del Servidor (Comandos en Terminal SSH)

Conéctate a tu VPS por SSH:
```bash
ssh root@IP_DE_TU_CONTABO
```

Actualiza el sistema e instala las herramientas necesarias:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git curl ufw nginx postgresql postgresql-contrib
```

### Instalar Node.js 22 LTS:
```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
```

---

## 3. Configuración de PostgreSQL

1. Iniciar sesión en PostgreSQL:
```bash
sudo -u postgres psql
```

2. Crear base de datos y usuario para Sanvi:
```sql
CREATE DATABASE sanvi_db;
CREATE USER sanvi_user WITH ENCRYPTED PASSWORD 'TuPasswordSeguro123*';
GRANT ALL PRIVILEGES ON DATABASE sanvi_db TO sanvi_user;
\q
```

3. Importar la estructura modular de tablas:
```bash
cd /var/www/temucolombia/backend
psql -U sanvi_user -d sanvi_db -h localhost -f src/database/schema.sql
```

---

## 4. Clonar y Compilar Sanvi

```bash
cd /var/www
git clone <TU_REPOSITORIO> temucolombia
cd temucolombia

# Backend
cd backend
npm install --production
cp .env.example .env
nano .env # Ajustar DATABASE_URL con la contraseña de postgres

# Iniciar backend con PM2
pm2 start src/server.js --name sanvi-api
pm2 save
pm2 startup

# Frontend
cd ../frontend
npm install
npm run build
```

---

## 5. Configurar Nginx y Cloudflare (Cero Latencia en Bogotá)

Crea la configuración de Nginx:
```bash
sudo nano /etc/nginx/sites-available/sanvi.conf
```

Pega esta configuración optimizada:
```nginx
server {
    listen 80;
    server_name tu-dominio.com.co www.tu-dominio.com.co;

    # Frontend compilado (Vite)
    location / {
        root /var/www/temucolombia/frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # API Backend (Node.js)
    location /api/ {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Fotos WebP servidas a máxima velocidad con caché
    location /uploads/ {
        alias /var/www/temucolombia/backend/uploads/;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
}
```

Activa el sitio y reinicia Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/sanvi.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 6. Aceleración con Cloudflare (Paso Maestro)

1. En tu registrador de dominio (`.com.co` o `.co`), cambia los DNS a **Cloudflare (Plan Gratuito)**.
2. En Cloudflare, apunta el registro `A` hacia la IP de tu Contabo VPS con el **Proxy (Nube Naranja)** activado.
3. Cloudflare detectará a los usuarios en Colombia y entregará las fotos WebP y archivos del frontend desde su centro de datos en **Bogotá**, logrando que la aplicación cargue en menos de 0.5 segundos.

