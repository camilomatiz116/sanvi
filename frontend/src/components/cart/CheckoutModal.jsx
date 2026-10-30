import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Lock,
  CreditCard,
  Truck,
  CheckCircle2,
  ChevronRight,
  MapPin,
  Phone,
  User,
  ShoppingBag,
  ExternalLink,
  QrCode,
  Copy,
  Check,
  MessageCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { api } from '../../services/api';

export default function CheckoutModal({
  isOpen,
  onClose,
  items,
  totalAmount,
  loggedInCustomer,
  onOrderSuccess
}) {
  const [step, setStep] = useState('form'); // 'form' | 'success'
  const [createdOrder, setCreatedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  // Datos de envío
  const [customerName, setCustomerName] = useState(loggedInCustomer?.name || 'Camilo Matiz');
  const [customerEmail, setCustomerEmail] = useState(loggedInCustomer?.email || 'camilomatiz114@gmail.com');
  const [customerPhone, setCustomerPhone] = useState(loggedInCustomer?.phone || '3105551234');
  const [city, setCity] = useState(loggedInCustomer?.city || 'Bogotá D.C.');
  const [address, setAddress] = useState('Carrera 10 # 12 - 45, Apto 402');
  const [notes, setNotes] = useState('Dejar en portería si no responden al timbre');

  // Método de pago
  const [paymentMethod, setPaymentMethod] = useState('wompi'); // 'wompi' | 'nequi' | 'daviplata' | 'contraentrega'
  const [transferRef, setTransferRef] = useState('');

  if (!isOpen || items.length === 0) return null;

  const formatCOP = (val) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const primaryStore = items[0] || {};
  const wompiKeyOrLink = primaryStore.wompi_link || 'pub_prod_JYYBeo1o69CqL00LjuL29cGL9fl0DOVx';
  const nequiNumber = primaryStore.nequi_number || primaryStore.phone_whatsapp || '3102345678';
  const daviplataNumber = primaryStore.daviplata_number || primaryStore.phone_whatsapp || '3102345678';

  const getWompiUrl = () => {
    if (!wompiKeyOrLink) return null;
    const trimmed = wompiKeyOrLink.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }
    const cents = Math.round(totalAmount * 100);
    const ref = `SANVI-${Date.now()}`;
    return `https://checkout.wompi.co/p/?public-key=${encodeURIComponent(trimmed)}&currency=COP&amount-in-cents=${cents}&reference=${ref}`;
  };

  const handleProcessOrder = async (e) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !address) {
      alert('Por favor completa los datos de entrega.');
      return;
    }

    try {
      setLoading(true);

      const orderPayload = {
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        shipping_address: address,
        shipping_city: city,
        shipping_notes: notes,
        payment_method: paymentMethod.toUpperCase(),
        payment_reference: transferRef || `PAG-${Date.now()}`,
        total_amount: totalAmount,
        store_id: primaryStore.store_id || 'store-005',
        items: items.map(item => ({
          id: item.id,
          title: item.title,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.total,
          selectedSize: item.selectedSize || '',
          selectedColor: item.selectedColor || ''
        }))
      };

      const res = await api.createOrder(orderPayload);
      const order = res.order || {
        ...orderPayload,
        order_number: `SNV-${Math.floor(10000 + Math.random() * 90000)}`,
        created_at: new Date().toISOString()
      };

      setCreatedOrder(order);
      setStep('success');

      if (onOrderSuccess) {
        onOrderSuccess(order);
      }
    } catch (err) {
      alert('Error procesando el pedido: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyNequi = () => {
    navigator.clipboard.writeText(nequiNumber);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 border border-gray-100 my-auto">
        
        {/* CABECERA DE CHECKOUT PROFESIONAL */}
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-[#1C1D1F] text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sanvi-red text-white flex items-center justify-center font-black">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black tracking-tight flex items-center gap-2">
                <span>Finalizar Compra Segura en SANVI</span>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-black px-2 py-0.2 rounded-full">
                  Directo en Plataforma
                </span>
              </h2>
              <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                <Lock className="w-3 h-3 text-emerald-400" />
                <span>Encriptación Bancaria 256-bit • Pagos verificados en Colombia</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CONTENIDO: FORMULARIO DE CHECKOUT O RECIBO DE ÉXITO */}
        {step === 'form' ? (
          <form onSubmit={handleProcessOrder} className="p-4 sm:p-6 space-y-5 max-h-[85vh] overflow-y-auto">
            
            {/* 1. SECCIÓN: DATOS DE ENVÍO Y DESTINATARIO */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <span className="text-xs font-black text-gray-900 uppercase tracking-wide flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-sanvi-orange" />
                  <span>1. Dirección de Entrega en Colombia</span>
                </span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md font-bold">
                  Entrega express Bogotá
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Nombre completo del destinatario</label>
                  <div className="relative">
                    <input
                      required
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Ej: Camilo Matiz"
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-8 pr-3 py-2 text-xs font-semibold outline-none focus:border-sanvi-orange"
                    />
                    <User className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Celular de contacto para la entrega</label>
                  <div className="relative">
                    <input
                      required
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="3105551234"
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-8 pr-3 py-2 text-xs font-mono font-bold outline-none focus:border-sanvi-orange"
                    />
                    <Phone className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Ciudad / Municipio</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-sanvi-orange"
                  >
                    <option value="Bogotá D.C.">Bogotá D.C.</option>
                    <option value="Soacha, Cundinamarca">Soacha, Cundinamarca</option>
                    <option value="Chía, Cundinamarca">Chía, Cundinamarca</option>
                    <option value="Medellín, Antioquia">Medellín, Antioquia</option>
                    <option value="Cali, Valle del Cauca">Cali, Valle del Cauca</option>
                    <option value="Barranquilla, Atlántico">Barranquilla, Atlántico</option>
                    <option value="Bucaramanga, Santander">Bucaramanga, Santander</option>
                    <option value="Otra Ciudad (Nacional)">Otra Ciudad (Nacional)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Dirección de entrega (Calle, Casa, Apto, Barrio)</label>
                  <input
                    required
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Ej: Carrera 10 # 12 - 45, Apto 402, La Candelaria"
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-sanvi-orange"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">Indicaciones de entrega (opcional)</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ej: Dejar en portería con el celador o llamar antes de subir"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs outline-none focus:border-sanvi-orange"
                />
              </div>
            </div>

            {/* 2. SECCIÓN: RESUMEN DE ARTÍCULOS EN EL PEDIDO */}
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <span className="text-xs font-black text-gray-900 uppercase tracking-wide flex items-center justify-between">
                <span>2. Resumen del Pedido ({items.reduce((s, i) => s + i.quantity, 0)} artículos)</span>
                <span className="text-sanvi-red font-black text-sm">{formatCOP(totalAmount)}</span>
              </span>

              <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                {items.map((it, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs bg-gray-50 p-2 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src={(it.images && it.images[0]) || 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=100'}
                        alt={it.title}
                        className="w-9 h-9 object-cover rounded-md bg-gray-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-gray-900 truncate">{it.title}</p>
                        <p className="text-[10px] text-gray-500">
                          {it.quantity} uds • {it.selectedSize ? `Talla ${it.selectedSize}` : 'Talla estándar'}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-gray-900 shrink-0">
                      {formatCOP(it.total)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. SECCIÓN: MÉTODO DE PAGO COLOMBIANO DIRECTO EN PLATAFORMA */}
            <div className="space-y-3 pt-2 border-t border-gray-100">
              <span className="text-xs font-black text-gray-900 uppercase tracking-wide flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-sanvi-orange" />
                <span>3. Selecciona tu Pasarela de Pago Colombiana</span>
              </span>

              {/* Selector de Pasarela */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {/* 1. Wompi */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('wompi')}
                  className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    paymentMethod === 'wompi'
                      ? 'bg-blue-50/80 border-blue-600 ring-2 ring-blue-600/40'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="w-6 h-6 rounded bg-[#00109b] text-white text-[10px] font-black flex items-center justify-center">
                      W
                    </span>
                    <span className="text-[9px] font-black bg-blue-100 text-blue-900 px-1 py-0.2 rounded">
                      En Línea
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-900">Wompi</p>
                    <p className="text-[10px] text-gray-500 leading-tight">Tarjetas & Bancolombia</p>
                  </div>
                </button>

                {/* 2. Nequi */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('nequi')}
                  className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    paymentMethod === 'nequi'
                      ? 'bg-purple-50/80 border-[#ff007a] ring-2 ring-[#ff007a]/40'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="w-6 h-6 rounded bg-[#20002c] text-[#ff007a] text-[10px] font-black flex items-center justify-center">
                      N
                    </span>
                    <span className="text-[9px] font-black bg-purple-100 text-purple-900 px-1 py-0.2 rounded">
                      Inmediato
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-900">Nequi</p>
                    <p className="text-[10px] text-gray-500 leading-tight">QR o Transferencia</p>
                  </div>
                </button>

                {/* 3. Daviplata */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('daviplata')}
                  className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    paymentMethod === 'daviplata'
                      ? 'bg-red-50/80 border-red-500 ring-2 ring-red-500/40'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="w-6 h-6 rounded bg-[#ed1c24] text-white text-[10px] font-black flex items-center justify-center">
                      D
                    </span>
                    <span className="text-[9px] font-black bg-red-100 text-red-900 px-1 py-0.2 rounded">
                      Davitransfiya
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-900">Daviplata</p>
                    <p className="text-[10px] text-gray-500 leading-tight">App Davivienda</p>
                  </div>
                </button>

                {/* 4. Contra Entrega */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('contraentrega')}
                  className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    paymentMethod === 'contraentrega'
                      ? 'bg-emerald-50/80 border-emerald-600 ring-2 ring-emerald-600/40'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="w-6 h-6 rounded bg-emerald-100 text-emerald-800 text-[11px] font-black flex items-center justify-center">
                      📦
                    </span>
                    <span className="text-[9px] font-black bg-emerald-200 text-emerald-900 px-1 py-0.2 rounded">
                      Bogotá
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-900">Contra Entrega</p>
                    <p className="text-[10px] text-gray-500 leading-tight">Pagas al recibir</p>
                  </div>
                </button>
              </div>

              {/* DETALLE SEGÚN EL MÉTODO SELECCIONADO */}
              {paymentMethod === 'wompi' && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-950 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-blue-600" />
                      <span>Pasarela Oficial Wompi Bancolombia</span>
                    </span>
                    <span className="text-[10px] font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">
                      Seguridad PCI-DSS
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-600 leading-relaxed">
                    Al confirmar, podrás pagar en línea con <strong>Tarjeta de Crédito, Débito, PSE o Botón Bancolombia</strong> con la cuenta directa del fabricante.
                  </p>
                  {getWompiUrl() && (
                    <a
                      href={getWompiUrl()}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 bg-[#00109b] hover:bg-blue-900 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg shadow-sm transition-all active:scale-95"
                    >
                      <span>Abrir Pasarela Wompi en Ventana Segura</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              )}

              {paymentMethod === 'nequi' && (
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-3.5 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-purple-950 flex items-center gap-1.5">
                      <QrCode className="w-4 h-4 text-[#ff007a]" />
                      <span>Nequi Negocios del Fabricante</span>
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyNequi}
                      className="text-[10px] bg-white border border-purple-200 text-purple-900 font-bold px-2 py-0.5 rounded flex items-center gap-1"
                    >
                      {copiedKey ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey ? 'Copiado' : 'Copiar Número'}</span>
                    </button>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-[11px] text-gray-500 font-bold">Número Nequi:</span>
                    <span className="text-base font-black text-[#20002c] font-mono tracking-wider">{nequiNumber}</span>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-600 mb-1">
                      Número de Aprobación / Comprobante Nequi (Opcional):
                    </label>
                    <input
                      type="text"
                      value={transferRef}
                      onChange={(e) => setTransferRef(e.target.value)}
                      placeholder="Ej: M1284902"
                      className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs font-mono outline-none focus:border-sanvi-orange"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'daviplata' && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-red-950">Daviplata del Comerciante</span>
                    <span className="text-[10px] font-mono bg-red-100 text-red-800 px-2 py-0.5 rounded font-bold">
                      {daviplataNumber}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-600">
                    Transfiere el total exacto desde tu App Daviplata al número indicado arriba.
                  </p>
                </div>
              )}

              {paymentMethod === 'contraentrega' && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 space-y-1.5 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-950">
                    <Truck className="w-4 h-4 text-emerald-600" />
                    <span>Pago Contra Entrega en Efectivo o Nequi al recibir</span>
                  </div>
                  <p className="text-[11px] text-emerald-800">
                    Tu pedido será empacado y despachado por el mensajero urbano. Pagas al tener la prenda en tus manos.
                  </p>
                </div>
              )}
            </div>

            {/* BOTONES DE ACCIÓN: COMPRA DIRECTA EN PLATAFORMA */}
            <div className="pt-3 border-t border-gray-200 space-y-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-sanvi-red to-[#FA2C19] hover:from-red-600 hover:to-orange-600 text-white font-black py-3.5 rounded-xl shadow-lg transition-all active:scale-95 text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-5 h-5 text-white" />
                <span>{loading ? 'Procesando Compra en Sanvi...' : `Pagar y Confirmar Pedido • ${formatCOP(totalAmount)}`}</span>
              </button>

              <p className="text-center text-[10px] text-gray-400">
                Al comprar aceptas los Términos de Servicio y la Protección de Compras de San Victorino Oficial.
              </p>
            </div>
          </form>
        ) : (
          /* PANTALLA DE ÉXITO: RECIBO DIGITAL Y SEGUIMIENTO PROFESIONAL */
          <div className="p-6 sm:p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner animate-in zoom-in-75 duration-300">
              <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                ¡Compra Confirmada en Plataforma!
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-gray-950">
                Gracias por tu compra, {customerName}
              </h3>
              <p className="text-xs text-gray-500">
                Tu orden ha sido registrada en el sistema de bodegas de San Victorino.
              </p>
            </div>

            {/* Tarjeta de Recibo Digital */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-left space-y-3 max-w-md mx-auto">
              <div className="flex items-center justify-between border-b border-gray-200 pb-2.5">
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Número de Pedido</p>
                  <p className="text-sm font-black text-gray-900 font-mono">{createdOrder?.order_number || '#SNV-94821'}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Estado</p>
                  <p className="text-xs font-black text-emerald-700 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-emerald-600" />
                    <span>En Preparación</span>
                  </p>
                </div>
              </div>

              <div className="text-xs space-y-1 text-gray-600">
                <p><strong>Destino:</strong> {city} - {address}</p>
                <p><strong>Teléfono:</strong> {customerPhone}</p>
                <p><strong>Método de Pago:</strong> {paymentMethod.toUpperCase()}</p>
                <p className="pt-1 text-base font-black text-gray-950 border-t border-gray-200 flex items-center justify-between">
                  <span>Total Pagado:</span>
                  <span className="text-sanvi-red">{formatCOP(totalAmount)}</span>
                </p>
              </div>
            </div>

            {/* Botones Finales */}
            <div className="space-y-2 max-w-md mx-auto pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full bg-sanvi-orange hover:bg-orange-600 text-white font-black py-3 rounded-xl shadow-md transition-all active:scale-95 text-xs sm:text-sm"
              >
                Seguir Comprando en Sanvi
              </button>

              <button
                type="button"
                onClick={() => {
                  const msg = `Hola, realicé el pedido digital *${createdOrder?.order_number}* en SANVI por valor de *${formatCOP(totalAmount)}* a nombre de *${customerName}* para entrega en *${city}* (${address}).`;
                  window.open(`https://wa.me/${primaryStore.phone_whatsapp || '573105551234'}?text=${encodeURIComponent(msg)}`, '_blank');
                }}
                className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold py-2.5 rounded-xl transition-all text-xs flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Enviar copia del comprobante al WhatsApp del fabricante (Opcional)</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
