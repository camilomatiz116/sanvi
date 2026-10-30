const API_BASE = '/api';

export const api = {
  // Productos y Feed Temu
  async getProducts(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    const res = await fetch(`${API_BASE}/products?${query.toString()}`);
    return res.json();
  },

  async getProductById(id) {
    const res = await fetch(`${API_BASE}/products/${id}`);
    return res.json();
  },

  async getProductReviews(id) {
    const res = await fetch(`${API_BASE}/products/${id}/reviews`);
    return res.json();
  },

  async addProductReview(id, reviewData) {
    const res = await fetch(`${API_BASE}/products/${id}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData)
    });
    return res.json();
  },

  async createProduct(productData) {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });
    return res.json();
  },

  async updateProduct(id, productData) {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });
    return res.json();
  },

  async deleteProduct(id) {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  // Tiendas / Locales de San Victorino
  async getStores() {
    const res = await fetch(`${API_BASE}/stores`);
    return res.json();
  },

  async getStoreBySlug(slug) {
    const res = await fetch(`${API_BASE}/stores/${slug}`);
    return res.json();
  },

  async registerStore(storeData) {
    const res = await fetch(`${API_BASE}/stores/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(storeData)
    });
    return res.json();
  },

  async updateStore(id, storeData) {
    const res = await fetch(`${API_BASE}/stores/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(storeData)
    });
    return res.json();
  },

  // Subir imagen con compresión del servidor
  async uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch(`${API_BASE}/media/upload`, {
      method: 'POST',
      body: formData
    });
    return res.json();
  },

  // Parsear video de TikTok o YouTube Shorts
  async parseVideo(url) {
    const res = await fetch(`${API_BASE}/media/parse-video`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });
    return res.json();
  },

  // Métricas de WhatsApp (valor del comerciante)
  async trackWhatsApp(data) {
    return fetch(`${API_BASE}/metrics/whatsapp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  async getStoreMetrics(storeId) {
    const res = await fetch(`${API_BASE}/metrics/store/${storeId}`);
    return res.json();
  },

  // Membresía ($120.000 COP)
  async getStoreMembership(storeId) {
    const res = await fetch(`${API_BASE}/memberships/${storeId}`);
    return res.json();
  },

  async payMembership(data) {
    const res = await fetch(`${API_BASE}/memberships/pay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Pedidos y Compras Directas en Plataforma (Estilo Temu)
  async createOrder(orderData) {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    return res.json();
  },

  async getOrderById(id) {
    const res = await fetch(`${API_BASE}/orders/${id}`);
    return res.json();
  },

  async getStoreOrders(storeId) {
    const res = await fetch(`${API_BASE}/orders/store/${storeId}`);
    return res.json();
  },

  async updateOrderStatus(orderId, updateData) {
    const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });
    return res.json();
  },

  async deleteOrder(orderId) {
    const res = await fetch(`${API_BASE}/orders/${orderId}`, {
      method: 'DELETE'
    });
    return res.json();
  }
};

