import React, { useState } from 'react';
import {
  X,
  Trash2,
  ArrowRight,
  ShoppingBag,
  MessageCircle,
  CreditCard,
  ShieldCheck,
  ExternalLink,
  Zap,
  Lock
} from 'lucide-react';
import CheckoutModal from './CheckoutModal';
import { api } from '../../services/api';

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  loggedInCustomer
}) {
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('wompi'); // 'wompi' | 'nequi' | 'daviplata' | 'contraentrega'

  if (!isOpen) return null;

  const formatCOP = (val) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  // Calcular totales teniendo en cuenta mayoreo por prenda
  const calculatedItems = items.map((item) => {
    const isWholesale = item.quantity >= (item.min_wholesale_qty || 6);
    const unitPrice = isWholesale ? Number(item.price_wholesale) : Number(item.price_retail);
    return {
      ...item,
      isWholesale,
      unitPrice,
      total: unitPrice * item.quantity
    };
  });

  const grandTotal = calculatedItems.reduce((acc, curr) => acc + curr.total, 0);

  const paymentLabels = {
    wompi: '🔵 Wompi Bancolombia (Tarjetas y Botón Bancolombia)',
    nequi: '🟣 Nequi / Nequi Negocios',
    daviplata: '🔴 Daviplata',
    contraentrega: '📦 Pago Contra Entrega (Bogotá)'
  };

  const handleCheckoutWhatsApp = () => {
    if (items.length === 0) return;

    // Registrar métrica
    calculatedItems.forEach(item => {
      api.trackWhatsApp({
        store_id: item.store_id,
        product_id: item.id,
        purchase_type: item.isWholesale ? 'MAYOR' : 'DETAL'
      }).catch(() => {});
    });

    // Crear mensaje estructurado para WhatsApp
    let msg = `🛍️ *CONSULTA / PEDIDO DESDE SANVI (SAN VICTORINO)*\n`;
    msg += `----------------------------------------\n`;
    calculatedItems.forEach((it, idx) => {
      msg += `${idx + 1}. *${it.title}*\n`;
      msg += `   • Cantidad: ${it.quantity} uds ${it.isWholesale ? '(Precio Mayorista)' : '(Precio Detal)'}\n`;
      msg += `   • Local: ${it.commercial_center} (${it.local_number})\n`;
      msg += `   • Subtotal: ${formatCOP(it.total)}\n\n`;
    });
    msg += `----------------------------------------\n`;
    msg += `💰 *TOTAL APROXIMADO: ${formatCOP(grandTotal)}*\n`;
    msg += `💳 *MEDIO DE PAGO PREFERIDO:* ${paymentLabels[paymentMethod] || 'Wompi'}\n`;
    msg += `📍 Deseo coordinar con el local la entrega y despacho.\n`;

    const encoded = encodeURIComponent(msg);
    const targetPhone = items[0]?.phone_whatsapp || '573105551234';
    window.open(`https://wa.me/${targetPhone}?text=${encoded}`, '_blank');
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
        <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
          
          {/* Cabecera del Carrito */}
          <div className="p-4 bg-gray-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-sanvi-orange" />
              <h3 className="font-black text-sm sm:text-base">Mi Carrito Sanvi</h3>
              <span className="bg-sanvi-orange text-white text-xs font-black px-2 py-0.5 rounded-full">
                {items.reduce((s, i) => s + i.quantity, 0)} uds
              </span>
            </div>

            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <button
                  onClick={onClearCart}
                  className="text-xs text-gray-400 hover:text-white transition-colors"
                >
                  Vaciar
                </button>
              )}
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Lista de Productos en el Carrito */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-2 p-6">
                <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center text-sanvi-orange mb-2">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-sm font-bold text-gray-500">Tu carrito está vacío</p>
                <p className="text-xs text-gray-400 max-w-xs">
                  Añade calzado, buzos, jeans y chaquetas de los locales de San Victorino con precios directos de fábrica.
                </p>
              </div>
            ) : (
              calculatedItems.map((item) => (
                <div key={item.id} className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex gap-3 relative">
                  <img
                    src={(item.images && item.images[0]) || 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=200'}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded-lg shrink-0 bg-gray-200"
                  />

                  <div className="flex-1 min-w-0 space-y-1">
                    <h4 className="text-xs font-bold text-gray-900 line-clamp-1">{item.title}</h4>
                    <div className="text-[10px] text-gray-500 font-semibold truncate">
                      📍 {item.commercial_center} • {item.local_number}
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div>
                        <div className="text-xs font-black text-sanvi-red">
                          {formatCOP(item.unitPrice)} c/u
                        </div>
                        {item.isWholesale && (
                          <span className="text-[9px] bg-amber-200 text-amber-900 px-1 py-0.2 rounded font-black">
                            ¡Tarifa Mayorista!
                          </span>
                        )}
                      </div>

                      {/* Selector de cantidad */}
                      <div className="flex items-center border border-gray-300 rounded-lg bg-white overflow-hidden">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-xs font-black text-gray-600 hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-bold">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs font-black text-gray-600 hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer con Total y DOS OPCIONES DE COMPRA (PLATAFORMA DIRECTA vs WHATSAPP) */}
          {items.length > 0 && (
            <div className="p-4 bg-gray-50 border-t border-gray-200 space-y-3">
              
              {/* Selector de Medio de Pago Preferido */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-black text-gray-700 uppercase tracking-wide">
                  Medio de pago preferido:
                </label>
                <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                  {/* Wompi */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('wompi')}
                    className={`p-2 rounded-lg border text-left transition-all flex items-center gap-1.5 ${
                      paymentMethod === 'wompi'
                        ? 'bg-blue-50 border-blue-600 text-blue-900 font-black ring-1 ring-blue-600'
                        : 'bg-white border-gray-200 text-gray-700 font-medium'
                    }`}
                  >
                    <span className="w-5 h-5 rounded bg-[#00109b] text-white text-[9px] font-black flex items-center justify-center shrink-0">
                      W
                    </span>
                    <span className="truncate">Wompi / Tarjetas</span>
                  </button>

                  {/* Nequi */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('nequi')}
                    className={`p-2 rounded-lg border text-left transition-all flex items-center gap-1.5 ${
                      paymentMethod === 'nequi'
                        ? 'bg-[#20002c]/5 border-[#ff007a] text-[#20002c] font-black ring-1 ring-[#ff007a]'
                        : 'bg-white border-gray-200 text-gray-700 font-medium'
                    }`}
                  >
                    <span className="w-5 h-5 rounded bg-[#20002c] text-[#ff007a] text-[10px] font-black flex items-center justify-center shrink-0">
                      N
                    </span>
                    <span className="truncate">Nequi Negocios</span>
                  </button>

                  {/* Daviplata */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('daviplata')}
                    className={`p-2 rounded-lg border text-left transition-all flex items-center gap-1.5 ${
                      paymentMethod === 'daviplata'
                        ? 'bg-red-50 border-red-500 text-red-900 font-black ring-1 ring-red-500'
                        : 'bg-white border-gray-200 text-gray-700 font-medium'
                    }`}
                  >
                    <span className="w-5 h-5 rounded bg-[#ed1c24] text-white text-[10px] font-black flex items-center justify-center shrink-0">
                      D
                    </span>
                    <span className="truncate">Daviplata</span>
                  </button>

                  {/* Contra Entrega */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('contraentrega')}
                    className={`p-2 rounded-lg border text-left transition-all flex items-center gap-1.5 ${
                      paymentMethod === 'contraentrega'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-900 font-black ring-1 ring-emerald-600'
                        : 'bg-white border-gray-200 text-gray-700 font-medium'
                    }`}
                  >
                    <span className="w-5 h-5 rounded bg-emerald-100 text-emerald-800 text-[11px] font-black flex items-center justify-center shrink-0">
                      📦
                    </span>
                    <span className="truncate">Contra Entrega</span>
                  </button>
                </div>
              </div>

              {/* Totales */}
              <div className="space-y-1 pt-1 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>Subtotal prendas:</span>
                  <span>{formatCOP(grandTotal)}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>Entrega express en Bogotá:</span>
                  <span className="text-emerald-700 font-bold">Mismo Día</span>
                </div>
                <div className="flex items-center justify-between text-base font-black text-gray-900 pt-1 border-t border-gray-200">
                  <span>Total Estimado:</span>
                  <span className="text-sanvi-red">{formatCOP(grandTotal)}</span>
                </div>
              </div>

              {/* DOS BOTONES CLAROS Y SEPARADOS */}
              <div className="space-y-2 pt-1">
                {/* 1. BOTÓN PRINCIPAL: COMPRAR DIRECTO EN PLATAFORMA */}
                <button
                  type="button"
                  onClick={() => setIsCheckoutModalOpen(true)}
                  className="w-full bg-gradient-to-r from-sanvi-red to-[#FA2C19] hover:from-red-600 hover:to-orange-600 text-white font-black py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95 text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer tracking-wide"
                >
                  <Zap className="w-5 h-5 fill-white text-white animate-pulse" />
                  <span>Comprar en Plataforma • {formatCOP(grandTotal)}</span>
                </button>

                {/* 2. BOTÓN SECUNDARIO: COORDINAR POR WHATSAPP */}
                <button
                  type="button"
                  onClick={handleCheckoutWhatsApp}
                  className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 text-xs shadow-xs"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>O coordinar pedido por WhatsApp</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400 text-center">
                <Lock className="w-3 h-3 text-emerald-500" />
                <span>Compra protegida por la Garantía de Bodegas San Victorino</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL DE CHECKOUT PROFESIONAL EN PLATAFORMA */}
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        items={calculatedItems}
        totalAmount={grandTotal}
        loggedInCustomer={loggedInCustomer}
        onOrderSuccess={(order) => {
          onClearCart();
        }}
      />
    </>
  );
}
