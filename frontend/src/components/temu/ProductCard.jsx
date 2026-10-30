import React from 'react';
import { Play, MessageCircle, Plus, MapPin, Eye, Store, Star, Flame } from 'lucide-react';
import { isApparelOrFootwearCategory } from '../../utils/categoryHelper';

export default function ProductCard({
  product,
  onAddToCart,
  onOpenVideo,
  onDirectWhatsApp,
  onViewStore,
  onSelectProduct
}) {
  const formatCOP = (val) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const imageSrc =
    (product.images && product.images[0]) ||
    'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop';

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col group">
      {/* Contenedor de Imagen y Badges */}
      <div
        onClick={() => onSelectProduct && onSelectProduct(product)}
        className="relative aspect-square w-full bg-gray-100 overflow-hidden cursor-pointer"
      >
        <img
          src={imageSrc}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />

        {/* Badge de Descuento Temu */}
        {product.discount_percentage > 0 && (
          <div className="absolute top-2 left-2 bg-sanvi-red text-white text-[11px] font-black px-2 py-0.5 rounded shadow">
            -{product.discount_percentage}%
          </div>
        )}

        {/* Badge Madrugón */}
        {product.is_madrugon_deal && (
          <div className="absolute top-2 right-2 bg-yellow-400 text-gray-950 text-[10px] font-extrabold px-1.5 py-0.5 rounded shadow uppercase">
            ⚡ Madrugón
          </div>
        )}

        {/* Botón flotante para ver video de TikTok / YouTube Shorts */}
        {product.video_url && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenVideo(product);
            }}
            className="absolute bottom-2 left-2 bg-black/70 hover:bg-black/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 backdrop-blur-sm transition-all active:scale-95 shadow"
          >
            <Play className="w-3 h-3 text-red-400 fill-red-400" />
            <span>Ver Video</span>
          </button>
        )}

        {/* Contador de vistas */}
        <div className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] font-medium px-1.5 py-0.5 rounded flex items-center gap-1 backdrop-blur-sm">
          <Eye className="w-3 h-3" />
          <span>{product.views_count || 120}</span>
        </div>
      </div>

      {/* Contenido e información del producto */}
      <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
        {/* Título (Click abre la página del producto) */}
        <div>
          <h3
            onClick={() => onSelectProduct && onSelectProduct(product)}
            className="text-xs sm:text-sm font-bold text-gray-800 line-clamp-2 leading-snug group-hover:text-sanvi-orange transition-colors cursor-pointer"
          >
            {product.title}
          </h3>

          {/* Local y Centro Comercial (Clickable para ir a la Tienda Pública) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewStore && onViewStore(product.store_id || product.store_slug || product.store_name);
            }}
            className="w-full text-left flex items-center gap-1 text-[11px] text-gray-500 mt-1 truncate hover:text-sanvi-orange transition-colors group/store"
            title="Ver catálogo completo de este local"
          >
            <Store className="w-3 h-3 text-sanvi-orange shrink-0 group-hover/store:scale-110 transition-transform" />
            <span className="font-bold text-gray-800 group-hover/store:text-sanvi-orange truncate">
              {product.store_name}
            </span>
            <span className="text-gray-300">•</span>
            <span className="text-[10px] text-gray-500 truncate">{product.commercial_center}</span>
          </button>

          {/* Rating y Número de ventas realizadas (Temu Style) */}
          <div className="flex items-center gap-1.5 text-[11px] pt-1">
            <div className="flex items-center gap-0.5 text-amber-500 font-extrabold text-[11px]">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.rating || '4.9'}</span>
            </div>
            <span className="text-gray-300">•</span>
            <span className="text-gray-600 font-bold bg-gray-100 px-1.5 py-0.5 rounded text-[10px] flex items-center gap-1">
              <Flame className="w-2.5 h-2.5 text-sanvi-red fill-sanvi-red" />
              +{product.sold_count ? (product.sold_count >= 1000 ? `${(product.sold_count / 1000).toFixed(1)}k` : product.sold_count) : '850'} vendidos
            </span>
          </div>

          {/* Tallas disponibles en feed (SOLO para Ropa y Calzado) */}
          {isApparelOrFootwearCategory(product.category) && product.variants?.sizes && product.variants.sizes.length > 0 && (
            <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-600 font-semibold truncate">
              <span className="bg-gray-100 text-gray-800 text-[9px] font-black px-1.5 py-0.2 rounded border border-gray-200">
                TALLAS
              </span>
              <span className="truncate">
                {product.variants.sizes.slice(0, 4).join(', ')}
                {product.variants.sizes.length > 4 ? '...' : ''}
              </span>
            </div>
          )}
        </div>

        {/* Precios (Doble precio Colombia: Detal y Mayorista) */}
        <div className="space-y-1 bg-amber-50/60 p-2 rounded-lg border border-amber-100">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base sm:text-lg font-black text-sanvi-red">
              {formatCOP(product.price_retail)}
            </span>
            {product.original_price && (
              <span className="text-[11px] text-gray-400 line-through">
                {formatCOP(product.original_price)}
              </span>
            )}
            <span className="text-[10px] text-gray-500 font-semibold">(Detal)</span>
          </div>

          {/* Tarifa Mayorista */}
          {product.price_wholesale && (
            <div className="flex items-center justify-between text-[11px] font-extrabold text-amber-900 bg-amber-200/70 px-1.5 py-0.5 rounded">
              <span>Mayor: {formatCOP(product.price_wholesale)}</span>
              <span className="text-[10px] text-amber-800 font-semibold">x{product.min_wholesale_qty || 6} uds</span>
            </div>
          )}
        </div>

        {/* Botones de acción rápida */}
        <div className="grid grid-cols-2 gap-1.5 pt-1">
          {/* Botón WhatsApp */}
          <button
            onClick={() => onDirectWhatsApp(product)}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black py-2 rounded-lg flex items-center justify-center gap-1 transition-all active:scale-95 shadow-sm"
            title="Hablar directo con el local por WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </button>

          {/* Botón Carrito */}
          <button
            onClick={() => onAddToCart(product)}
            className="w-full bg-sanvi-orange hover:bg-orange-600 text-white text-[11px] font-black py-2 rounded-lg flex items-center justify-center gap-1 transition-all active:scale-95 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Pedir</span>
          </button>
        </div>
      </div>
    </div>
  );
}
