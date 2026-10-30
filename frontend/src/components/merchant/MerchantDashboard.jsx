import React, { useState, useEffect } from 'react';
import { X, Store, TrendingUp, MessageCircle, Eye, Plus, ShieldCheck, CreditCard, CheckCircle2, Key, Copy, Check } from 'lucide-react';
import { api } from '../../services/api';

const DEMO_VENDORS = [
  {
    id: 'store-001',
    name: 'Confecciones Don Lucho Denim',
    category: 'Moda & Confección',
    owner: 'Luis Fernando Gómez (Don Lucho)',
    center: 'El Gran San',
    local: 'Local 142 - Piso 1',
    email: 'donlucho@sanvi.com.co',
    password: 'Sanvi2026*Lucho',
    phone: '573102345678'
  },
  {
    id: 'store-006',
    name: 'TecnoMayoristas San Victorino',
    category: 'Tecnología & Celulares',
    owner: 'Andrés Felipe Téllez',
    center: 'Plaza San Victorino',
    local: 'Local 38 - Pasaje Tecnológico',
    email: 'tecnosanvi@sanvi.com.co',
    password: 'Sanvi2026*Tecno',
    phone: '573118901234'
  },
  {
    id: 'store-007',
    name: 'Mundo Juguetes & Piñatería Sanvi',
    category: 'Juguetería & Niños',
    owner: 'Gloria Esperanza Rincón',
    center: 'Calle 11 Mayorista',
    local: 'Bodega 12 - Frente a Parque',
    email: 'juguetes@sanvi.com.co',
    password: 'Sanvi2026*Juguetes',
    phone: '573134567890'
  },
  {
    id: 'store-008',
    name: 'Cosméticos & Belleza Glam Bogotá',
    category: 'Belleza & Cuidado Personal',
    owner: 'Diana Carolina Prada',
    center: 'Neos Centro',
    local: 'Local 412 - Piso Belleza',
    email: 'glam@sanvi.com.co',
    password: 'Sanvi2026*Glam',
    phone: '573167890123'
  },
  {
    id: 'store-009',
    name: 'Hogar, Novedades & Cacharrería El Triunfo',
    category: 'Hogar & Cocina',
    owner: 'Nelson Ricardo Castro',
    center: 'Centro Mayorista Visto',
    local: 'Local 204 - Nivel Hogar',
    email: 'hogarsanvi@sanvi.com.co',
    password: 'Sanvi2026*Hogar',
    phone: '573145678901'
  },
  {
    id: 'store-010',
    name: 'Morrales & Maletas Élite San Victorino',
    category: 'Morrales & Maletas',
    owner: 'Yamile Sánchez',
    center: 'El Trébol',
    local: 'Local 118 - Piso 1',
    email: 'maletasanvi@sanvi.com.co',
    password: 'Sanvi2026*Maletas',
    phone: '573178901234'
  },
  {
    id: 'store-002',
    name: 'Urban Street Neos Bogotá',
    category: 'Moda Streetwear',
    owner: 'Camila Andrea Restrepo',
    center: 'Neos Centro',
    local: 'Local 205 - Pasillo Juvenil',
    email: 'urbanneos@sanvi.com.co',
    password: 'Sanvi2026*Neos',
    phone: '573209876543'
  },
  {
    id: 'store-005',
    name: 'Calzado & Cuero Pasaje Rivas',
    category: 'Calzado & Cuero',
    owner: 'William Eduardo Moreno',
    center: 'Pasaje Rivas',
    local: 'Local 45 - Entrada Décima',
    email: 'cuerorivas@sanvi.com.co',
    password: 'Sanvi2026*Rivas',
    phone: '573004443322'
  }
];

