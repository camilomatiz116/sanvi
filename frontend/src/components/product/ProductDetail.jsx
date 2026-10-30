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
  Sparkles,
  ThumbsUp,
  Send,
  User,
  Award,
  AlertCircle,
  Zap
} from 'lucide-react';
import { isApparelOrFootwearCategory } from '../../utils/categoryHelper';
import { api } from '../../services/api';

export default function ProductDetail({
  product,
  onBack,
  onAddToCart,
  onOpenVideo,
  onViewStore,
  loggedInCustomer,
  onOpenAuthModal
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

  // Estados de Reseñas y Ventas
  const [reviews, setReviews] = useState(product.reviews || []);
  const [soldCount, setSoldCount] = useState(product.sold_count || 1420);
  const [rating, setRating] = useState(product.rating || 4.9);
  const [isWritingReview, setIsWritingReview] = useState(false);

  // Formulario de nueva reseña
  const [formRating, setFormRating] = useState(5);
  const [formComment, setFormComment] = useState('');
  const [formCity, setFormCity] = useState(loggedInCustomer?.city || 'Bogotá, Colombia');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [successReviewMsg, setSuccessReviewMsg] = useState('');

  // Votos de utilidad
  const [helpfulVotes, setHelpfulVotes] = useState({});

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

    // Cargar reseñas actualizadas del producto si existen
    if (product.id) {
      api.getProductReviews(product.id)
        .then((data) => {
          if (data && data.reviews) {
            setReviews(data.reviews);
            if (data.rating) setRating(data.rating);
            if (data.sold_count) setSoldCount(data.sold_count);
          }
        })
        .catch(() => {});
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
  const retailTotal = (product.price_retail || activeUnitPrice) * quantity;
  const wholesaleSavings = isWholesaleActive && product.price_wholesale ? (retailTotal - baseTotal) : 0;
  const discountAmount = isCouponApplied ? Math.round(baseTotal * 0.1) : 0; // 10% descuento
  const totalPrice = baseTotal - discountAmount;
  const totalSavings = wholesaleSavings + discountAmount;

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

  const handleBuyNow = () => {
    onAddToCart({
      ...product,
      selectedSize,
      selectedColor,
      quantity,
      price_retail: activeUnitPrice,
      isWholesale: isWholesaleActive
    });
  };

  // Manejar el envío de reseña de compra
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!loggedInCustomer) {
      if (onOpenAuthModal) onOpenAuthModal();
      return;
    }
    if (!formComment.trim()) return;

    setSubmittingReview(true);
    const variantStr = `${selectedSize && selectedSize !== 'Estándar' ? `Talla: ${selectedSize} • ` : ''}${selectedColor && selectedColor !== 'Único' ? `Color: ${selectedColor} • ` : ''}Compra Verificada en Sanvi`;

    try {
      const res = await api.addProductReview(product.id, {
        user_name: loggedInCustomer.name || 'Cliente Sanvi',
        avatar: loggedInCustomer.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop',
        rating: formRating,
        comment: formComment,
        city: formCity || 'Bogotá, Colombia',
        variant_info: variantStr
      });

      if (res && res.review) {
        setReviews((prev) => [res.review, ...prev]);
        if (res.product?.rating) setRating(res.product.rating);
        if (res.product?.sold_count) setSoldCount(res.product.sold_count);
        setFormComment('');
        setIsWritingReview(false);
        setSuccessReviewMsg('¡Tu calificación de compra ha sido publicada con éxito!');
        setTimeout(() => setSuccessReviewMsg(''), 5000);
      }
    } catch (err) {
      alert('Error enviando tu calificación. Inténtalo de nuevo.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleVoteHelpful = (reviewId, initialVotes) => {
    setHelpfulVotes((prev) => {
      const current = prev[reviewId] !== undefined ? prev[reviewId] : initialVotes;
      return {
        ...prev,
        [reviewId]: current + 1
      };
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

                {/* Rating Temu y Número de Ventas Realizadas */}
                <div className="flex items-center gap-2 flex-wrap text-xs pt-0.5">
                  <div className="flex items-center gap-1 text-amber-500 font-extrabold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{rating}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById('product-reviews-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-gray-600 hover:text-sanvi-orange underline font-semibold"
                  >
                    ({reviews.length || product.reviews_count || 148} reseñas de compra)
                  </button>
                  <span className="text-gray-300">•</span>
                  <span className="text-gray-800 font-extrabold flex items-center gap-1 bg-red-50 text-sanvi-red px-2 py-0.5 rounded border border-red-100">
                    <Flame className="w-3.5 h-3.5 fill-sanvi-red text-sanvi-red" />
                    +{soldCount ? (soldCount >= 1000 ? `${(soldCount / 1000).toFixed(1)}k` : soldCount) : '1.4k'} vendidos en San Victorino
                  </span>
                </div>

                {/* Local de San Victorino */}
                <button
                  onClick={() => onViewStore && onViewStore(product.store_id || product.store_slug || product.store_name)}
                  className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-sanvi-orange font-bold transition-colors group text-left pt-1"
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

              {/* NOTIFICACIÓN VISIBLE DE DESCUENTO MAYORISTA APLICADO */}
              {isWholesaleActive && (
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-3.5 rounded-2xl flex items-center justify-between gap-3 shadow-md animate-in fade-in duration-200 border-2 border-emerald-400">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-black tracking-wide">🎉 ¡DESCUENTO MAYORISTA APLICADO!</span>
                        <span className="bg-white text-emerald-800 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                          {quantity} unidades
                        </span>
                      </div>
                      <p className="text-[11px] text-emerald-100 font-medium mt-0.5">
                        El precio bajó a <strong className="text-white font-bold">{formatCOP(product.price_wholesale)} c/u</strong> (Antes {formatCOP(product.price_retail)} al detal)
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 bg-white/15 px-3 py-1.5 rounded-xl border border-white/20">
                    <span className="text-[9px] uppercase font-bold text-emerald-200 block">Estás Ahorrando:</span>
                    <span className="text-xs sm:text-sm font-black text-white">
                      -{formatCOP(wholesaleSavings)}
                    </span>
                  </div>
                </div>
              )}

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
                  <span className={`text-[11px] font-black px-2 py-0.5 rounded ${
                    isWholesaleActive
                      ? 'bg-emerald-600 text-white'
                      : 'bg-sanvi-red text-white'
                  }`}>
                    {isWholesaleActive ? '✓ ¡Tarifa Mayorista Activada!' : 'Precio al Detal (1 unidad)'}
                  </span>
                </div>

                {/* Tarifa Mayorista Destacada */}
                {product.price_wholesale && (
                  <div className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-black transition-all ${
                    isWholesaleActive
                      ? 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                      : 'bg-amber-200/80 text-amber-950'
                  }`}>
                    <div className="flex items-center gap-1.5">
                      <Sparkles className={`w-4 h-4 ${isWholesaleActive ? 'text-emerald-700 animate-pulse' : 'text-amber-800'}`} />
                      <span>
                        {isWholesaleActive
                          ? `✓ Tarifa Mayorista Activa: ${formatCOP(product.price_wholesale)} c/u`
                          : `Lleva por Mayor a: ${formatCOP(product.price_wholesale)} c/u`}
                      </span>
                    </div>
                    <span className={`text-[11px] px-2 py-0.5 rounded-lg shadow-sm ${
                      isWholesaleActive
                        ? 'bg-emerald-700 text-white font-black'
                        : 'bg-white text-amber-900'
                    }`}>
                      {isWholesaleActive ? `Ahorras ${formatCOP(wholesaleSavings)}` : `A partir de ${minWholesale} unidades`}
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

              {/* Desglose y Total Estimado con ahorro evidente */}
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 font-medium">Subtotal sin descuento ({quantity} uds):</span>
                  <span className={`font-semibold ${isWholesaleActive ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                    {formatCOP(retailTotal)}
                  </span>
                </div>

                {isWholesaleActive && (
                  <div className="flex items-center justify-between text-xs text-emerald-700 font-bold">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Descuento Mayorista ({quantity} uds):</span>
                    </span>
                    <span className="bg-emerald-100 text-emerald-800 text-[11px] font-black px-2 py-0.5 rounded border border-emerald-200">
                      -{formatCOP(wholesaleSavings)}
                    </span>
                  </div>
                )}

                {isCouponApplied && (
                  <div className="flex items-center justify-between text-xs text-sanvi-red font-bold">
                    <span>Cupón de Tienda (-10%):</span>
                    <span className="bg-red-50 text-sanvi-red text-[11px] font-black px-2 py-0.5 rounded border border-red-200">
                      -{formatCOP(discountAmount)}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                  <div>
                    <span className="text-xs font-black text-gray-900 block">Total a pagar:</span>
                    {totalSavings > 0 && (
                      <span className="text-[11px] text-emerald-700 font-extrabold flex items-center gap-1">
                        🎉 ¡Te ahorraste {formatCOP(totalSavings)}!
                      </span>
                    )}
                  </div>
                  <span className="text-xl sm:text-2xl font-black text-gray-950">{formatCOP(totalPrice)}</span>
                </div>
              </div>
            </div>

            {/* BOTONES PRINCIPALES DE ACCIÓN (ESTILO TEMU) */}
            <div className="space-y-2.5 pt-3 border-t border-gray-100">
              {/* Botón Principal Destacado: COMPRAR AHORA */}
              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full bg-gradient-to-r from-sanvi-red to-[#FA2C19] hover:from-red-600 hover:to-orange-600 active:scale-[0.99] text-white font-black py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all text-sm sm:text-base cursor-pointer tracking-wide"
              >
                <Zap className="w-5 h-5 fill-white text-white animate-pulse" />
                <span>Comprar Ahora</span>
                <span className="text-white/80 font-normal text-xs sm:text-sm hidden sm:inline">•</span>
                <span className="text-white font-extrabold text-xs sm:text-sm hidden sm:inline">{formatCOP(totalPrice)}</span>
              </button>

              {/* Fila secundaria: Añadir al Carrito + Pedir por WhatsApp */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {/* Botón Carrito */}
                <button
                  type="button"
                  onClick={handleAddCartItem}
                  className="w-full bg-amber-50 hover:bg-amber-100 text-amber-950 border-2 border-amber-300 font-black py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 text-xs sm:text-sm shadow-sm"
                >
                  <ShoppingBag className="w-4 h-4 text-sanvi-orange" />
                  <span>Añadir al Carrito</span>
                </button>

                {/* Botón WhatsApp */}
                <button
                  type="button"
                  onClick={handleWhatsAppBuy}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 text-xs sm:text-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Pedir Directo por WhatsApp</span>
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

        {/* DETALLE Y ESPECIFICACIONES DE LA PRENDA / PRODUCTO */}
        <div className="mt-4 bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm space-y-3">
          <h3 className="text-base font-black text-gray-950 flex items-center gap-2">
            <span>Detalles y Especificaciones del Producto</span>
          </h3>
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line">
            {product.description || 'Prenda confeccionada con telas nacionales de alta resistencia y remates reforzados. Lista para venta al detal o distribución por mayor.'}
          </p>

          <div className="pt-3 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
            <MapPin className="w-4 h-4 text-sanvi-orange" />
            <span>Fabricado y distribuido desde el sector comercial de San Victorino, Bogotá.</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECCIÓN TEMU: CALIFICACIONES Y RESEÑAS DE LA COMPRA (NO DE LA TIENDA)    */}
        {/* ========================================================================= */}
        <div id="product-reviews-section" className="mt-6 bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm space-y-6">
          
          {/* Header de Reseñas */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black text-gray-950">
                  Calificaciones y Reseñas de la Compra
                </h3>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full">
                  ✓ Compradores Verificados
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Opiniones de clientes sobre la calidad, talla, tela y entrega de este producto específico.
              </p>
            </div>

            {/* Botón para calificar compra */}
            <button
              type="button"
              onClick={() => {
                if (!loggedInCustomer) {
                  if (onOpenAuthModal) onOpenAuthModal();
                } else {
                  setIsWritingReview(!isWritingReview);
                }
              }}
              className="bg-sanvi-orange hover:bg-orange-600 active:scale-95 text-white font-black text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 shrink-0"
            >
              <Star className="w-4 h-4 fill-white" />
              <span>{isWritingReview ? 'Cerrar Formulario' : 'Calificar mi Compra'}</span>
            </button>
          </div>

          {/* Banner de Éxito al publicar reseña */}
          {successReviewMsg && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center gap-2 text-xs font-bold text-emerald-900 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{successReviewMsg}</span>
            </div>
          )}

          {/* FORMULARIO DESPLEGABLE PARA CALIFICAR LA COMPRA */}
          {isWritingReview && (
            <div className="bg-orange-50/60 border-2 border-orange-200 p-4 sm:p-5 rounded-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-orange-200/80 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-sanvi-orange text-white flex items-center justify-center text-xs font-black">
                    {loggedInCustomer?.name?.[0] || 'C'}
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-900">{loggedInCustomer?.name || 'Camilo Matiz'}</p>
                    <p className="text-[10px] text-gray-500">Publicando como Comprador Verificado</p>
                  </div>
                </div>
                <span className="text-xs text-sanvi-orange font-bold">Calificación de tu Compra</span>
              </div>

              <form onSubmit={handleSubmitReview} className="space-y-3.5 text-xs">
                {/* Selector de Estrellas */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1.5">
                    ¿Qué puntuación le das a esta compra?
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((starVal) => (
                      <button
                        key={starVal}
                        type="button"
                        onClick={() => setFormRating(starVal)}
                        className="p-1 transition-transform hover:scale-110 focus:outline-none"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            starVal <= formRating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-gray-300 fill-gray-100'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-black text-amber-700 ml-2">
                      {formRating === 5 ? '¡Excelente compra!' : formRating === 4 ? 'Muy bueno' : formRating === 3 ? 'Bueno' : 'Regular'}
                    </span>
                  </div>
                </div>

                {/* Ciudad en Colombia */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Tu Ciudad en Colombia</label>
                    <input
                      type="text"
                      required
                      placeholder="ej: Bogotá, Medellín, Cali, Bucaramanga..."
                      value={formCity}
                      onChange={(e) => setFormCity(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs outline-none focus:border-sanvi-orange"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Detalle de la Prenda Comprada</label>
                    <input
                      type="text"
                      readOnly
                      value={`${selectedSize ? `Talla: ${selectedSize}` : ''} ${selectedColor ? `• Color: ${selectedColor}` : ''}`}
                      className="w-full bg-gray-100 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-600 font-semibold cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Comentario */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Tu opinión sobre el producto (calidad de tela, costuras, horma, rapidez):
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Escribe tu reseña sincera: ej. La tela rígida es gruesa de buena calidad, la talla horma exacto y llegó al siguiente día..."
                    value={formComment}
                    onChange={(e) => setFormComment(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl p-3 text-xs outline-none focus:border-sanvi-orange resize-none"
                  />
                </div>

                {/* Botones de acción */}
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsWritingReview(false)}
                    className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 font-bold hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-5 py-2 bg-sanvi-orange hover:bg-orange-600 text-white font-black rounded-xl shadow-md transition-all flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submittingReview ? 'Publicando...' : 'Publicar Calificación'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* DESGLOSE GENERAL ESTILO TEMU (Score + Barras + Tags) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 bg-gray-50 p-4 sm:p-5 rounded-2xl border border-gray-200">
            {/* Puntuación General */}
            <div className="md:col-span-4 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-gray-200 pb-4 md:pb-0 md:pr-4">
              <span className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">
                {rating}
              </span>
              <div className="flex items-center gap-1 my-1.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs font-bold text-gray-600">
                Basado en {reviews.length || 148} compras verificadas
              </p>
              <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>100% Clientes Reales</span>
              </div>
            </div>

            {/* Barras de distribución de estrellas */}
            <div className="md:col-span-4 space-y-1.5 flex flex-col justify-center">
              {[
                { stars: 5, pct: 92 },
                { stars: 4, pct: 6 },
                { stars: 3, pct: 2 },
                { stars: 2, pct: 0 },
                { stars: 1, pct: 0 }
              ].map((row) => (
                <div key={row.stars} className="flex items-center gap-2 text-xs">
                  <span className="w-12 text-gray-500 font-medium">{row.stars} estrellas</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full"
                      style={{ width: `${row.pct}%` }}
                    />
                  </div>
                  <span className="w-8 text-[11px] text-gray-400 text-right">{row.pct}%</span>
                </div>
              ))}
            </div>

            {/* Tags de Satisfacción Temu */}
            <div className="md:col-span-4 space-y-2 flex flex-col justify-center border-t md:border-t-0 md:border-l border-gray-200 pt-4 md:pt-0 md:pl-4">
              <p className="text-xs font-bold text-gray-800 mb-1">Satisfacción del Comprador:</p>
              <div className="space-y-1.5 text-xs text-gray-700 font-semibold">
                <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-gray-200 shadow-2xs">
                  <span>✓ Fiel a las fotos y video</span>
                  <span className="text-emerald-700 font-bold">98%</span>
                </div>
                <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-gray-200 shadow-2xs">
                  <span>✓ Calidad del material / tela</span>
                  <span className="text-emerald-700 font-bold">97%</span>
                </div>
                <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-gray-200 shadow-2xs">
                  <span>✓ Talla y horma precisa</span>
                  <span className="text-emerald-700 font-bold">95%</span>
                </div>
              </div>
            </div>
          </div>

          {/* LISTADO DE RESEÑAS DE COMPRA */}
          <div className="space-y-4 pt-2">
            {reviews.map((rev) => {
              const currentVotes = helpfulVotes[rev.id] !== undefined
                ? helpfulVotes[rev.id]
                : rev.helpful_votes || 12;

              return (
                <div
                  key={rev.id}
                  className="p-4 rounded-2xl bg-white border border-gray-200 hover:border-gray-300 transition-colors space-y-2.5"
                >
                  {/* Fila Superior: Usuario, Ciudad, Badge Verificado y Fecha */}
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                        <img
                          src={rev.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop'}
                          alt={rev.user_name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-xs font-black text-gray-900">{rev.user_name}</p>
                          <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Compra Verificada</span>
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400 font-medium">📍 {rev.city || 'Bogotá, Colombia'}</p>
                      </div>
                    </div>

                    <span className="text-[11px] text-gray-400 font-medium">{rev.date || 'Reciente'}</span>
                  </div>

                  {/* Estrellas y Detalle de la Prenda Comprada */}
                  <div className="flex items-center gap-2 flex-wrap pt-0.5">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= rev.rating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-gray-200 fill-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    {rev.variant_info && (
                      <span className="text-[11px] bg-gray-100 text-gray-700 font-medium px-2 py-0.5 rounded-md border border-gray-200">
                        {rev.variant_info}
                      </span>
                    )}
                  </div>

                  {/* Texto de la Reseña */}
                  <p className="text-xs sm:text-sm text-gray-800 leading-relaxed">
                    {rev.comment}
                  </p>

                  {/* Votos de Utilidad */}
                  <div className="flex items-center justify-between pt-1 border-t border-gray-50 text-[11px] text-gray-500">
                    <span className="text-gray-400">¿Te resultó útil esta reseña?</span>
                    <button
                      type="button"
                      onClick={() => handleVoteHelpful(rev.id, rev.helpful_votes || 12)}
                      className="inline-flex items-center gap-1 bg-gray-50 hover:bg-gray-100 px-2.5 py-1 rounded-full border border-gray-200 text-gray-700 font-bold transition-all active:scale-95"
                    >
                      <ThumbsUp className="w-3 h-3 text-gray-600" />
                      <span>Útil ({currentVotes})</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
}
