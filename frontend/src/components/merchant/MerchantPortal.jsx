import React, { useState, useEffect } from 'react';
import {
  Store,
  Plus,
  Eye,
  MessageCircle,
  TrendingUp,
  ShieldCheck,
  ExternalLink,
  Trash2,
  Edit,
  Package,
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Building2,
  Copy,
  Check,
  Search,
  Flame,
  Zap,
  Tag,
  Share2,
  Award,
  AlertCircle,
  Clock,
  Sparkles,
  Camera
} from 'lucide-react';
import { isApparelOrFootwearCategory } from '../../utils/categoryHelper';
import { api } from '../../services/api';

export default function MerchantPortal({
  store,
  products,
  onOpenCreateProduct,
  onEditProduct,
  onOpenEditStore,
  onViewPublicStore,
  onBackToMarketplace,
  onDeleteProduct
}) {
  // Pestañas operativas estilo Temu Seller Central
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' | 'madrugon' | 'membership' | 'settings'
  const [filterSearch, setFilterSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('Todos');
  const [copiedLink, setCopiedLink] = useState(false);

  const [metrics, setMetrics] = useState({
    total_views: 0,
    total_whatsapp_clicks: 0,
    active_products: 0,
    conversion_rate: '0.0'
  });

  const [membership, setMembership] = useState({
    status: 'ACTIVE',
    amount: 120000,
    next_billing_date: '2026-11-28',
    payment_method: 'NEQUI'
  });

  const [renewing, setRenewing] = useState(false);
  const [renewed, setRenewed] = useState(false);

  useEffect(() => {
    if (store?.id) {
      api.getStoreMetrics(store.id).then(setMetrics).catch(() => {});
      api.getStoreMembership(store.id).then(setMembership).catch(() => {});
    }
  }, [store]);

  if (!store) return null;

  // Filtrar productos de este comercio
  const storeProducts = products.filter(
    (p) => p.store_id === store.id || p.store_name === store.name || p.store_slug === store.slug
  );

  const filteredStoreProducts = storeProducts.filter((p) => {
    const matchesSearch =
      !filterSearch ||
      p.title.toLowerCase().includes(filterSearch.toLowerCase()) ||
      p.category?.toLowerCase().includes(filterSearch.toLowerCase());
    const matchesCat = filterCategory === 'Todos' || p.category === filterCategory;
    return matchesSearch && matchesCat;
  });

  const formatCOP = (val) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const handleCopyStoreUrl = () => {
    const url = `${window.location.origin}/tienda/${store.slug}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleRenewPayment = async () => {
    setRenewing(true);
    try {
      await api.payMembership({
        store_id: store.id,
        payment_method: 'NEQUI_COLOMBIA'
      });
      setRenewed(true);
      setTimeout(() => {
        setRenewed(false);
        setRenewing(false);
      }, 2000);
    } catch (e) {
      setRenewing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F4F6] pb-20 font-sans text-[#222]">
      {/* 1. BARRA SUPERIOR OPERATIVA - TEMU SELLER CENTER STYLE */}
      <div className="bg-[#1C1D1F] text-white border-b-2 border-sanvi-orange sticky top-14 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 flex items-center justify-between gap-3">
          {/* Lado izquierdo: Identificación del Local */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={onBackToMarketplace}
              className="text-gray-300 hover:text-white flex items-center gap-1 text-xs font-bold transition-colors bg-white/10 hover:bg-white/20 px-2.5 py-1.5 rounded-lg shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Comprar en Sanvi</span>
            </button>

            <div className="h-5 w-px bg-white/20 hidden sm:block" />

            {/* Seller Badge */}
            <div className="flex items-center gap-2 min-w-0">
              <div className="bg-sanvi-orange text-white text-[11px] font-black px-2 py-0.5 rounded uppercase tracking-wider shrink-0">
                Seller Center
              </div>
              <div className="truncate">
                <span className="font-black text-sm text-white truncate block sm:inline">
                  {store.name}
                </span>
                <span className="text-[11px] text-gray-400 sm:ml-2 font-mono">
                  (ID: SV-{store.local_number?.replace(/\D/g, '') || '142'})
                </span>
              </div>
            </div>
          </div>

          {/* Lado derecho: Acciones rápidas */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyStoreUrl}
              className="hidden md:flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors border border-white/10"
              title="Copiar enlace de tu tienda pública"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-gray-300" />}
              <span>{copiedLink ? 'Copiado' : 'Link de Tienda'}</span>
            </button>

            {onOpenEditStore && (
              <button
                onClick={onOpenEditStore}
                className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-white/20 transition-all active:scale-95"
                title="Editar banner de portada, foto del cuadrito y datos del local"
              >
                <Camera className="w-3.5 h-3.5 text-sanvi-orange" />
                <span className="hidden sm:inline">Editar Portada & Logo</span>
                <span className="sm:hidden">Portada</span>
              </button>
            )}

            <button
              onClick={() => onViewPublicStore(store)}
              className="bg-white text-gray-900 hover:bg-gray-100 text-xs font-black px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
            >
              <Store className="w-3.5 h-3.5 text-sanvi-orange" />
              <span>Ver Tienda Pública</span>
              <ExternalLink className="w-3 h-3 text-gray-400 ml-0.5" />
            </button>

            <button
              onClick={onOpenCreateProduct}
              className="bg-sanvi-orange hover:bg-orange-600 text-white text-xs font-black px-3.5 py-1.5 rounded-lg flex items-center gap-1 shadow-md transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span className="hidden sm:inline">Publicar Prenda</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 mt-3 space-y-3">
        {/* 2. HEADER DE ESTADO DE LA TIENDA (TEMU MERCHANT BADGE BAR) */}
        <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-orange-50 border-2 border-sanvi-orange flex items-center justify-center font-black text-sanvi-orange text-lg shrink-0">
              {store.name?.slice(0, 2).toUpperCase() || 'SV'}
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-black text-gray-950">{store.name}</h2>
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-300 text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Local Físico Verificado
                </span>
                <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Award className="w-3 h-3 text-amber-700" />
                  Nivel Oro Sanvi
                </span>
              </div>
              <p className="text-xs text-gray-600 font-semibold flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-sanvi-orange" />
                {store.commercial_center} • {store.local_number} • Bogotá, Colombia
              </p>
              {onOpenEditStore && (
                <button
                  onClick={onOpenEditStore}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-sanvi-orange hover:text-orange-700 bg-orange-50 hover:bg-orange-100 border border-orange-200 px-2.5 py-0.5 rounded-md transition-colors mt-1"
                >
                  <Edit className="w-3 h-3" />
                  <span>Personalizar Portada, Logo & Local</span>
                </button>
              )}
            </div>
          </div>

          {/* Estado de Membresía Fija ($120.000 COP) */}
          <div className="flex items-center gap-2 bg-[#FFF9F2] border border-amber-200 px-3 py-2 rounded-xl w-full md:w-auto justify-between md:justify-end">
            <div className="text-left">
              <div className="text-[10px] font-black text-gray-500 uppercase tracking-wider">
                Membresía Mensual Fija
              </div>
              <div className="text-xs font-black text-gray-900 flex items-center gap-1">
                <span>$120.000 COP</span>
                <span className="bg-emerald-600 text-white text-[9px] px-1 py-0.2 rounded font-black">
                  0% Comisiones
                </span>
              </div>
            </div>

            <button
              onClick={handleRenewPayment}
              disabled={renewing}
              className="bg-gray-900 hover:bg-black text-white text-[11px] font-black px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all active:scale-95"
            >
              {renewed ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Al Día</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-3.5 h-3.5 text-yellow-400" />
                  <span>{renewing ? 'Verificando...' : 'Pagar Nequi/PSE'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 3. MÉTRICAS REALES Y VERIFICABLES DE TU LOCAL */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
          {/* Card 1: Visitas Reales al Catálogo */}
          <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between text-gray-500 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Visitas al Catálogo</span>
              <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <Eye className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-black text-gray-900 tracking-tight">
              {metrics.total_views || 0}
            </div>
            <div className="flex items-center gap-1 text-[10px] text-gray-500 font-medium mt-0.5">
              <span>Vistas totales en feed y tienda</span>
            </div>
          </div>

          {/* Card 2: Clics Reales al Botón de WhatsApp */}
          <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between text-gray-500 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Clics a tu WhatsApp</span>
              <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <MessageCircle className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-black text-emerald-700 tracking-tight">
              {metrics.total_whatsapp_clicks || 0}
            </div>
            <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-bold mt-0.5">
              <span>Personas que abrieron tu chat</span>
            </div>
          </div>

          {/* Card 3: Tasa de Interés / Efectividad Real */}
          <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between text-gray-500 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Efectividad de Contacto</span>
              <div className="w-6 h-6 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center">
                <TrendingUp className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-black text-amber-900 tracking-tight">
              {metrics.conversion_rate || '0.0'}%
            </div>
            <div className="flex items-center gap-1 text-[10px] text-amber-800 font-bold mt-0.5">
              <span>De cada 100 visitas te escriben</span>
            </div>
          </div>

          {/* Card 4: Productos Publicados Activos */}
          <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between text-gray-500 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Prendas en Venta</span>
              <div className="w-6 h-6 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
                <Package className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-black text-purple-900 tracking-tight">
              {filteredStoreProducts.length}
            </div>
            <div className="text-[10px] text-gray-500 font-semibold mt-0.5">
              <span>Artículos visibles a compradores</span>
            </div>
          </div>
        </div>

        {/* 4. BANNER OPERATIVO TEMU MADRUGÓN HUB */}
        <div className="bg-gradient-to-r from-orange-500 via-sanvi-orange to-red-500 rounded-xl p-3 sm:p-4 text-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="inline-flex items-center gap-1 bg-black/30 backdrop-blur-sm px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider text-yellow-300">
              <Flame className="w-3.5 h-3.5 text-yellow-300" />
              Impulso de Ventas Madrugón San Victorino
            </div>
            <h3 className="text-sm sm:text-base font-black">
              ¿Quieres 3 veces más pedidos esta semana?
            </h3>
            <p className="text-xs text-orange-100 max-w-xl font-medium">
              Activa la casilla <strong>"Destacar en Madrugón"</strong> en tus prendas para que aparezcan en el banner con cuenta regresiva en toda Colombia.
            </p>
          </div>

          <button
            onClick={onOpenCreateProduct}
            className="bg-yellow-400 hover:bg-yellow-300 text-gray-950 font-black text-xs px-4 py-2 rounded-lg shadow-md transition-all active:scale-95 shrink-0 flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 fill-gray-950" />
            <span>Publicar Prenda en Madrugón</span>
          </button>
        </div>

        {/* 5. GESTIÓN OPERATIVA DE PRODUCTOS (TABLA DE VENDEDOR PROFESIONAL ESTILO TEMU/PINDUODUO) */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          {/* Pestañas de Filtro del Vendedor */}
          <div className="border-b border-gray-200 bg-gray-50/70 px-4 pt-2.5 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab('inventory')}
                className={`px-3 py-2 text-xs font-black border-b-2 transition-all flex items-center gap-1.5 ${
                  activeTab === 'inventory'
                    ? 'border-sanvi-orange text-sanvi-orange bg-white rounded-t-lg shadow-sm'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>Mis Artículos en Venta</span>
                <span className="bg-gray-200 text-gray-700 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {storeProducts.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('madrugon')}
                className={`px-3 py-2 text-xs font-black border-b-2 transition-all flex items-center gap-1.5 ${
                  activeTab === 'madrugon'
                    ? 'border-sanvi-orange text-sanvi-orange bg-white rounded-t-lg shadow-sm'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-sanvi-red" />
                <span>En Madrugón</span>
                <span className="bg-red-100 text-sanvi-red text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {storeProducts.filter((p) => p.is_madrugon_deal).length}
                </span>
              </button>
            </div>

            {/* Buscador dentro del inventario del comerciante */}
            <div className="pb-2 w-full sm:w-64 relative">
              <input
                type="text"
                placeholder="Filtrar por nombre o categoría..."
                value={filterSearch}
                onChange={(e) => setFilterSearch(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg pl-8 pr-3 py-1.5 text-xs outline-none focus:border-sanvi-orange font-medium"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Tabla de Artículos del Comerciante */}
          {filteredStoreProducts.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <Package className="w-12 h-12 text-gray-300 mx-auto" />
              <p className="text-sm font-bold text-gray-600">No hay productos en esta vista.</p>
              <button
                onClick={onOpenCreateProduct}
                className="bg-sanvi-orange text-white text-xs font-black px-4 py-2 rounded-lg"
              >
                + Publicar Prenda Ahora
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-100/70 border-b border-gray-200 text-gray-600 font-black uppercase text-[10px] tracking-wider">
                    <th className="py-2.5 px-3">Producto / Prenda</th>
                    <th className="py-2.5 px-3">Categoría</th>
                    <th className="py-2.5 px-3">Precio Detal</th>
                    <th className="py-2.5 px-3">Precio Mayorista</th>
                    <th className="py-2.5 px-3">Estado</th>
                    <th className="py-2.5 px-3 text-center">Vistas</th>
                    <th className="py-2.5 px-3 text-center">WhatsApp</th>
                    <th className="py-2.5 px-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {filteredStoreProducts.map((prod) => (
                    <tr key={prod.id} className="hover:bg-orange-50/40 transition-colors">
                      {/* Producto con Miniatura WebP */}
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2.5 min-w-[240px]">
                          <div className="relative w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                            <img
                              src={(prod.images && prod.images[0]) || 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=200'}
                              alt={prod.title}
                              className="w-full h-full object-cover"
                            />
                            {prod.discount_percentage > 0 && (
                              <div className="absolute top-0 right-0 bg-sanvi-red text-white text-[8px] font-black px-1 rounded-bl">
                                -{prod.discount_percentage}%
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-gray-900 truncate max-w-[260px] text-xs leading-snug">
                              {prod.title}
                            </h4>
                            <div className="text-[10px] text-gray-400 font-mono flex items-center gap-1.5 flex-wrap">
                              <span>SKU: SV-{prod.id?.slice(-6) || 'PROD'}</span>
                              {isApparelOrFootwearCategory(prod.category) && prod.variants?.sizes && prod.variants.sizes.length > 0 && (
                                <span className="bg-indigo-50 text-indigo-700 font-bold px-1.5 py-0.2 rounded border border-indigo-200">
                                  Tallas: {prod.variants.sizes.join(', ')}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Categoría */}
                      <td className="py-2.5 px-3 text-gray-600 font-semibold whitespace-nowrap">
                        {prod.category}
                      </td>

                      {/* Precio Detal */}
                      <td className="py-2.5 px-3 font-black text-sanvi-red whitespace-nowrap">
                        {formatCOP(prod.price_retail)}
                      </td>

                      {/* Precio Mayorista */}
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <div className="bg-amber-100 text-amber-900 font-extrabold text-[11px] px-2 py-0.5 rounded inline-block">
                          {formatCOP(prod.price_wholesale)}
                        </div>
                        <div className="text-[9px] text-gray-400 mt-0.5">
                          Min. {prod.min_wholesale_qty || 6} unidades
                        </div>
                      </td>

                      {/* Estado */}
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        {prod.is_madrugon_deal ? (
                          <span className="bg-yellow-300 text-yellow-950 font-black text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 w-max">
                            <Flame className="w-3 h-3 text-red-600 fill-red-600" />
                            Madrugón Activo
                          </span>
                        ) : (
                          <span className="bg-gray-100 text-gray-700 font-bold text-[10px] px-2 py-0.5 rounded-full w-max">
                            Catálogo Estándar
                          </span>
                        )}
                      </td>

                      {/* Vistas */}
                      <td className="py-2.5 px-3 text-center font-bold text-gray-700 whitespace-nowrap">
                        {prod.views_count || 120}
                      </td>

                      {/* Clics de WhatsApp */}
                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                        <span className="font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          {prod.whatsapp_clicks || 14}
                        </span>
                      </td>

                      {/* Acciones Claras */}
                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Botón Principal EDITAR */}
                          <button
                            onClick={() => onEditProduct(prod)}
                            className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-300 font-bold px-2.5 py-1 rounded-md text-[11px] flex items-center gap-1 shadow-sm transition-all active:scale-95"
                            title="Editar título, precio al detal, mayor, fotos o video"
                          >
                            <Edit className="w-3.5 h-3.5 text-blue-600" />
                            <span>Editar</span>
                          </button>

                          {/* Ver en Tienda */}
                          <button
                            onClick={() => onViewPublicStore(store)}
                            className="p-1.5 text-gray-500 hover:text-sanvi-orange hover:bg-orange-50 rounded-md border border-gray-200 transition-colors"
                            title="Ver en tu tienda pública"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>

                          {/* Eliminar */}
                          <button
                            onClick={() => onDeleteProduct(prod.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md border border-gray-200 transition-colors"
                            title="Eliminar producto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
