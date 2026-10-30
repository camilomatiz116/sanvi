import React from 'react';
import { Play, MapPin, Eye, Store, Star, Flame, ShoppingCart, Sparkles } from 'lucide-react';
import { isApparelOrFootwearCategory } from '../../utils/categoryHelper';

export default function ProductCard({
  product,
  onAddToCart,
  onOpenVideo,
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

  const formattedSales = product.sold_count
    ? product.sold_count >= 1000
      ? `${(product.sold_count / 1000).toFixed(1)}k+`
      : `${product.sold_count}+`
    : '1.2k+';

  return (
    <div
      onClick={() => onSelectProduct && onSelectProduct(product)}
      className="bg-white rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 border border-gray-100 flex flex-col group cursor-pointer select-none"
    >
      {/* Contenedor de Imagen y Badges */}
      <div className="relative aspect-square w-full bg-gray-50 overflow-hidden">
        <img
          src={imageSrc}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />

        {/* Badge de Descuento Temu */}
        {product.discount_percentage > 0 && (
          <div className="absolute top-2 left-2 bg-[#d12420] text-white text-[11px] font-black px-1.5 py-0.5 rounded shadow-sm">
            -{product.discount_percentage}%
          </div>
        )}

        {/* Badge Madrugón */}
        {product.is_madrugon_deal && (
          <div className="absolute top-2 right-2 bg-yellow-400 text-gray-950 text-[10px] font-extrabold px-1.5 py-0.5 rounded shadow uppercase">
            ⚡ Madrugón
          </div>
        )}

        {/* Botón flotante para ver video */}
        {product.video_url && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenVideo && onOpenVideo(product);
            }}
            className="absolute bottom-2 left-2 bg-black/70 hover:bg-black/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-sm transition-all active:scale-95 shadow"
          >
            <Play className="w-2.5 h-2.5 text-red-400 fill-red-400" />
            <span>Ver Video</span>
          </button>
        )}

        {/* Overlay hover estilo Temu: "Vista rápida" */}
        <div className="absolute inset-x-0 bottom-2 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <span className="bg-white/90 backdrop-blur-xs text-gray-900 text-[11px] font-bold px-3 py-1 rounded-full shadow-md border border-gray-200">
            Vista rápida
          </span>
        </div>
      </div>

      {/* Contenido e información del producto */}
      <div className="p-2.5 sm:p-3 flex-1 flex flex-col justify-between space-y-1.5">
        <div>
          {/* Título de producto estilo Temu */}
          <h3 className="text-xs sm:text-[13px] font-medium text-gray-900 line-clamp-2 leading-tight group-hover:text-amber-700 transition-colors">
            {product.title}
          </h3>

          {/* Local y Centro Comercial San Victorino */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onViewStore && onViewStore(product.store_id || product.store_slug || product.store_name);
            }}
            className="w-full text-left flex items-center gap-1 text-[11px] text-gray-500 mt-1 truncate hover:text-sanvi-orange transition-colors"
            title="Ver catálogo de este fabricante"
          >
            <Store className="w-3 h-3 text-amber-600 shrink-0" />
            <span className="font-semibold text-gray-700 truncate">{product.store_name}</span>
            <span className="text-gray-300">•</span>
            <span className="text-[10px] text-gray-400 truncate">{product.commercial_center}</span>
          </button>

          {/* Tallas disponibles (para Ropa y Calzado) */}
          {isApparelOrFootwearCategory(product.category) && product.variants?.sizes && product.variants.sizes.length > 0 && (
            <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-500 font-medium truncate">
              <span className="bg-gray-100 text-gray-700 text-[9px] font-bold px-1 rounded">
                Tallas:
              </span>
              <span className="truncate">
                {product.variants.sizes.slice(0, 4).join(', ')}
                {product.variants.sizes.length > 4 ? '...' : ''}
              </span>
            </div>
          )}
        </div>

        {/* Fila Principal de Precios + Ventas + Botón Circular Carrito (Diseño Real Temu) */}
        <div className="pt-1">
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              {/* Precio Detal en negrita destacado */}
              <span className="text-sm sm:text-base font-extrabold text-gray-950">
                {formatCOP(product.price_retail)}
              </span>

              {/* Precio tachado original */}
              {product.original_price && (
                <span className="text-[10px] sm:text-[11px] text-gray-400 line-through">
                  {formatCOP(product.original_price)}
                </span>
              )}

              {/* Ventas realizadas */}
              <span className="text-[10px] sm:text-[11px] text-gray-500 font-medium">
                {formattedSales} ventas
              </span>
            </div>

            {/* Botón Circular Carrito Temu */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart && onAddToCart(product);
              }}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-gray-800 hover:bg-gray-900 hover:text-white text-gray-900 flex items-center justify-center transition-all duration-150 active:scale-90 shadow-xs shrink-0"
              title="Añadir al Carrito"
            >
              <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[1.8]" />
            </button>
          </div>

          {/* Tarifa Mayorista San Victorino (Discreta y clara) */}
          {product.price_wholesale && (
            <div className="mt-1 flex items-center justify-between bg-amber-50/80 border border-amber-200/60 rounded px-1.5 py-0.5 text-[10px] text-amber-900 font-bold">
              <span>Mayor: {formatCOP(product.price_wholesale)}</span>
              <span className="text-[9px] text-amber-700 font-medium">x{product.min_wholesale_qty || 6} uds</span>
            </div>
          )}

          {/* Rating y Badges de Vendedor Estrella Estilo Temu */}
          <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
            {/* Calificación y Estrellas */}
            <div className="flex items-center gap-0.5 text-gray-800 text-[10px] font-bold">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.rating || '4.9'}</span>
              <span className="text-gray-400 font-normal">({product.reviews_count || 32})</span>
            </div>

            {/* Badge Temu "Vendedor estrella" */}
            <span className="bg-[#f5ecfd] text-[#702283] text-[9.5px] font-extrabold px-1.5 py-0.5 rounded-sm inline-flex items-center gap-0.5">
              <Sparkles className="w-2.5 h-2.5 text-[#702283]" />
              Vendedor estrella
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
