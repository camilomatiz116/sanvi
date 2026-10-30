import React, { useState } from 'react';
import { X, Store, CheckCircle, ShieldCheck, Sparkles } from 'lucide-react';
import { api } from '../../services/api';

export default function RegisterStoreModal({ isOpen, onClose, onStoreCreated }) {
  const [formData, setFormData] = useState({
    name: '',
    owner_name: '',
    email: '',
    commercial_center: 'El Gran San',
    local_number: '',
    phone_whatsapp: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.registerStore(formData);
      setSuccessMessage('¡Tu local ha sido registrado exitosamente en Sanvi!');
      setTimeout(() => {
        if (onStoreCreated) onStoreCreated(res.store);
        onClose();
        setSuccessMessage(null);
      }, 1500);
    } catch (error) {
      alert('Error registrando el local. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Cabecera */}
        <div className="bg-gradient-to-r from-sanvi-orange to-amber-600 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Store className="w-6 h-6 text-yellow-300" />
            <div>
              <h3 className="text-base sm:text-lg font-black">Afiliar Mi Local a Sanvi</h3>
              <p className="text-xs text-orange-100 font-medium">Llega a compradores de todo Colombia</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Tarjeta de Membresía Fija ($120.000 COP) */}
        <div className="bg-amber-50 border-b border-amber-200 p-3.5 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs space-y-0.5">
            <div className="font-black text-amber-900 flex items-center gap-1.5">
              <span>Membresía Fija: $120.000 COP / mes</span>
              <span className="bg-emerald-600 text-white text-[10px] px-1.5 py-0.2 rounded font-bold">0% Comisiones</span>
            </div>
            <p className="text-amber-800">
              A diferencia de MercadoLibre o Temu, aquí **no te quitamos porcentaje de tus ventas**. El 100% de la ganancia es tuya y los clientes te pagan directo a tu cuenta o en tu local.
            </p>
          </div>
        </div>

        {successMessage ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
            <h4 className="text-lg font-black text-gray-900">{successMessage}</h4>
            <p className="text-xs text-gray-500">Tu tienda ya está lista para publicar prendas.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3 text-xs sm:text-sm">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Nombre Comercial de la Marca / Local *</label>
              <input
                required
                type="text"
                placeholder="Ej: Confecciones El Samuray Denim"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 outline-none focus:border-sanvi-orange text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Centro Comercial / Galería *</label>
                <select
                  value={formData.commercial_center}
                  onChange={(e) => setFormData({ ...formData, commercial_center: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 outline-none focus:border-sanvi-orange text-xs font-semibold"
                >
                  <option value="El Gran San">El Gran San</option>
                  <option value="Neos Centro">Neos Centro</option>
                  <option value="Centro Mayorista Visto">Centro Mayorista Visto</option>
                  <option value="El Trébol">C.C. El Trébol</option>
                  <option value="Pasaje Rivas">Pasaje Rivas</option>
                  <option value="Calle 10">Local sobre Calle 10</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Número de Local *</label>
                <input
                  required
                  type="text"
                  placeholder="Ej: Local 214 - Piso 2"
                  value={formData.local_number}
                  onChange={(e) => setFormData({ ...formData, local_number: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 outline-none focus:border-sanvi-orange text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">WhatsApp de Ventas *</label>
                <input
                  required
                  type="tel"
                  placeholder="Ej: 3123456789"
                  value={formData.phone_whatsapp}
                  onChange={(e) => setFormData({ ...formData, phone_whatsapp: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 outline-none focus:border-sanvi-orange text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Nombre del Responsable</label>
                <input
                  type="text"
                  placeholder="Ej: Carlos Mendoza"
                  value={formData.owner_name}
                  onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 outline-none focus:border-sanvi-orange text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Correo Electrónico *</label>
              <input
                required
                type="email"
                placeholder="contacto@tumarcacolombiana.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 outline-none focus:border-sanvi-orange text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sanvi-orange hover:bg-orange-600 text-white font-black py-3 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 mt-2 text-xs sm:text-sm"
            >
              {loading ? 'Activando local...' : 'Activar Mi Local en Sanvi'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

