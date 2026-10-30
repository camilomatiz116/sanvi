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
  Wallet,
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
  Camera,
  Truck,
  Printer,
  Phone,
  MapPin,
  User,
  FileText,
  Calendar,
  X,
  ChevronDown
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
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'inventory' | 'madrugon'
  const [filterSearch, setFilterSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('Todos');
  const [copiedLink, setCopiedLink] = useState(false);

  // Estados de Pedidos y Despachos
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [orderFilter, setOrderFilter] = useState('ALL'); // 'ALL' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED'
  const [shippingModalOrder, setShippingModalOrder] = useState(null);
  const [shippingCourier, setShippingCourier] = useState('Servientrega');
  const [shippingTracking, setShippingTracking] = useState('');
  const [savingShipping, setSavingShipping] = useState(false);
  const [shippingLabelOrder, setShippingLabelOrder] = useState(null);

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

  const loadStoreOrders = async () => {
    if (!store?.id) return;
    try {
      setLoadingOrders(true);
      const data = await api.getStoreOrders(store.id);
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error cargando pedidos:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (store?.id) {
      api.getStoreMetrics(store.id).then(setMetrics).catch(() => {});
      api.getStoreMembership(store.id).then(setMembership).catch(() => {});
      loadStoreOrders();
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
    try {
      setRenewing(true);
      const res = await api.payMembership({
        store_id: store.id,
        amount: 120000,
        payment_method: 'NEQUI'
      });
      if (res && res.membership) {
        setMembership(res.membership);
        setRenewed(true);
        setTimeout(() => setRenewed(false), 4000);
      }
    } catch (e) {
      alert('Error renovando membresía. Intenta de nuevo.');
    } finally {
      setRenewing(false);
    }
  };

  // Contactar al comprador por WhatsApp con mensaje prearmado
  const handleWhatsAppCustomer = (order) => {
    const phone = order.customer_phone ? String(order.customer_phone).replace(/\D/g, '') : '';
    const fullPhone = phone.startsWith('57') ? phone : `57${phone}`;
    const itemsSummary = order.items?.map(it => `${it.quantity}x ${it.title} (${it.variant_size ? `Talla: ${it.variant_size}` : ''} ${it.variant_color ? `Color: ${it.variant_color}` : ''})`).join(', ') || 'Prendas';
    const msg = encodeURIComponent(
      `Hola *${order.customer_name}*, te saludamos de *${store.name}* (Bodegas San Victorino Bogotá).\n\n` +
      `📦 Recibimos tu pedido *#${order.order_number}* por valor de *${formatCOP(order.total_amount)}*.\n` +
      `🛍️ *Prendas:* ${itemsSummary}\n` +
      `📍 *Dirección de Entrega:* ${order.shipping_address}, ${order.shipping_city || 'Bogotá'}.\n` +
      `${order.shipping_notes ? `📝 *Indicaciones:* ${order.shipping_notes}\n` : ''}` +
      `\nYa estamos preparando tu paquete para despacho inmediato. ¿Deseas confirmar algún detalle adicional para la entrega?`
    );
    window.open(`https://wa.me/${fullPhone}?text=${msg}`, '_blank');
  };

  // Actualizar estado de despacho de la orden
  const handleSaveShippingStatus = async (e) => {
    e.preventDefault();
    if (!shippingModalOrder) return;
    try {
      setSavingShipping(true);
      await api.updateOrderStatus(shippingModalOrder.id, {
        status: 'SHIPPED',
        courier_name: shippingCourier,
        tracking_number: shippingTracking
      });
      setShippingModalOrder(null);
      setShippingTracking('');
      loadStoreOrders();
    } catch (err) {
      alert('Error actualizando el despacho. Inténtalo de nuevo.');
    } finally {
      setSavingShipping(false);
    }
  };

  const handleMarkAsDelivered = async (orderId) => {
    if (!confirm('¿Confirmas que el paquete ya fue entregado con éxito al cliente?')) return;
    try {
      await api.updateOrderStatus(orderId, { status: 'DELIVERED' });
      loadStoreOrders();
    } catch (err) {
      alert('Error actualizando estado.');
    }
  };

  const handleDeleteOrder = async (orderId, orderNumber) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar permanentemente el pedido #${orderNumber}?`)) {
      return;
    }
    try {
      await api.deleteOrder(orderId);
      setOrders((prev) => prev.filter((o) => o.id !== orderId && o.order_number !== orderId));
      loadStoreOrders();
    } catch (err) {
      alert('Error eliminando el pedido.');
    }
  };

  // Filtrado de órdenes
  const filteredOrders = orders.filter((o) => {
    if (orderFilter === 'ALL') return true;
    return o.status === orderFilter;
  });

  const pendingOrdersCount = orders.filter((o) => o.status === 'PROCESSING').length;
  const totalSalesAmount = orders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);

  return (
    <div className="min-h-screen bg-[#F4F4F6] pb-24 text-gray-900">
      {/* 1. BARRA SUPERIOR DE CONTROL OPERATIVO */}
      <div className="bg-gray-950 text-white sticky top-14 z-30 px-3 sm:px-4 py-2.5 shadow-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              onClick={onBackToMarketplace}
              className="text-gray-400 hover:text-white text-xs font-bold flex items-center gap-1 bg-gray-900 px-2.5 py-1.5 rounded-lg border border-gray-800 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Comprar en Sanvi</span>
            </button>

            <span className="bg-sanvi-orange text-white text-[10px] font-black px-2 py-0.5 rounded tracking-wide uppercase">
              Seller Center
            </span>

            <span className="text-xs sm:text-sm font-black text-gray-200 truncate max-w-[200px] sm:max-w-xs">
              {store.name} <span className="text-gray-500 text-xs font-normal">({store.local_number})</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyStoreUrl}
              className="bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-bold px-2.5 py-1.5 rounded-lg border border-gray-700 flex items-center gap-1.5 transition-all shadow-xs"
              title="Copiar enlace directo a tu catálogo de San Victorino"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copiedLink ? '¡Enlace Copiado!' : 'Link de Tienda'}</span>
            </button>

            <button
              onClick={() => onOpenEditStore('profile')}
              className="bg-gray-800 hover:bg-gray-700 text-yellow-400 border border-gray-700 text-xs font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-xs"
              title="Cambiar la foto de portada (banner), el logo y los datos del local"
            >
              <Camera className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Editar Portada & Logo</span>
            </button>

            <button
              onClick={() => onViewPublicStore(store)}
              className="bg-white hover:bg-gray-100 text-gray-900 text-xs font-black px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm transition-all"
              title="Ver tu tienda exactamente como la ven los clientes en Sanvi"
            >
              <Eye className="w-3.5 h-3.5 text-sanvi-orange" />
              <span className="hidden sm:inline">Ver Tienda Pública</span>
            </button>

            <button
              onClick={onOpenCreateProduct}
              className="bg-gradient-to-r from-sanvi-orange to-[#FA2C19] hover:from-orange-600 hover:to-red-600 text-white text-xs font-black px-3.5 py-1.5 rounded-lg shadow-md transition-all flex items-center gap-1.5 active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Publicar Prenda</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 mt-4 space-y-4">
        
        {/* 2. CABECERA RESUMEN DEL LOCAL + MEMBRESÍA PLANA SANVI */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            {store.logo_url ? (
              <img
                src={store.logo_url}
                alt={store.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-sanvi-orange shadow-md shrink-0 bg-white"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-100 to-amber-200 border-2 border-sanvi-orange text-amber-900 flex items-center justify-center font-black text-lg shadow-md shrink-0">
                {store.name.substring(0, 2).toUpperCase()}
              </div>
            )}

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-xl font-black text-gray-950 truncate">{store.name}</h1>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Local Físico Verificado
                </span>
                <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-full">
                  Nivel Oro Sanvi
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500 font-semibold mt-1 flex-wrap">
                <span>📍 {store.commercial_center} • {store.local_number} • Bogotá, Colombia</span>
              </div>

              <div className="flex items-center gap-2 text-[11px] font-bold mt-1 text-gray-500 flex-wrap">
                <button onClick={() => onOpenEditStore('profile')} className="text-sanvi-orange hover:underline flex items-center gap-1">
                  <Edit className="w-3 h-3" />
                  <span>Personalizar Portada, Logo & Local</span>
                </button>
                <span>•</span>
                <span className="text-emerald-700">Pasarelas Colombianas (Nequi, Wompi, Daviplata)</span>
              </div>
            </div>
          </div>

          {/* Tarjeta de Membresía Fija Sanvi ($120.000 COP) */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex items-center justify-between sm:justify-end gap-3 shrink-0">
            <div>
              <div className="text-[10px] uppercase font-black text-gray-500 tracking-wider">
                Membresía Mensual Fija
              </div>
              <div className="text-xs sm:text-sm font-black text-gray-900 flex items-center gap-1">
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

        {/* 3. PANEL DE RESUMEN COMERCIAL PROFESIONAL (ESTILO MERCADO LIBRE / TEMU SELLER) */}
        <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs overflow-hidden">
          {/* Barra Superior del Panel */}
          <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between gap-3 bg-gray-50/50">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-xs font-black uppercase tracking-wider text-gray-700">
                Resumen de Operación Comercial
              </h2>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 bg-white border border-gray-200 px-2.5 py-1 rounded-lg">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <span>Últimos 7 días</span>
            </div>
          </div>

          {/* Bloques de Métricas Integrados (Sin cajitas infantiles ni bolitas de colores) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
            
            {/* Bloque 1: Ventas en Plataforma */}
            <div className="p-4 sm:p-5 space-y-1 hover:bg-gray-50/50 transition-colors">
              <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">
                Ventas Facturadas
              </div>
              <div className="text-2xl font-black text-gray-950 tracking-tight">
                {formatCOP(totalSalesAmount)}
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500">
                <span className="text-emerald-700 font-bold">✓ {orders.length} pedidos</span>
                <span>• Wompi / Pasarelas</span>
              </div>
            </div>

            {/* Bloque 2: Logística y Despachos */}
            <div 
              onClick={() => setActiveTab('orders')}
              className="p-4 sm:p-5 space-y-1 cursor-pointer hover:bg-orange-50/40 transition-colors group"
            >
              <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wide flex items-center justify-between">
                <span>Despachos Pendientes</span>
                <span className="text-sanvi-orange text-[10px] font-black group-hover:translate-x-0.5 transition-transform">
                  Ver lista →
                </span>
              </div>
              <div className="text-2xl font-black tracking-tight flex items-baseline gap-2">
                <span className={pendingOrdersCount > 0 ? 'text-sanvi-red' : 'text-gray-950'}>
                  {pendingOrdersCount}
                </span>
                <span className="text-xs text-gray-500 font-bold">
                  {pendingOrdersCount === 1 ? 'paquete por enviar' : 'paquetes por enviar'}
                </span>
              </div>
              <div className="text-[11px] text-gray-500 font-medium">
                {pendingOrdersCount > 0 ? (
                  <span className="text-amber-700 font-bold">⚡ Requiere despacho hoy</span>
                ) : (
                  <span className="text-emerald-700 font-bold">✓ Envíos al día</span>
                )}
              </div>
            </div>

            {/* Bloque 3: Vistas al Catálogo */}
            <div className="p-4 sm:p-5 space-y-1 hover:bg-gray-50/50 transition-colors">
              <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">
                Visualizaciones de Vitrina
              </div>
              <div className="text-2xl font-black text-gray-950 tracking-tight">
                {(metrics.total_views || 3100).toLocaleString('es-CO')}
              </div>
              <div className="text-[11px] text-gray-500 font-medium">
                <span className="text-blue-700 font-bold">Tráfico orgánico</span> en marketplace y tienda
              </div>
            </div>

            {/* Bloque 4: Contactos Comerciales */}
            <div className="p-4 sm:p-5 space-y-1 hover:bg-gray-50/50 transition-colors">
              <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">
                Contactos Comerciales
              </div>
              <div className="text-2xl font-black text-gray-950 tracking-tight">
                {metrics.total_whatsapp_clicks || 245}
              </div>
              <div className="text-[11px] text-gray-500 font-medium">
                <span className="text-emerald-700 font-bold">{metrics.conversion_rate || '7.9'}%</span> efectividad de contacto
              </div>
            </div>

          </div>
        </div>

        {/* 4. PLATAFORMAS DE COBRO COLOMBIANAS */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-sanvi-orange" />
                <h3 className="text-sm sm:text-base font-black text-gray-900">
                  Plataformas de Cobro Colombianas de tu Local
                </h3>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full">
                  0% Comisiones Sanvi
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Tus clientes te pagan directamente a tus cuentas sin intermediarios.
              </p>
            </div>

            <button
              onClick={() => onOpenEditStore('payments')}
              className="bg-gray-900 hover:bg-black text-white text-xs font-black px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-xs"
            >
              <CreditCard className="w-3.5 h-3.5 text-yellow-400" />
              <span>Configurar Medios de Pago</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
            {/* Nequi */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-7 h-7 rounded-lg bg-[#20002c] text-[#ff007a] font-black text-xs flex items-center justify-center shrink-0">
                  N
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-gray-900">Nequi Negocios</p>
                  <p className="text-[11px] text-gray-500 font-medium truncate">
                    {store.nequi_number || store.phone_whatsapp || '3102345678'}
                  </p>
                </div>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black px-1.5 py-0.5 rounded">
                Activo
              </span>
            </div>

            {/* Wompi */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-7 h-7 rounded-lg bg-[#00109b] text-white font-black text-xs flex items-center justify-center shrink-0">
                  W
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-gray-900">Wompi Bancolombia</p>
                  <p className="text-[11px] text-gray-500 font-medium truncate">
                    {store.wompi_public_key ? 'Llave vinculada' : store.wompi_link ? 'Link configurado' : 'Wompi Activo'}
                  </p>
                </div>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black px-1.5 py-0.5 rounded">
                Activo
              </span>
            </div>

            {/* Daviplata */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-7 h-7 rounded-lg bg-[#ed1c24] text-white font-black text-xs flex items-center justify-center shrink-0">
                  D
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-gray-900">Daviplata</p>
                  <p className="text-[11px] text-gray-500 font-medium truncate">
                    {store.daviplata_number || store.phone_whatsapp || '3102345678'}
                  </p>
                </div>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black px-1.5 py-0.5 rounded">
                Activo
              </span>
            </div>

            {/* Contra Entrega */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center shrink-0">
                  📦
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-gray-900">Contra Entrega & Bold</p>
                  <p className="text-[11px] text-gray-500 font-medium truncate">
                    Contra Entrega Bogotá
                  </p>
                </div>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black px-1.5 py-0.5 rounded">
                Activo
              </span>
            </div>
          </div>
        </div>

        {/* 5. GESTIÓN OPERATIVA: PESTAÑAS PRINCIPALES DEL VENDEDOR (SEGMENTED CONTROL MODERNO) */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          {/* Header de Pestañas Estilo Píldoras Destacadas */}
          <div className="border-b border-gray-200 bg-gray-50/80 px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
            {/* Contenedor Segmented Control de Pestañas */}
            <div className="bg-gray-200/80 p-1 rounded-xl flex items-center gap-1 shadow-inner">
              
              {/* PESTAÑA 1: PEDIDOS Y DESPACHOS */}
              <button
                type="button"
                onClick={() => setActiveTab('orders')}
                className={`px-4 py-2 text-xs font-black rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-gradient-to-r from-orange-500 to-[#FA2C19] text-white shadow-md scale-[1.02]'
                    : 'text-gray-600 hover:text-gray-950 hover:bg-white/60'
                }`}
              >
                <Truck className={`w-3.5 h-3.5 ${activeTab === 'orders' ? 'text-white' : 'text-gray-500'}`} />
                <span>Pedidos y Despachos</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                  activeTab === 'orders'
                    ? 'bg-white text-sanvi-red shadow-xs'
                    : pendingOrdersCount > 0
                    ? 'bg-sanvi-red text-white animate-pulse'
                    : 'bg-gray-300 text-gray-800'
                }`}>
                  {orders.length}
                </span>
              </button>

              {/* PESTAÑA 2: MIS ARTÍCULOS EN VENTA */}
              <button
                type="button"
                onClick={() => setActiveTab('inventory')}
                className={`px-4 py-2 text-xs font-black rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'inventory'
                    ? 'bg-gradient-to-r from-orange-500 to-[#FA2C19] text-white shadow-md scale-[1.02]'
                    : 'text-gray-600 hover:text-gray-950 hover:bg-white/60'
                }`}
              >
                <Package className={`w-3.5 h-3.5 ${activeTab === 'inventory' ? 'text-white' : 'text-gray-500'}`} />
                <span>Mis Artículos en Venta</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  activeTab === 'inventory'
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'bg-gray-300 text-gray-800'
                }`}>
                  {storeProducts.length}
                </span>
              </button>

              {/* PESTAÑA 3: EN MADRUGÓN */}
              <button
                type="button"
                onClick={() => setActiveTab('madrugon')}
                className={`px-4 py-2 text-xs font-black rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'madrugon'
                    ? 'bg-gradient-to-r from-orange-500 to-[#FA2C19] text-white shadow-md scale-[1.02]'
                    : 'text-gray-600 hover:text-gray-950 hover:bg-white/60'
                }`}
              >
                <Flame className={`w-3.5 h-3.5 ${activeTab === 'madrugon' ? 'text-yellow-300 fill-yellow-300' : 'text-red-500'}`} />
                <span>En Madrugón</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  activeTab === 'madrugon'
                    ? 'bg-yellow-300 text-gray-950 shadow-xs font-black'
                    : 'bg-red-100 text-sanvi-red'
                }`}>
                  {storeProducts.filter((p) => p.is_madrugon_deal).length}
                </span>
              </button>
            </div>

            {/* Acciones de filtro según la pestaña */}
            {activeTab === 'orders' ? (
              <div className="flex items-center gap-1 pb-2">
                <button
                  onClick={() => setOrderFilter('ALL')}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-md transition-colors ${
                    orderFilter === 'ALL' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Todos ({orders.length})
                </button>
                <button
                  onClick={() => setOrderFilter('PROCESSING')}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-md transition-colors ${
                    orderFilter === 'PROCESSING' ? 'bg-amber-500 text-white' : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Pendientes ({orders.filter(o => o.status === 'PROCESSING').length})
                </button>
                <button
                  onClick={() => setOrderFilter('SHIPPED')}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-md transition-colors ${
                    orderFilter === 'SHIPPED' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  En Camino ({orders.filter(o => o.status === 'SHIPPED').length})
                </button>
              </div>
            ) : (
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
            )}
          </div>

          {/* ======================================================== */}
          {/* CONTENIDO VISTA 1: PEDIDOS Y DESPACHOS DEL VENDEDOR      */}
          {/* ======================================================== */}
          {activeTab === 'orders' && (
            <div className="p-4 sm:p-5 space-y-4">
              {loadingOrders ? (
                <div className="text-center py-12 space-y-2">
                  <div className="w-8 h-8 border-3 border-sanvi-orange border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs font-bold text-gray-500">Cargando pedidos de tu tienda...</p>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="p-12 text-center space-y-3">
                  <Truck className="w-12 h-12 text-gray-300 mx-auto" />
                  <p className="text-sm font-bold text-gray-700">No hay pedidos en este estado.</p>
                  <p className="text-xs text-gray-400 max-w-sm mx-auto">
                    Cuando los clientes compren tus productos en SANVI, aquí verás sus nombres, teléfonos, direcciones completas de despacho y los botones para imprimir rótulos y enviar guías.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((order) => {
                    const isProcessing = order.status === 'PROCESSING';
                    const isShipped = order.status === 'SHIPPED';
                    const isDelivered = order.status === 'DELIVERED';

                    return (
                      <div
                        key={order.id}
                        className="bg-white border-2 border-gray-200 hover:border-gray-300 rounded-2xl overflow-hidden shadow-sm transition-all"
                      >
                        {/* Cabecera del Pedido */}
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-black text-sm text-gray-900 bg-white px-2.5 py-1 rounded-lg border border-gray-300 shadow-xs">
                              Orden #{order.order_number}
                            </span>

                            {/* Badge de Estado Operativo */}
                            {isProcessing && (
                              <span className="bg-amber-100 text-amber-900 text-xs font-black px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-amber-300">
                                <Clock className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
                                <span>🟡 Pendiente de Despacho</span>
                              </span>
                            )}
                            {isShipped && (
                              <span className="bg-blue-100 text-blue-900 text-xs font-black px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-blue-300">
                                <Truck className="w-3.5 h-3.5 text-blue-700" />
                                <span>🔵 Despachado ({order.courier_name || 'Guía'} #{order.tracking_number || ''})</span>
                              </span>
                            )}
                            {isDelivered && (
                              <span className="bg-emerald-100 text-emerald-900 text-xs font-black px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-emerald-300">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                                <span>🟢 Entregado al Cliente</span>
                              </span>
                            )}

                            <span className="text-[11px] text-gray-500 font-medium">
                              📅 {new Date(order.created_at).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' })}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 font-semibold">Total a cobrar:</span>
                            <span className="text-base font-black text-sanvi-red">{formatCOP(order.total_amount)}</span>
                            <span className="text-[10px] bg-gray-200 text-gray-800 font-bold px-1.5 py-0.5 rounded">
                              {order.payment_method || 'Wompi'} • {order.payment_status === 'PAID' ? '✓ Pagado' : 'Contra Entrega'}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleDeleteOrder(order.id, order.order_number)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-1"
                              title="Eliminar este pedido"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Cuerpo de la Orden: 2 Columnas (Datos de Envío a la Izquierda, Productos a la Derecha) */}
                        <div className="p-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
                          
                          {/* COLUMNA 1: DATOS COMPLETOS DEL COMPRADOR PARA EL DESPACHO (7 cols) */}
                          <div className="lg:col-span-7 bg-[#FFFDF7] p-4 rounded-xl border border-amber-200/80 space-y-3">
                            <div className="flex items-center justify-between border-b border-amber-200/60 pb-2">
                              <span className="text-xs font-black text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5 text-sanvi-orange" />
                                <span>Datos del Cliente para Despacho:</span>
                              </span>
                              <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                                Destinatario Verificado
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                              {/* Nombre */}
                              <div>
                                <span className="text-[10px] font-bold text-gray-400 block uppercase">Nombre Completo:</span>
                                <span className="font-black text-gray-950 text-sm">{order.customer_name}</span>
                              </div>

                              {/* Teléfono */}
                              <div>
                                <span className="text-[10px] font-bold text-gray-400 block uppercase">Teléfono / WhatsApp:</span>
                                <span className="font-black text-gray-950 text-sm flex items-center gap-1 text-emerald-700">
                                  <Phone className="w-3 h-3 text-emerald-600" />
                                  <span>{order.customer_phone}</span>
                                </span>
                              </div>

                              {/* Dirección de Entrega */}
                              <div className="sm:col-span-2 bg-white p-2.5 rounded-lg border border-amber-200/60">
                                <span className="text-[10px] font-bold text-gray-500 block uppercase flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-sanvi-red" />
                                  <span>Dirección de Envío / Destino:</span>
                                </span>
                                <p className="font-black text-gray-950 text-sm mt-0.5">
                                  {order.shipping_address}
                                </p>
                                <p className="text-xs text-gray-600 font-bold">
                                  🏙️ {order.shipping_city || 'Bogotá, Colombia'}
                                </p>
                              </div>

                              {/* Notas de Entrega */}
                              {order.shipping_notes && (
                                <div className="sm:col-span-2 bg-amber-50/80 p-2 rounded-lg border border-amber-200 text-xs">
                                  <span className="text-[10px] font-black text-amber-900 block uppercase">
                                    📝 Indicaciones para el Mensajero:
                                  </span>
                                  <p className="text-gray-800 font-medium italic mt-0.5">
                                    "{order.shipping_notes}"
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* COLUMNA 2: PRENDAS Y PRODUCTOS COMPRADOS (5 cols) */}
                          <div className="lg:col-span-5 space-y-2.5">
                            <span className="text-xs font-black text-gray-700 uppercase tracking-wider block">
                              Prendas a Empacar ({order.items?.length || 0} referencias):
                            </span>

                            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                              {order.items?.map((item, idx) => (
                                <div key={idx} className="bg-gray-50 p-2.5 rounded-xl border border-gray-200 flex items-center gap-3">
                                  <img
                                    src={(item.images && item.images[0]) || 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=100'}
                                    alt={item.title}
                                    className="w-12 h-12 rounded-lg object-cover bg-gray-200 shrink-0"
                                  />
                                  <div className="min-w-0 flex-1">
                                    <h4 className="text-xs font-black text-gray-900 line-clamp-1">{item.title}</h4>
                                    <div className="text-[11px] text-gray-600 flex items-center gap-2 mt-0.5">
                                      {item.variant_size && (
                                        <span className="bg-gray-200 text-gray-800 text-[10px] font-bold px-1.5 py-0.2 rounded">
                                          Talla: {item.variant_size}
                                        </span>
                                      )}
                                      {item.variant_color && (
                                        <span className="bg-gray-200 text-gray-800 text-[10px] font-bold px-1.5 py-0.2 rounded">
                                          Color: {item.variant_color}
                                        </span>
                                      )}
                                      <span className="font-black text-gray-900">
                                        x{item.quantity} uds
                                      </span>
                                    </div>
                                    <div className="text-xs font-black text-sanvi-red mt-0.5">
                                      {formatCOP(item.total_price || item.unit_price * item.quantity)}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Barra Inferior de Acciones Rápidas del Comerciante */}
                        <div className="bg-gray-50/80 px-4 py-3 border-t border-gray-200 flex flex-wrap items-center justify-between gap-2.5">
                          <div className="flex items-center gap-2">
                            {/* 1. Botón WhatsApp Directo al Cliente */}
                            <button
                              type="button"
                              onClick={() => handleWhatsAppCustomer(order)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
                              title="Abrir chat con el cliente con el mensaje del pedido listo"
                            >
                              <MessageCircle className="w-4 h-4 fill-white" />
                              <span>Escribir al Cliente por WhatsApp</span>
                            </button>

                            {/* 2. Botón Imprimir Rótulo de Despacho */}
                            <button
                              type="button"
                              onClick={() => setShippingLabelOrder(order)}
                              className="bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
                              title="Ver y mandar a imprimir la guía de entrega para pegar a la caja"
                            >
                              <Printer className="w-4 h-4 text-gray-600" />
                              <span>Rótulo de Envío</span>
                            </button>

                            {/* 3. Botón Borrar Pedido */}
                            <button
                              type="button"
                              onClick={() => handleDeleteOrder(order.id, order.order_number)}
                              className="text-gray-400 hover:text-red-600 hover:bg-red-50 text-xs font-bold px-2.5 py-2 rounded-xl flex items-center gap-1 transition-colors border border-transparent hover:border-red-200"
                              title="Eliminar orden de la lista"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Borrar</span>
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* 3. Marcar Despacho o Gestionar Guía */}
                            {isProcessing && (
                              <button
                                type="button"
                                onClick={() => {
                                  setShippingModalOrder(order);
                                  setShippingCourier('Servientrega');
                                  setShippingTracking('');
                                }}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-black text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md transition-all active:scale-95"
                              >
                                <Truck className="w-4 h-4" />
                                <span>Marcar como Despachado</span>
                              </button>
                            )}

                            {isShipped && (
                              <button
                                type="button"
                                onClick={() => handleMarkAsDelivered(order.id)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Confirmar Entrega</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* CONTENIDO VISTA 2 & 3: TABLA DE INVENTARIO Y MADRUGÓN    */}
          {/* ======================================================== */}
          {(activeTab === 'inventory' || activeTab === 'madrugon') && (
            <div>
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
                    <tbody className="divide-y divide-gray-100">
                      {filteredStoreProducts.map((prod) => (
                        <tr key={prod.id} className="hover:bg-gray-50/80 transition-colors">
                          {/* Producto / Prenda con Foto y Tallas */}
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-2.5 min-w-[200px]">
                              <img
                                src={(prod.images && prod.images[0]) || 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=100'}
                                alt={prod.title}
                                className="w-10 h-10 rounded-lg object-cover bg-gray-100 shrink-0 border border-gray-200"
                              />
                              <div className="min-w-0">
                                <p className="font-bold text-gray-900 line-clamp-1">{prod.title}</p>
                                <div className="text-[10px] text-gray-500 font-medium flex items-center gap-1.5 flex-wrap">
                                  <span>SKU: {prod.id.slice(0, 8)}</span>
                                  {prod.variants?.sizes && (
                                    <>
                                      <span>•</span>
                                      <span className="text-gray-700 font-bold">
                                        Tallas: {prod.variants.sizes.join(', ')}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Categoría */}
                          <td className="py-2.5 px-3 whitespace-nowrap font-medium text-gray-700">
                            {prod.category}
                          </td>

                          {/* Precio Detal */}
                          <td className="py-2.5 px-3 whitespace-nowrap font-black text-gray-900">
                            {formatCOP(prod.price_retail)}
                          </td>

                          {/* Precio Mayorista */}
                          <td className="py-2.5 px-3 whitespace-nowrap font-bold text-amber-800">
                            <div>
                              <span>{formatCOP(prod.price_wholesale)}</span>
                              <span className="text-[9px] text-amber-700 block font-medium">
                                Min: {prod.min_wholesale_qty || 6} unidades
                              </span>
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

                          {/* Acciones */}
                          <td className="py-2.5 px-3 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => onEditProduct(prod)}
                                className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-300 font-bold px-2.5 py-1 rounded-md text-[11px] flex items-center gap-1 shadow-sm transition-all active:scale-95"
                                title="Editar producto"
                              >
                                <Edit className="w-3.5 h-3.5 text-blue-600" />
                                <span>Editar</span>
                              </button>

                              <button
                                onClick={() => onViewPublicStore(store)}
                                className="p-1.5 text-gray-500 hover:text-sanvi-orange hover:bg-orange-50 rounded-md border border-gray-200 transition-colors"
                                title="Ver en tu tienda pública"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </button>

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
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL 1: MARCAR COMO DESPACHADO CON GUÍA DE ENVÍO        */}
      {/* ======================================================== */}
      {shippingModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-gray-200 animate-in zoom-in-95">
            <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-white" />
                <h3 className="font-black text-sm">Despachar Orden #{shippingModalOrder.order_number}</h3>
              </div>
              <button
                onClick={() => setShippingModalOrder(null)}
                className="text-white/80 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveShippingStatus} className="p-5 space-y-4 text-xs">
              <div className="bg-blue-50 p-3 rounded-xl border border-blue-200">
                <p className="font-bold text-blue-950">
                  Destinatario: <strong className="text-gray-900">{shippingModalOrder.customer_name}</strong>
                </p>
                <p className="text-blue-800 text-[11px] mt-0.5">
                  📍 {shippingModalOrder.shipping_address}, {shippingModalOrder.shipping_city || 'Bogotá'}
                </p>
              </div>

              <div>
                <label className="block font-black text-gray-700 mb-1">Empresa de Mensajería / Transportadora</label>
                <select
                  value={shippingCourier}
                  onChange={(e) => setShippingCourier(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-blue-600"
                >
                  <option value="Servientrega">Servientrega</option>
                  <option value="Interrapidísimo">Interrapidísimo</option>
                  <option value="Envía">Envía</option>
                  <option value="Coordinadora">Coordinadora</option>
                  <option value="Mensajero San Victorino Express">Mensajero San Victorino Express (Mismo Día)</option>
                  <option value="Entrega en Local Físico">Entrega en Local Físico</option>
                </select>
              </div>

              <div>
                <label className="block font-black text-gray-700 mb-1">Número de Guía o Referencia</label>
                <input
                  type="text"
                  required
                  placeholder="ej: 1049284759 o Nombre del Mensajero"
                  value={shippingTracking}
                  onChange={(e) => setShippingTracking(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-blue-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShippingModalOrder(null)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingShipping}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-black text-xs px-5 py-2.5 rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{savingShipping ? 'Guardando...' : 'Confirmar Despacho'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: RÓTULO OFICIAL DE DESPACHO PARA IMPRIMIR        */}
      {/* ======================================================== */}
      {shippingLabelOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-gray-300 animate-in zoom-in-95">
            <div className="bg-gray-900 text-white p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Printer className="w-4 h-4 text-sanvi-orange" />
                <h3 className="font-black text-xs sm:text-sm">Rótulo de Envío • San Victorino Bogotá</h3>
              </div>
              <button
                onClick={() => setShippingLabelOrder(null)}
                className="text-gray-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Rótulo Estilo Guía de Encomienda */}
            <div className="p-5 space-y-4 text-xs font-sans">
              <div className="border-2 border-dashed border-gray-400 p-4 rounded-xl space-y-3 bg-white">
                {/* Header Guía */}
                <div className="flex items-center justify-between border-b-2 border-gray-900 pb-2">
                  <div>
                    <h2 className="text-base font-black text-gray-900">SANVI COLOMBIA</h2>
                    <p className="text-[10px] text-gray-500 font-bold">Bodegas & Confección Mayorista San Victorino</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black bg-gray-900 text-white px-2 py-0.5 rounded">
                      ORDEN #{shippingLabelOrder.order_number}
                    </span>
                    <p className="text-[10px] text-gray-500 mt-0.5">{shippingLabelOrder.payment_method} • {shippingLabelOrder.payment_status}</p>
                  </div>
                </div>

                {/* Remitente */}
                <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                  <span className="text-[10px] font-black uppercase text-gray-500 block">REMITENTE:</span>
                  <p className="font-black text-gray-900 text-xs">{store.name}</p>
                  <p className="text-[11px] text-gray-700">{store.commercial_center} • {store.local_number}</p>
                  <p className="text-[11px] text-gray-700">Bogotá D.C., Colombia • Tel: {store.phone_whatsapp}</p>
                </div>

                {/* Destinatario */}
                <div className="bg-amber-50/60 p-3 rounded-lg border-2 border-amber-300">
                  <span className="text-[10px] font-black uppercase text-amber-900 block">DESTINATARIO (CLIENTE):</span>
                  <p className="font-black text-gray-950 text-sm mt-0.5">{shippingLabelOrder.customer_name}</p>
                  <p className="font-extrabold text-gray-900 text-xs mt-1">
                    📍 {shippingLabelOrder.shipping_address}
                  </p>
                  <p className="font-bold text-gray-800 text-xs">
                    🏙️ {shippingLabelOrder.shipping_city || 'Bogotá, Colombia'}
                  </p>
                  <p className="font-black text-emerald-800 text-xs mt-1">
                    📞 Teléfono de Contacto: {shippingLabelOrder.customer_phone}
                  </p>
                  {shippingLabelOrder.shipping_notes && (
                    <p className="text-[11px] text-gray-600 italic mt-1 bg-white/80 p-1 rounded border border-amber-200">
                      Nota: "{shippingLabelOrder.shipping_notes}"
                    </p>
                  )}
                </div>

                {/* Contenido */}
                <div className="text-[11px] text-gray-700 border-t border-gray-200 pt-2">
                  <span className="font-black block uppercase text-[10px] text-gray-400">Contenido del paquete:</span>
                  <p className="font-medium mt-0.5">
                    {shippingLabelOrder.items?.map(i => `${i.quantity}x ${i.title} (${i.variant_size || i.variant_color || ''})`).join(' • ')}
                  </p>
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setShippingLabelOrder(null)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cerrar
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="bg-gray-900 hover:bg-black text-white font-black text-xs px-5 py-2.5 rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4 text-sanvi-orange" />
                  <span>Imprimir Rótulo (Ctrl + P)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
