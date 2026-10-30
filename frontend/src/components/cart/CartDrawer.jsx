import React from 'react';
import { X, Trash2, MessageCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart
}) {
  if (!isOpen) return null;

  const formatCOP = (val) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  // Calcular totales aplicando tarifa mayorista si cumple cantidad mínima
  const calculatedItems = items.map(item => {
    const isWholesale = item.quantity >= (item.min_wholesale_qty || 6);
    const unitPrice = isWholesale && item.price_wholesale ? item.price_wholesale : item.price_retail;
    return {
      ...item,
      isWholesale,
      unitPrice,
      total: unitPrice * item.quantity
    };
  });

  const grandTotal = calculatedItems.reduce((acc, curr) => acc + curr.total, 0);

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
    let msg = `🛍️ *PEDIDO DESDE SANVI (SAN VICTORINO)*\n`;
    msg += `----------------------------------------\n`;
    calculatedItems.forEach((it, idx) => {
      msg += `${idx + 1}. *${it.title}*\n`;
      msg += `   • Cantidad: ${it.quantity} uds ${it.isWholesale ? '(Precio Mayorista)' : '(Precio Detal)'}\n`;
      msg += `   • Local: ${it.commercial_center} (${it.local_number})\n`;
      msg += `   • Subtotal: ${formatCOP(it.total)}\n\n`;
    });
    msg += `----------------------------------------\n`;
    msg += `💰 *TOTAL A PAGAR: ${formatCOP(grandTotal)}*\n`;
    msg += `📍 Deseo coordinar entrega el mismo día en Bogotá / Envío Nacional.\n`;

    const encoded = encodeURIComponent(msg);
    // WhatsApp del primer comerciante o número central de despacho de Sanvi
    const targetPhone = items[0]?.phone_whatsapp || '573105551234';
    window.open(`https://wa.me/${targetPhone}?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Cabecera del Carrito */}
        <div className="p-4 bg-gray-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-sanvi-orange" />
            <h3 className="font-black text-sm sm:text-base">Mi Carrito Sanvi</h3>
            <span className="bg-sanvi-orange text-white text-[11px] font-black px-2 py-0.5 rounded-full">
              {items.length} prendas
            </span>
          </div>
          <button onClick={onClose} className="p-1 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lista de productos */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 space-y-3">
              <ShoppingBag className="w-12 h-12 text-gray-300" />
              <p className="text-sm font-bold text-gray-500">Tu carrito está vacío</p>
              <p className="text-xs text-gray-400 max-w-xs">
                Añade buzos, jeans y chaquetas de los locales de San Victorino con precios directos de fábrica.
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
                          ¡Tarifa Mayorista Aplicada!
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

        {/* Footer con Total y Cierre en WhatsApp */}
        {items.length > 0 && (
          <div className="p-4 bg-gray-50 border-t border-gray-200 space-y-3">
            <div className="space-y-1">
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

            <button
              onClick={handleCheckoutWhatsApp}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 text-xs sm:text-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Confirmar Pedido por WhatsApp</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