export default function MerchantDashboard({
  isOpen,
  onClose,
  onOpenCreateProduct
}) {
  const [selectedVendor, setSelectedVendor] = useState(DEMO_VENDORS[0]);
  const [metrics, setMetrics] = useState({
    total_views: 4620,
    total_whatsapp_leads: 304,
    leads_mayor: 112,
    leads_detal: 192,
    estimated_sales_pipeline_cop: '18.400.000 COP'
  });

  const [membership, setMembership] = useState({
    status: 'ACTIVE',
    amount: 120000,
    next_billing_date: '2026-11-28',
    payment_method: 'NEQUI'
  });

  const [renewing, setRenewing] = useState(false);
  const [renewalSuccess, setRenewalSuccess] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);

  useEffect(() => {
    if (isOpen && selectedVendor) {
      api.getStoreMetrics(selectedVendor.id).then(setMetrics).catch(() => {});
      api.getStoreMembership(selectedVendor.id).then(setMembership).catch(() => {});
    }
  }, [isOpen, selectedVendor]);

  if (!isOpen) return null;

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRenewMembership = async () => {
    setRenewing(true);
    try {
      await api.payMembership({
        store_id: selectedVendor.id,
        payment_method: 'NEQUI_COLOMBIA'
      });
      setRenewalSuccess(true);
      setTimeout(() => {
        setRenewalSuccess(false);
        setRenewing(false);
      }, 2000);
    } catch (e) {
      setRenewing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Cabecera del Panel */}
        <div className="bg-gray-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sanvi-orange flex items-center justify-center font-black text-white text-lg">
              SV
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black flex items-center gap-2">
                Panel de Comerciante
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  San Victorino
                </span>
              </h3>
              <p className="text-xs text-gray-400">
                Selecciona uno de los 5 locales creados para ver sus métricas y credenciales
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-5">
          {/* Selector de Vendedor Falso */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 space-y-2">
            <label className="block text-xs font-black text-gray-700 uppercase tracking-wide">
              🏢 Cambiar Local Comercial Activo:
            </label>
            <select
              value={selectedVendor.id}
              onChange={(e) => {
                const found = DEMO_VENDORS.find(v => v.id === e.target.value);
                if (found) setSelectedVendor(found);
              }}
              className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs sm:text-sm font-bold text-gray-800 outline-none focus:border-sanvi-orange"
            >
              {DEMO_VENDORS.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.center} - {v.local})
                </option>
              ))}
            </select>
          </div>

          {/* Tarjeta de Credenciales de Acceso */}
          <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-blue-900 flex items-center gap-1.5 uppercase tracking-wide">
                <Key className="w-4 h-4 text-blue-600" />
                Credenciales de Acceso para este Local
              </span>
              <span className="text-[10px] bg-blue-200 text-blue-900 font-bold px-2 py-0.5 rounded-full">
                Listo para Pruebas
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="bg-white p-2.5 rounded-xl border border-blue-100 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-gray-400 font-bold">USUARIO / EMAIL:</div>
                  <div className="font-mono font-bold text-gray-800">{selectedVendor.email}</div>
                </div>
                <button
                  onClick={() => handleCopy(selectedVendor.email, 'email')}
                  className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                  title="Copiar correo"
                >
                  {copiedKey === 'email' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-blue-100 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-gray-400 font-bold">CONTRASEÑA:</div>
                  <div className="font-mono font-bold text-gray-800">{selectedVendor.password}</div>
                </div>
                <button
                  onClick={() => handleCopy(selectedVendor.password, 'pwd')}
                  className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                  title="Copiar contraseña"
                >
                  {copiedKey === 'pwd' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="text-[11px] text-blue-800 flex items-center gap-2">
              <span>👤 <strong>Titular:</strong> {selectedVendor.owner}</span>
              <span>•</span>
              <span>📍 <strong>Ubicación:</strong> {selectedVendor.center} ({selectedVendor.local})</span>
            </div>
          </div>

          {/* Tarjeta de Membresía Sanvi ($120.000 COP) */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-sanvi-orange" />
                <span className="font-black text-gray-900 text-sm">
                  Membresía: $120.000 COP / mes
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                  Al Día (0% Comisiones)
                </span>
              </div>
              <p className="text-xs text-gray-600">
                Próximo corte: <strong>{membership.next_billing_date}</strong>. Todas tus ventas van 100% a tu bolsillo.
              </p>
            </div>

            <button
              onClick={handleRenewMembership}
              disabled={renewing}
              className="bg-gray-900 hover:bg-black text-white text-xs font-black px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all active:scale-95 shadow shrink-0"
            >
              {renewalSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>¡Renovada!</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 text-yellow-400" />
                  <span>{renewing ? 'Procesando...' : 'Pagar Membresía'}</span>
                </>
              )}
            </button>
          </div>

          {/* Métricas clave de rendimiento */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-gray-500">
                Rendimiento de {selectedVendor.name}
              </h4>
              <span className="text-[11px] font-bold text-sanvi-orange">En tiempo real</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 space-y-1">
                <div className="flex items-center justify-between text-gray-500">
                  <span className="text-[11px] font-semibold">Clientes WhatsApp</span>
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-emerald-700">
                  {metrics.total_whatsapp_leads}
                </div>
                <span className="text-[10px] text-gray-400">Cotizaciones directas</span>
              </div>

              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 space-y-1">
                <div className="flex items-center justify-between text-gray-500">
                  <span className="text-[11px] font-semibold">Mayoristas B2B</span>
                  <TrendingUp className="w-4 h-4 text-sanvi-orange" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-amber-700">
                  {metrics.leads_mayor}
                </div>
                <span className="text-[10px] text-gray-400">Pedidos por docena</span>
              </div>

              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 space-y-1">
                <div className="flex items-center justify-between text-gray-500">
                  <span className="text-[11px] font-semibold">Vistas del Local</span>
                  <Eye className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-gray-900">
                  {metrics.total_views}
                </div>
                <span className="text-[10px] text-gray-400">En feed y búsquedas</span>
              </div>

              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 space-y-1">
                <div className="flex items-center justify-between text-gray-500">
                  <span className="text-[11px] font-semibold">Ventas Estimadas</span>
                  <span className="text-xs font-bold text-emerald-600">COP</span>
                </div>
                <div className="text-sm sm:text-base font-black text-gray-900 truncate">
                  {metrics.estimated_sales_pipeline_cop || '$20.8M'}
                </div>
                <span className="text-[10px] text-emerald-600 font-bold">173x Retorno</span>
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="pt-2">
            <button
              onClick={() => {
                onClose();
                onOpenCreateProduct();
              }}
              className="w-full bg-sanvi-orange hover:bg-orange-600 text-white font-black py-3 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 text-xs sm:text-sm"
            >
              <Plus className="w-4 h-4" />
              Publicar Nueva Prenda para {selectedVendor.name}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
