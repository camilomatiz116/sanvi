import React, { useState } from 'react';
import { X, Upload, Video, Image as ImageIcon, Flame, Plus, Tag, Percent, ArrowDown, Check, Scissors, Palette } from 'lucide-react';
import { compressImageClient } from '../../utils/imageCompressor';
import { isApparelOrFootwearCategory } from '../../utils/categoryHelper';
import { api } from '../../services/api';

// Plantillas rápidas de tallas estilo Temu Seller Central
const SIZE_PRESETS = [
  { label: '👕 Ropa (S-XXL)', sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
  { label: '👖 Jeans Dama (6-16)', sizes: ['6', '8', '10', '12', '14', '16'] },
  { label: '👖 Hombre Dril (28-38)', sizes: ['28', '30', '32', '34', '36', '38'] },
  { label: '👟 Zapatos (35-44)', sizes: ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44'] },
  { label: '🧒 Infantil (4-16)', sizes: ['4', '6', '8', '10', '12', '14', '16'] },
  { label: '📦 Talla Única', sizes: ['Talla Única'] }
];

const COLOR_PRESETS = [
  { name: 'Negro', hex: '#111827' },
  { name: 'Blanco', hex: '#F3F4F6', border: true },
  { name: 'Azul Índigo', hex: '#1E3A8A' },
  { name: 'Azul Hielo', hex: '#93C5FD' },
  { name: 'Gris Plomo', hex: '#4B5563' },
  { name: 'Beige Arena', hex: '#D7C4A5' },
  { name: 'Verde Militar', hex: '#3F4E34' },
  { name: 'Rojo Pasión', hex: '#DC2626' },
  { name: 'Café Miel', hex: '#78350F' },
  { name: 'Rosado Pastel', hex: '#F472B6' }
];

export default function CreateProductModal({ isOpen, onClose, onProductCreated }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Moda & Confección');
  const [priceRetail, setPriceRetail] = useState('');
  const [priceWholesale, setPriceWholesale] = useState('');
  const [minWholesaleQty, setMinWholesaleQty] = useState('6');
  const [originalPrice, setOriginalPrice] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [isMadrugon, setIsMadrugon] = useState(true);
  const [description, setDescription] = useState('');

  // Tallas y Colores (Variantes)
  const [sizes, setSizes] = useState(['S', 'M', 'L', 'XL']);
  const [colors, setColors] = useState(['Negro', 'Azul Índigo']);
  const [customSizeInput, setCustomSizeInput] = useState('');
  const [customColorInput, setCustomColorInput] = useState('');

  // Herramienta de Descuento Rápido estilo Temu
  const [customDiscountPct, setCustomDiscountPct] = useState('50');
  const [discountAppliedMsg, setDiscountAppliedMsg] = useState(null);

  // Galería de fotos múltiples
  const [imagesList, setImagesList] = useState([]);
  const [compressing, setCompressing] = useState(false);
  const [compressionStats, setCompressionStats] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  // Cambio de categoría con ajuste automático de variantes
  const handleCategoryChange = (newCat) => {
    setCategory(newCat);
    if (!isApparelOrFootwearCategory(newCat)) {
      // Si cambia a tecnología, hogar, etc., limpiamos tallas por completo
      setSizes([]);
    } else if (sizes.length === 0) {
      if (newCat.includes('Calzado') || newCat.includes('Cuero')) {
        setSizes(['36', '37', '38', '39', '40', '41', '42']);
      } else {
        setSizes(['S', 'M', 'L', 'XL']);
      }
    }
  };

  // Manejo de Tallas
  const handleApplySizePreset = (presetSizes) => {
    setSizes(presetSizes);
  };

  const handleToggleSize = (sizeStr) => {
    if (sizes.includes(sizeStr)) {
      setSizes(sizes.filter((s) => s !== sizeStr));
    } else {
      setSizes([...sizes, sizeStr]);
    }
  };

  const handleAddCustomSize = (e) => {
    e.preventDefault();
    const clean = customSizeInput.trim().toUpperCase();
    if (!clean) return;
    if (!sizes.includes(clean)) {
      setSizes([...sizes, clean]);
    }
    setCustomSizeInput('');
  };

  // Manejo de Colores
  const handleToggleColor = (colorName) => {
    if (colors.includes(colorName)) {
      setColors(colors.filter((c) => c !== colorName));
    } else {
      setColors([...colors, colorName]);
    }
  };

  const handleAddCustomColor = (e) => {
    e.preventDefault();
    const clean = customColorInput.trim();
    if (!clean) return;
    if (!colors.includes(clean)) {
      setColors([...colors, clean]);
    }
    setCustomColorInput('');
  };

  // Función para aplicar descuento Temu con cálculo automático
  const handleApplyDiscount = (pctNumber) => {
    const pct = Number(pctNumber) || 50;
    const currentRetail = Number(priceRetail);

    if (!currentRetail || currentRetail <= 0) {
      alert('Ingresa primero un Precio Detal para aplicar el descuento.');
      return;
    }

    const calculatedOriginal = Math.round(currentRetail / (1 - (pct / 100)));
    setOriginalPrice(calculatedOriginal);

    if (!priceWholesale || Number(priceWholesale) >= currentRetail) {
      setPriceWholesale(Math.round(currentRetail * 0.65));
    }

    setDiscountAppliedMsg(`¡Descuento del ${pct}% aplicado! Se calculó precio antes de $${new Intl.NumberFormat('es-CO').format(calculatedOriginal)} COP.`);
    setTimeout(() => setDiscountAppliedMsg(null), 3000);
  };

  const handleMultipleImagesChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      setCompressing(true);
      let totalOriginal = 0;
      let totalCompressed = 0;
      const newUrls = [];

      for (const file of files) {
        const result = await compressImageClient(file);
        totalOriginal += result.originalSizeKB;
        totalCompressed += result.compressedSizeKB;
        newUrls.push(result.previewUrl);
      }

      setImagesList((prev) => [...prev, ...newUrls]);
      setCompressionStats({
        count: files.length,
        originalKB: totalOriginal,
        compressedKB: totalCompressed,
        savedPercent: Math.round(((totalOriginal - totalCompressed) / totalOriginal) * 100)
      });
    } catch (err) {
      alert('Error al procesar las fotos: ' + err.message);
    } finally {
      setCompressing(false);
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setImagesList((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !priceRetail || !priceWholesale) {
      alert('Por favor completa el título y los precios');
      return;
    }

    try {
      setSubmitting(true);

      const finalImages = imagesList.length > 0
        ? imagesList
        : ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop'];

      const newProd = await api.createProduct({
        title,
        category,
        price_retail: Number(priceRetail),
        price_wholesale: Number(priceWholesale),
        min_wholesale_qty: Number(minWholesaleQty),
        original_price: Number(originalPrice || priceRetail * 1.5),
        is_madrugon_deal: isMadrugon,
        video_url: videoUrl,
        description,
        images: finalImages,
        variants: {
          sizes: isApparelOrFootwearCategory(category) && sizes.length > 0 ? sizes : undefined,
          colors: colors.length > 0 ? colors : undefined
        }
      });

      if (onProductCreated) onProductCreated(newProd.product);
      onClose();
    } catch (err) {
      alert('Error publicando el producto: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const liveDiscountPct = (originalPrice && priceRetail && Number(originalPrice) > Number(priceRetail))
    ? Math.round(((Number(originalPrice) - Number(priceRetail)) / Number(originalPrice)) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Cabecera */}
        <div className="bg-gray-900 text-white p-4 flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-black flex items-center gap-2">
              <Upload className="w-5 h-5 text-sanvi-orange" />
              Publicar Producto en Sanvi
            </h3>
            <p className="text-xs text-gray-400">Aparecerá en tu tienda y en el feed de San Victorino</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3.5 text-xs sm:text-sm max-h-[82vh] overflow-y-auto">
          {/* Título de la prenda */}
          <div>
            <label className="block font-bold text-gray-700 mb-1">Nombre / Título del Producto *</label>
            <input
              required
              type="text"
              placeholder="Ej: Jean Levanta Cola Tiro Alto Rígido Denim"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 outline-none focus:border-sanvi-orange text-xs font-semibold"
            />
          </div>

          {/* Categoría */}
          <div>
            <label className="block font-bold text-gray-700 mb-1">Categoría del Producto</label>
            <select
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 outline-none focus:border-sanvi-orange text-xs font-bold"
            >
              <option value="Tecnología & Celulares">📱 Tecnología & Celulares</option>
              <option value="Moda & Confección">👗 Moda & Confección</option>
              <option value="Belleza & Cuidado Personal">💄 Belleza & Cuidado Personal</option>
              <option value="Juguetería & Niños">🧸 Juguetería & Niños</option>
              <option value="Hogar & Cocina">🏠 Hogar & Cocina</option>
              <option value="Morrales & Maletas">🎒 Morrales & Maletas</option>
              <option value="Calzado & Cuero">👟 Calzado & Cuero</option>
              <option value="Bisutería & Accesorios">💍 Bisutería & Accesorios</option>
              <option value="Cacharrería Mayorista">📦 Cacharrería Mayorista</option>
            </select>
          </div>

          {/* ======================================================== */}
          {/* SECCIÓN TEMU: HERRAMIENTA DE DESCUENTO RÁPIDO            */}
          {/* ======================================================== */}
          <div className="bg-[#FFF4EC] border-2 border-dashed border-[#FA2C19]/50 rounded-2xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-black text-[#D31B0B] text-xs uppercase tracking-wide flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-sanvi-red" />
                Herramienta de Descuento Temu (Atrae más clics)
              </span>
              {liveDiscountPct > 0 && (
                <span className="bg-sanvi-red text-white text-[11px] font-black px-2 py-0.5 rounded shadow">
                  -{liveDiscountPct}% OFF
                </span>
              )}
            </div>

            <p className="text-[11px] text-gray-700 font-medium">
              Aplica un <strong>descuento visual de liquidación</strong> para calcular el precio tachado de referencia:
            </p>

            <div className="grid grid-cols-4 gap-1.5">
              {[
                { label: '-20% Promo', pct: 20 },
                { label: '-30% Oferta', pct: 30 },
                { label: '-50% Mitad', pct: 50 },
                { label: '-60% Madrugón', pct: 60 }
              ].map((btn) => (
                <button
                  key={btn.pct}
                  type="button"
                  onClick={() => handleApplyDiscount(btn.pct)}
                  className="bg-white hover:bg-red-50 text-sanvi-red border-2 border-sanvi-red/40 hover:border-sanvi-red font-black py-1.5 px-1 rounded-xl text-[11px] transition-all shadow-sm active:scale-95 flex items-center justify-center gap-0.5"
                >
                  <Percent className="w-3 h-3" />
                  <span>{btn.label}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <div className="flex-1 flex items-center bg-white border border-gray-300 rounded-xl px-2.5 py-1">
                <span className="text-[11px] text-gray-500 font-bold mr-1">Otro Descuento:</span>
                <input
                  type="number"
                  min="5"
                  max="90"
                  value={customDiscountPct}
                  onChange={(e) => setCustomDiscountPct(e.target.value)}
                  placeholder="Ej: 45"
                  className="w-14 text-xs font-black text-sanvi-red outline-none text-center"
                />
                <span className="text-xs font-black text-gray-500">%</span>
              </div>

              <button
                type="button"
                onClick={() => handleApplyDiscount(customDiscountPct)}
                className="bg-sanvi-red hover:bg-red-700 text-white font-black text-xs px-3.5 py-2 rounded-xl transition-all shadow active:scale-95 flex items-center gap-1 shrink-0"
              >
                <span>Aplicar Descuento</span>
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
            </div>

            {discountAppliedMsg && (
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-2 rounded-xl text-[11px] font-bold flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>{discountAppliedMsg}</span>
              </div>
            )}
          </div>

          {/* Precios (Doble precio colombia: Detal y Mayorista) */}
          <div className="grid grid-cols-2 gap-3 bg-[#FFF9F2] p-3 rounded-xl border border-amber-200">
            <div>
              <label className="block font-bold text-sanvi-red mb-1">Precio Detal Final (COP) *</label>
              <input
                required
                type="number"
                placeholder="38000"
                value={priceRetail}
                onChange={(e) => setPriceRetail(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 outline-none focus:border-sanvi-orange text-xs font-black text-sanvi-red"
              />
              <span className="text-[10px] text-gray-500">Precio que paga el comprador</span>
            </div>

            <div>
              <label className="block font-bold text-amber-900 mb-1">Precio x Mayor (COP) *</label>
              <input
                required
                type="number"
                placeholder="24500"
                value={priceWholesale}
                onChange={(e) => setPriceWholesale(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 outline-none focus:border-sanvi-orange text-xs font-black text-amber-900"
              />
              <span className="text-[10px] text-gray-500">Tarifa para compras por lote</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Mínimo para Mayor</label>
              <input
                type="number"
                placeholder="6"
                value={minWholesaleQty}
                onChange={(e) => setMinWholesaleQty(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 outline-none focus:border-sanvi-orange text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Precio Antes (Tachado)</label>
              <input
                type="number"
                placeholder="75000"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 outline-none focus:border-sanvi-orange font-bold text-gray-600"
              />
            </div>
          </div>

          {/* ========================================================= */}
          {/* SECCIÓN DE TALLAS & COLORES (SOLO ROPA Y ZAPATOS)        */}
          {/* ========================================================= */}
          {isApparelOrFootwearCategory(category) ? (
            <div className="border-2 border-indigo-200/80 bg-gradient-to-b from-indigo-50/50 to-white rounded-2xl p-3.5 space-y-3.5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-black text-xs shadow">
                    📏
                  </div>
                  <div>
                    <h4 className="font-black text-xs text-gray-900 flex items-center gap-1.5">
                      Tallas Disponibles en Bodega
                      <span className="text-[10px] bg-indigo-100 text-indigo-800 font-extrabold px-1.5 py-0.2 rounded">
                        Ropa & Calzado
                      </span>
                    </h4>
                    <p className="text-[10px] text-gray-500">
                      El cliente podrá elegir su talla antes de cotizar o pedir por WhatsApp
                    </p>
                  </div>
                </div>
                {sizes.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSizes([])}
                    className="text-[10px] text-red-600 hover:underline font-bold"
                  >
                    Limpiar tallas
                  </button>
                )}
              </div>

              {/* Plantillas Rápidas de Tallas (Un clic) */}
              <div>
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider block mb-1.5">
                  ⚡ Plantillas Rápidas de Tallas (1 Clic):
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {SIZE_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => handleApplySizePreset(preset.sizes)}
                      className="bg-white hover:bg-indigo-50 hover:border-indigo-300 border border-gray-200 text-gray-700 text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all active:scale-95 shadow-2xs"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chips de Tallas Activas con botón de eliminar */}
              <div className="bg-white p-2.5 rounded-xl border border-gray-200 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-gray-700">Tallas Activas ({sizes.length}):</span>
                  {sizes.length === 0 && (
                    <span className="text-amber-600 font-bold text-[10px]">
                      ⚠️ Sin tallas seleccionadas
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 flex-wrap min-h-[32px]">
                  {sizes.map((s) => (
                    <span
                      key={s}
                      className="bg-gray-950 text-white font-black text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-xs group"
                    >
                      <span>{s}</span>
                      <button
                        type="button"
                        onClick={() => handleToggleSize(s)}
                        className="text-gray-400 hover:text-red-400 group-hover:scale-110 transition-transform"
                        title={`Quitar talla ${s}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                {/* Input para agregar talla personalizada */}
                <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
                  <input
                    type="text"
                    value={customSizeInput}
                    onChange={(e) => setCustomSizeInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomSize(e);
                      }
                    }}
                    placeholder="Agregar talla custom (ej: 38.5, XXXL, 16)..."
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1 text-xs outline-none focus:border-indigo-500 font-semibold"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomSize}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black px-3 py-1 rounded-lg shadow-sm transition-all active:scale-95 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar</span>
                  </button>
                </div>
              </div>

              {/* Selector de Colores Disponibles */}
              <div className="pt-1 border-t border-indigo-100 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-gray-800 flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-indigo-600" />
                    Colores Disponibles ({colors.length} seleccionados):
                  </span>
                  {colors.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setColors([])}
                      className="text-[10px] text-gray-500 hover:underline"
                    >
                      Deseleccionar todos
                    </button>
                  )}
                </div>

                {/* Botones de colores rápidos */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {COLOR_PRESETS.map((col) => {
                    const isSelected = colors.includes(col.name);
                    return (
                      <button
                        key={col.name}
                        type="button"
                        onClick={() => handleToggleColor(col.name)}
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all border ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300'
                        }`}
                      >
                        <span
                          className={`w-3 h-3 rounded-full ${col.border ? 'border border-gray-300' : ''}`}
                          style={{ backgroundColor: col.hex }}
                        />
                        <span>{col.name}</span>
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </button>
                    );
                  })}
                </div>

                {/* Input para color personalizado */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={customColorInput}
                    onChange={(e) => setCustomColorInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomColor(e);
                      }
                    }}
                    placeholder="Otro color (ej: Vinotinto, Mostaza, Camuflado)..."
                    className="flex-1 bg-white border border-gray-200 rounded-lg px-2.5 py-1 text-xs outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomColor}
                    className="bg-gray-800 hover:bg-gray-900 text-white text-xs font-bold px-3 py-1 rounded-lg shadow-sm transition-all active:scale-95 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Color</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Para Tecnología, Celulares, Hogar, Juguetes, etc.: NO se muestran tallas */
            <div className="border border-gray-200 bg-gray-50/80 rounded-2xl p-3.5 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-gray-800 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-sanvi-orange" />
                  Variantes de Color para {category} (Opcional)
                </span>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  ✓ Sin tallas (No aplica para esta categoría)
                </span>
              </div>

              <p className="text-[10px] text-gray-500">
                Selecciona colores si tu artículo viene en diferentes tonos (ej: Negro, Blanco, Plata).
              </p>

              <div className="flex items-center gap-1.5 flex-wrap">
                {COLOR_PRESETS.slice(0, 7).map((col) => {
                  const isSelected = colors.includes(col.name);
                  return (
                    <button
                      key={col.name}
                      type="button"
                      onClick={() => handleToggleColor(col.name)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all border ${
                        isSelected
                          ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${col.border ? 'border border-gray-300' : ''}`}
                        style={{ backgroundColor: col.hex }}
                      />
                      <span>{col.name}</span>
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* MÓDULO DE FOTOS MÚLTIPLES CON COMPRESOR WEBP */}
          <div className="border border-dashed border-gray-300 rounded-xl p-3 bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-gray-800 flex items-center gap-1.5 text-xs">
                <ImageIcon className="w-4 h-4 text-sanvi-orange" />
                Galería de Fotos ({imagesList.length} cargadas)
              </span>
              {compressing && (
                <span className="text-[10px] text-sanvi-orange font-bold animate-pulse">
                  Comprimiendo a WebP...
                </span>
              )}
            </div>

            {imagesList.length > 0 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 mb-3">
                {imagesList.map((imgUrl, idx) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group bg-gray-200">
                    <img src={imgUrl} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                    {idx === 0 && (
                      <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[8px] font-black text-center py-0.5">
                        Principal
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full shadow transition-all active:scale-95"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <label className="block bg-white hover:bg-orange-50 border-2 border-dashed border-sanvi-orange/40 hover:border-sanvi-orange p-3 rounded-xl cursor-pointer text-center transition-all group">
              <Plus className="w-5 h-5 text-sanvi-orange mx-auto mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-gray-700 block">
                Seleccionar Fotos (Puedes elegir varias)
              </span>
              <span className="text-[10px] text-gray-400">
                Se optimizarán automáticamente a WebP de bajo peso
              </span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleMultipleImagesChange}
                className="hidden"
              />
            </label>

            {compressionStats && (
              <div className="mt-2 bg-emerald-50 border border-emerald-200 text-emerald-800 p-2 rounded-lg text-[10px] flex items-center justify-between">
                <span>
                  ✅ {compressionStats.count} fotos comprimidas ({compressionStats.originalKB} KB ➔ {compressionStats.compressedKB} KB)
                </span>
                <span className="bg-emerald-600 text-white font-black px-1.5 py-0.2 rounded">
                  -{compressionStats.savedPercent}% de espacio
                </span>
              </div>
            )}
          </div>

          {/* Video de TikTok o YouTube Shorts */}
          <div>
            <label className="block font-bold text-gray-700 mb-1 flex items-center gap-1.5">
              <Video className="w-4 h-4 text-red-500" />
              Enlace de Video (TikTok o YouTube Shorts)
            </label>
            <input
              type="url"
              placeholder="https://www.tiktok.com/@tu_local/video/... o YouTube Short"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 outline-none focus:border-sanvi-orange text-xs"
            />
          </div>

          {/* Toggle Madrugón */}
          <div className="flex items-center justify-between p-2.5 bg-yellow-50 rounded-xl border border-yellow-200">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-sanvi-orange" />
              <div>
                <span className="font-extrabold text-xs text-gray-900">Destacar en Ofertas Madrugón</span>
                <p className="text-[10px] text-gray-500">Aparecerá en el banner principal con reloj de liquidación</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={isMadrugon}
              onChange={(e) => setIsMadrugon(e.target.checked)}
              className="w-5 h-5 accent-sanvi-orange cursor-pointer"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-sanvi-orange hover:bg-orange-600 text-white font-black py-3 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 text-xs sm:text-sm"
          >
            {submitting ? 'Publicando...' : 'Publicar Producto Ahora'}
          </button>
        </form>
      </div>
    </div>
  );
}
