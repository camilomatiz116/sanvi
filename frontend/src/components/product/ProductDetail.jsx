import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Share2,
  CheckCircle2,
  ShieldCheck,
  Truck,
  MessageCircle,
  ShoppingBag,
  Store,
  Play,
  Flame,
  Star,
  MapPin,
  Check,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { isApparelOrFootwearCategory } from '../../utils/categoryHelper';
import { api } from '../../services/api';

export default function ProductDetail({
  product,
  onBack,
  onAddToCart,
  onOpenVideo,
  onViewStore
}) {
  if (!product) return null;

  const images = (product.images && product.images.length > 0)
    ? product.images
    : ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop'];

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(
    product.variants?.sizes ? product.variants.sizes[0] : 'Estándar'
  );
  const [selectedColor, setSelectedColor] = useState(
    product.variants?.colors ? product.variants.colors[0] : 'Único'
  );
  const [quantity, setQuantity] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isCouponApplied, setIsCouponApplied] = useState(false);

  useEffect(() => {
    if (product.variants?.sizes && product.variants.sizes.length > 0) {
      if (!selectedSize || !product.variants.sizes.includes(selectedSize)) {
        setSelectedSize(product.variants.sizes[0]);
      }
    } else {
      setSelectedSize('Estándar');
    }

    if (product.variants?.colors && product.variants.colors.length > 0) {
      if (!selectedColor || !product.variants.colors.includes(selectedColor)) {
        setSelectedColor(product.variants.colors[0]);
      }
    } else {
      setSelectedColor('Único');
    }
  }, [product]);

  const formatCOP = (val) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const minWholesale = product.min_wholesale_qty || 6;
  const isWholesaleActive = quantity >= minWholesale;
  const activeUnitPrice = isWholesaleActive && product.price_wholesale
    ? product.price_wholesale
    : product.price_retail;

  const baseTotal = activeUnitPrice * quantity;
  const discountAmount = isCouponApplied ? Math.round(baseTotal * 0.1) : 0; // 10% descuento
  const totalPrice = baseTotal - discountAmount;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleWhatsAppBuy = () => {
    api.trackWhatsApp({
      store_id: product.store_id,
      product_id: product.id,
      purchase_type: isWholesaleActive ? 'MAYOR' : 'DETAL'
    }).catch(() => {});

    const phone = product.phone_whatsapp || '573102345678';
    const isApparel = isApparelOrFootwearCategory(product.category);
    const msg = encodeURIComponent(
      `Hola *${product.store_name}*, vi en SANVI tu producto:
🛍️ *${product.title}*
📍 Local: ${product.commercial_center} (${product.local_number})
${isApparel && selectedSize ? `📏 Talla: ${selectedSize}\n` : ''}${selectedColor && selectedColor !== 'Único' ? `🎨 Color: ${selectedColor}\n` : ''}📦 Cantidad: ${quantity} unidades (${isWholesaleActive ? 'Precio Mayorista' : 'Precio Detal'})
${isCouponApplied ? `🎟️ Cupón de Descuento: -10% Aplicado (-${formatCOP(discountAmount)})\n` : ''}💰 Total a Pagar: ${formatCOP(totalPrice)}

¿Tienen disponibilidad para despacho hoy mismo?`
    );
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
  };

  const handleAddCartItem = () => {
    onAddToCart({
      ...product,
      selectedSize,
      selectedColor,
      quantity
    });
  };

  return (
    <div className="min-h-screen bg-[#F4F4F6] pb-24 text-gray-900">
      {/* Barra de navegación superior con botón para volver */}
      <div className="bg-white border-b border-gray-200 sticky top-14 z-30 px-3 sm:px-4 py-2.5 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-black text-gray-700 hover:text-sanvi-orange bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Catálogo</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="text-xs font-bold text-gray-600 hover:text-gray-900 bg-gray-100 px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? '¡Enlace Copiado!' : 'Compartir'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 mt-4">
        {/* Breadcrumb */}
        <div className="text-xs text-gray-500 font-semibold mb-3 flex items-center gap-1 truncate">
          <button onClick={onBack} className="hover:text-sanvi-orange">Sanvi</button>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="text-gray-700">{product.category}</span>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="text-gray-400 truncate max-w-xs">{product.title}</span>
        </div>

        {/* Contenedor Principal: 2 Columnas (Galería a la izquierda, Compra a la derecha) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm">
          {/* COLUMNA 1: GALERÍA DE FOTOS MULTI-IMAGEN + VIDEO (5 columnas) */}
          <div className="lg:col-span-5 space-y-3">
            {/* Foto Principal Ampliada */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-sm">
              <img
                src={images[selectedImageIndex] || images[0]}
                alt={product.title}
                className="w-full h-full object-cover object-center transition-all duration-300"
              />

              {/* Badge de Descuento Temu */}
              {product.discount_percentage > 0 && (
                <div className="absolute top-3 left-3 bg-sanvi-red text-white text-xs font-black px-2.5 py-1 rounded shadow">
                  -{product.discount_percentage}% OFF
                </div>
              )}

              {/* Badge de Madrugón */}
              {product.is_madrugon_deal && (
                <div className="absolute top-3 right-3 bg-yellow-400 text-gray-950 text-xs font-black px-2.5 py-1 rounded shadow uppercase flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-red-600 fill-red-600 animate-pulse" />
                  Madrugón
                </div>
              )}

              {/* Botón flotante para ver el video de TikTok / Shorts */}
              {product.video_url && (
                <button
                  onClick={() => onOpenVideo(product)}
                  className="absolute bottom-3 left-3 bg-black/80 hover:bg-black text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 backdrop-blur-md shadow-lg active:scale-95 transition-all"
                >
                  <Play className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                  <span>Ver Video Modelado</span>
                </button>
              )}
            </div>

            {/* Carrusel de Miniaturas (Múltiples Fotos del Producto) */}
            {images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
                {images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      selectedImageIndex === idx
                        ? 'border-sanvi-orange ring-2 ring-orange-200 scale-105'
                        : 'border-gray-200 hover:border-gray-400 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* COLUMNA 2: DETALLES, PRECIOS, TALLAS Y COMPRA (7 columnas) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              {/* Título y Datos del Local */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider bg-orange-100 text-sanvi-orange px-2 py-0.5 rounded">
                    {product.category}
                  </span>
                  <span className="text-xs text-gray-400 font-mono">
                    SKU: SV-{product.id?.slice(-6) || 'PROD'}
                  </span>
                </div>

                <h1 className="text-lg sm:text-2xl font-black text-gray-950 leading-snug">
                  {product.title}
                </h1>

                {/* Local de San Victorino */}
                <button
                  onClick={() => onViewStore && onViewStore(product.store_id || product.store_slug || product.store_name)}
                  className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-sanvi-orange font-bold transition-colors group text-left"
                >
                  <Store className="w-4 h-4 text-sanvi-orange group-hover:scale-110 transition-transform shrink-0" />
                  <span className="underline decoration-dotted text-gray-900 group-hover:text-sanvi-orange">
                    {product.store_name}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-500 font-normal">
                    📍 {product.commercial_center} ({product.local_number})
                  </span>
                </button>
              </div>

              {/* CAJA DE PRECIOS TEMU (DETAL VS MAYORISTA COLOMBIA) */}
              <div className="bg-[#FFF9F2] p-4 rounded-2xl border-2 border-amber-200/80 space-y-2">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-2xl sm:text-3xl font-black text-sanvi-red">
                    {formatCOP(activeUnitPrice)}
                  </span>
                  {product.original_price && (
                    <span className="text-sm text-gray-400 line-through">
                      {formatCOP(product.original_price)}
                    </span>
                  )}
                  <span className="bg-sanvi-red text-white text-[11px] font-black px-2 py-0.5 rounded">
                    {isWholesaleActive ? '¡Tarifa Mayorista Aplicada!' : 'Precio al Detal (1 unidad)'}
                  </span>
                </div>

                {/* Tarifa Mayorista Destacada */}
                {product.price_wholesale && (
                  <div className="flex items-center justify-between bg-amber-200/80 p-2.5 rounded-xl text-xs font-black text-amber-950">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-800" />
                      <span>Lleva por Mayor a: {formatCOP(product.price_wholesale)} c/u</span>
                    </div>
                    <span className="text-[11px] bg-white text-amber-900 px-2 py-0.5 rounded-lg shadow-sm">
                      A partir de {minWholesale} unidades
                    </span>
                  </div>
                )}

                {/* Tips de Ahorro Gamificado Temu */}
                {!isWholesaleActive && product.price_wholesale && (
                  <p className="text-[11px] text-amber-800 font-bold">
                    💡 Agrega <strong className="text-sanvi-red">{minWholesale - quantity} unidades más</strong> para desbloquear el precio mayorista de {formatCOP(product.price_wholesale)}.
                  </p>
                )}
              </div>

              {/* CUPÓN DE DESCUENTO TEMU CLIENTE */}
              <div className="bg-[#FFF5F5] border-2 border-dashed border-[#FA2C19]/60 p-3 rounded-2xl flex items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-sanvi-red text-white flex items-center justify-center font-black text-sm shrink-0 shadow">
                    %
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-black text-sanvi-red flex items-center gap-1.5 flex-wrap">
                      <span>Cupón de la Tienda: -10% EXTRA</span>
                      {isCouponApplied && (
                        <span className="bg-emerald-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded">
                          ✓ Aplicado
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-600 font-medium truncate">
                      {isCouponApplied
                        ? `Ahorraste ${formatCOP(discountAmount)} con este cupón`
                        : 'Reclama 10% de descuento directo en este producto'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsCouponApplied(!isCouponApplied)}
                  className={`text-xs font-black px-3.5 py-2 rounded-xl transition-all active:scale-95 shadow-sm shrink-0 ${
                    isCouponApplied
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-sanvi-red hover:bg-red-700 text-white'
                  }`}
                >
                  {isCouponApplied ? 'Quitar Descuento' : 'Aplicar Descuento'}
                </button>
              </div>

              {/* Selector de Tallas (SOLO si es Ropa o Calzado) */}
              {isApparelOrFootwearCategory(product.category) && product.variants?.sizes && product.variants.sizes.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-gray-800">Seleccionar Talla:</span>
                    <span className="font-black text-sanvi-orange">{selectedSize}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {product.variants.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                          selectedSize === s
                            ? 'bg-gray-950 text-white shadow-md'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-200'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Selector de Colores (si aplica) */}
              {product.variants?.colors && product.variants.colors.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-gray-800">Seleccionar Color:</span>
                    <span className="font-black text-gray-900">{selectedColor}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {product.variants.colors.map((c) => (
                      <button
                        key={c}
                        onClick={() => setSelectedColor(c)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          selectedColor === c
                            ? 'bg-sanvi-orange text-white shadow-md'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-200'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Selector de Cantidad */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-bold text-gray-800">Cantidad de Unidades:</span>
                <div className="flex items-center border-2 border-gray-300 rounded-xl bg-white overflow-hidden shadow-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 py-1.5 text-sm font-black text-gray-700 hover:bg-gray-100 active:bg-gray-200"
                  >
                    -
                  </button>
                  <span className="px-4 text-xs font-black text-gray-950">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3.5 py-1.5 text-sm font-black text-gray-700 hover:bg-gray-100 active:bg-gray-200"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Total Estimado */}
              <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl text-xs font-semibold">
                <span className="text-gray-600">Total a pagar:</span>
                <span className="text-lg font-black text-gray-950">{formatCOP(totalPrice)}</span>
              </div>
            </div>

            {/* BOTONES PRINCIPALES DE ACCIÓN */}
            <div className="space-y-2 pt-3 border-t border-gray-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Botón WhatsApp */}
                <button
                  onClick={handleWhatsAppBuy}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 text-xs sm:text-sm"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Pedir Directo por WhatsApp</span>
                </button>

                {/* Botón Carrito */}
                <button
                  onClick={handleAddCartItem}
                  className="w-full bg-sanvi-orange hover:bg-orange-600 text-white font-black py-3 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 text-xs sm:text-sm"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Añadir al Carrito</span>
                </button>
              </div>

              {/* Garantías y Beneficios Locales */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 text-[11px] text-gray-600">
                <div className="flex items-center gap-1.5 bg-gray-50 p-2 rounded-lg">
                  <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Entrega Mismo Día en Bogotá</span>
                </div>
                <div className="flex items-center gap-1.5 bg-gray-50 p-2 rounded-lg">
                  <ShieldCheck className="w-4 h-4 text-sanvi-orange shrink-0" />
                  <span>Garantía en Local Físico</span>
                </div>
                <div className="flex items-center gap-1.5 bg-gray-50 p-2 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Confección 100% Colombiana</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DETALLE Y CARACTERÍSTICAS DEL PRODUCTO */}
        <div className="mt-4 bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm space-y-3">
          <h3 className="text-base font-black text-gray-950 flex items-center gap-2">
            <span>Detalles y Especificaciones de la Prenda</span>
          </h3>
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line">
            {product.description || 'Prenda confeccionada con telas nacionales de alta resistencia y remates reforzados. Lista para venta al detal o distribución por mayor.'}
          </p>

          <div className="pt-3 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
            <MapPin className="w-4 h-4 text-sanvi-orange" />
            <span>Fabricado y distribuido desde el sector comercial de San Victorino, Bogotá.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

