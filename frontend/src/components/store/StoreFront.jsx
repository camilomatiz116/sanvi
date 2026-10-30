import React, { useState } from 'react';
import {
  MapPin,
  MessageCircle,
  Share2,
  CheckCircle2,
  ArrowLeft,
  Store,
  ShieldCheck,
  Search,
  Sparkles,
  Copy,
  Check,
  Camera,
  Edit
} from 'lucide-react';
import ProductCard from '../temu/ProductCard';

export default function StoreFront({
  store,
  products,
  loggedInStore,
  onOpenEditStore,
  onBackToMarketplace,
  onAddToCart,
  onOpenVideo,
  onDirectWhatsApp,
  onSelectProduct
}) {
  const [storeSearch, setStoreSearch] = useState('');
  const [copied, setCopied] = useState(false);

  if (!store) return null;

  const isOwner = loggedInStore && (loggedInStore.id === store.id || loggedInStore.slug === store.slug);

  const storeProducts = products.filter(
    (p) => p.store_id === store.id || p.store_name === store.name || p.store_slug === store.slug
  );

  const filteredProducts = storeProducts.filter((p) => {
    if (!storeSearch) return true;
    const q = storeSearch.toLowerCase();
    return p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
  });

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/tienda/${store.slug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const bannerImg =
    store.banner_url ||
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop';
  const logoImg =
    store.logo_url ||
    'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=200&auto=format&fit=crop';

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      {/* Botón flotante para regresar al Marketplace general */}
      <div className="bg-white border-b border-gray-200 sticky top-14 z-30 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={onBackToMarketplace}
            className="inline-flex items-center gap-1.5 text-xs font-black text-gray-700 hover:text-sanvi-orange bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a todo Sanvi</span>
          </button>

          <span className="text-[11px] text-gray-500 font-semibold hidden sm:inline">
            Espacio Oficial del Comerciante en Sanvi
          </span>
        </div>
      </div>

      {/* Portada y Perfil del Local */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 mt-3">
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200">
          {/* Banner de la Tienda */}
          <div className="relative h-36 sm:h-52 w-full bg-gray-900 overflow-hidden">
            <img
              src={bannerImg}
              alt={store.name}
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            {/* Enlace único para compartir y Botón de Personalizar Tienda */}
            <div className="absolute top-3 right-3 flex items-center gap-2">
              {isOwner && onOpenEditStore && (
                <button
                  onClick={onOpenEditStore}
                  className="bg-sanvi-orange hover:bg-orange-600 text-white text-xs font-black px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg transition-all active:scale-95 border border-white/30 animate-pulse hover:animate-none"
                  title="Cambiar la imagen de este banner y la del cuadrito"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Editar Banner y Logo</span>
                </button>
              )}

              <button
                onClick={handleShare}
                className="bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/20 transition-all shadow"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copied ? '¡Enlace Copiado!' : 'Compartir Tienda'}</span>
              </button>
            </div>
          </div>

          {/* Información y Datos del Local */}
          <div className="px-4 sm:px-6 pb-6 pt-3 relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-14 sm:-mt-16 mb-4">
              {/* Logo y Nombre */}
              <div className="flex items-end gap-3.5">
                {/* Cuadrito del Logo con botón de edición rápida */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-4 border-white shadow-md overflow-hidden bg-white shrink-0 group">
                  <img src={logoImg} alt={store.name} className="w-full h-full object-cover" />
                  {isOwner && onOpenEditStore && (
                    <button
                      onClick={onOpenEditStore}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity cursor-pointer"
                      title="Cambiar foto de este cuadrito"
                    >
                      <Camera className="w-4 h-4 text-sanvi-orange" />
                      <span className="text-[9px] font-black uppercase mt-0.5">Editar</span>
                    </button>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-lg sm:text-2xl font-black text-gray-900 leading-tight">
                      {store.name}
                    </h1>
                    <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Local Verificado
                    </span>
                    {isOwner && onOpenEditStore && (
                      <button
                        onClick={onOpenEditStore}
                        className="bg-orange-50 hover:bg-orange-100 text-sanvi-orange border border-orange-200 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 transition-colors"
                      >
                        <Edit className="w-3 h-3" />
                        <span>Personalizar Datos</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-600 font-semibold flex-wrap">
                    <span className="flex items-center gap-1 text-gray-900 font-bold">
                      <MapPin className="w-3.5 h-3.5 text-sanvi-orange" />
                      {store.commercial_center} • {store.local_number}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span>Bogotá, Colombia</span>
                  </div>
                </div>
              </div>

              {/* Botón de Contacto por WhatsApp directo */}
              <a
                href={`https://wa.me/${store.phone_whatsapp || '573102345678'}?text=${encodeURIComponent(
                  `Hola ${store.name}, vi tu catálogo en SANVI y deseo cotizar varias prendas.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 shrink-0"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Contactar al Local por WhatsApp</span>
              </a>
            </div>

            {/* Descripción y resumen */}
            {store.description && (
              <p className="text-xs sm:text-sm text-gray-600 max-w-3xl leading-relaxed mb-4">
                {store.description}
              </p>
            )}

            {/* Métricas destacadas de la tienda */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-gray-100 text-center">
              <div className="bg-gray-50 p-2.5 rounded-xl">
                <div className="text-xs text-gray-400 font-bold uppercase">Prendas en Catálogo</div>
                <div className="text-lg font-black text-gray-900">{storeProducts.length}</div>
              </div>
              <div className="bg-gray-50 p-2.5 rounded-xl">
                <div className="text-xs text-gray-400 font-bold uppercase">Venta Mayorista</div>
                <div className="text-lg font-black text-sanvi-orange">Disponible x6 y x12</div>
              </div>
              <div className="bg-gray-50 p-2.5 rounded-xl">
                <div className="text-xs text-gray-400 font-bold uppercase">Envíos</div>
                <div className="text-lg font-black text-emerald-700">Mismo Día Bogotá</div>
              </div>
              <div className="bg-gray-50 p-2.5 rounded-xl">
                <div className="text-xs text-gray-400 font-bold uppercase">Membresía Sanvi</div>
                <div className="text-lg font-black text-blue-700 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  Al Día
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Buscador interno del catálogo del comerciante */}
        <div className="my-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-black text-gray-900 flex items-center gap-1.5">
              <Store className="w-5 h-5 text-sanvi-orange" />
              Catálogo de {store.name}
            </h2>
            <span className="text-xs font-bold text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
              {filteredProducts.length} artículos
            </span>
          </div>

          <div className="w-full sm:w-72 relative">
            <input
              type="text"
              placeholder={`Buscar dentro de ${store.name}...`}
              value={storeSearch}
              onChange={(e) => setStoreSearch(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-full pl-9 pr-4 py-1.5 text-xs outline-none focus:border-sanvi-orange"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Grilla de Productos del Comerciante */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center space-y-2 border border-gray-200">
            <p className="text-sm font-bold text-gray-500">
              No hay productos que coincidan con la búsqueda.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3.5">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onOpenVideo={onOpenVideo}
                onDirectWhatsApp={onDirectWhatsApp}
                onViewStore={() => {}}
                onSelectProduct={onSelectProduct}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

