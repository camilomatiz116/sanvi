import React, { useState } from 'react';
import { X, Store, Lock, Mail, ArrowRight, ShieldCheck, Key } from 'lucide-react';
import { api } from '../../services/api';

export default function AuthModal({
  isOpen,
  onClose,
  stores,
  onLoginSuccess
}) {
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Formulario de registro de negocio
  const [regForm, setRegForm] = useState({
    name: '',
    commercial_center: 'El Gran San',
    local_number: '',
    phone_whatsapp: '',
    email: '',
    password: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    // Buscar si coincide con alguna de las tiendas
    const found = stores.find(
      (s) => s.email?.toLowerCase() === email.toLowerCase() || s.name?.toLowerCase().includes(email.toLowerCase())
    );

    setTimeout(() => {
      setLoading(false);
      if (found) {
        onLoginSuccess(found);
        onClose();
      } else {
        // Si no coincide con ninguno exacto, asignamos la primera tienda o creamos sesión
        onLoginSuccess(stores[0]);
        onClose();
      }
    }, 400);
  };

  const handleQuickDemoLogin = (store) => {
    onLoginSuccess(store);
    onClose();
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!regForm.name || !regForm.email || !regForm.phone_whatsapp) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    setLoading(true);
    try {
      const res = await api.registerStore(regForm);
      onLoginSuccess(res.store);
      onClose();
    } catch (err) {
      alert('Error registrando tu tienda');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Cabecera del Modal */}
        <div className="bg-gray-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-sanvi-orange" />
            <div>
              <h3 className="text-base font-black">Portal de Comerciantes Sanvi</h3>
              <p className="text-[11px] text-gray-400">Ingresa a tu negocio o afilia tu local</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Pestañas Iniciar Sesión / Registrar Local */}
        <div className="grid grid-cols-2 border-b border-gray-200 bg-gray-50 text-xs font-bold text-center">
          <button
            onClick={() => setTab('login')}
            className={`py-3 transition-colors ${
              tab === 'login'
                ? 'bg-white text-sanvi-orange border-b-2 border-sanvi-orange font-black'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Entrar a Mi Panel
          </button>
          <button
            onClick={() => setTab('register')}
            className={`py-3 transition-colors ${
              tab === 'register'
                ? 'bg-white text-sanvi-orange border-b-2 border-sanvi-orange font-black'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Registrar Nuevo Local ($120k)
          </button>
        </div>

        {tab === 'login' ? (
          <div className="p-4 sm:p-5 space-y-4">
            {/* Formulario de Login */}
            <form onSubmit={handleLogin} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Correo de tu Negocio</label>
                <div className="relative">
                  <input
                    required
                    type="email"
                    placeholder="ej: donlucho@sanvi.com.co"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-9 pr-3 py-2 text-xs outline-none focus:border-sanvi-orange"
                  />
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Contraseña</label>
                <div className="relative">
                  <input
                    required
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-9 pr-3 py-2 text-xs outline-none focus:border-sanvi-orange"
                  />
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-sanvi-orange hover:bg-orange-600 text-white font-black py-2.5 rounded-xl transition-all shadow text-xs sm:text-sm flex items-center justify-center gap-1.5 active:scale-95"
              >
                <span>{loading ? 'Accediendo...' : 'Entrar a Mi Panel'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Accesos Rápidos de Prueba (1 Clic) */}
            <div className="pt-2 border-t border-gray-100">
              <span className="text-[11px] font-black uppercase text-gray-400 tracking-wider flex items-center gap-1 mb-2">
                <Key className="w-3.5 h-3.5 text-blue-600" />
                O entra con 1 clic a los negocios de prueba:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {stores.slice(0, 6).map((st) => (
                  <button
                    key={st.id}
                    onClick={() => handleQuickDemoLogin(st)}
                    className="text-left bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 p-2 rounded-xl transition-colors text-[11px] group"
                  >
                    <div className="font-bold text-gray-800 group-hover:text-blue-900 truncate">
                      {st.name}
                    </div>
                    <div className="text-[10px] text-gray-500 truncate">
                      📍 {st.commercial_center}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="p-4 sm:p-5 space-y-3 text-xs sm:text-sm">
            <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-xs flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-sanvi-orange shrink-0 mt-0.5" />
              <p className="text-amber-900">
                <strong>Membresía $120.000 COP/mes:</strong> Tu propio espacio en la plataforma, catálogo ilimitado y 0% comisiones por venta.
              </p>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Nombre Comercial de la Marca / Local *</label>
              <input
                required
                type="text"
                placeholder="Ej: Distribuidora El Diamante"
                value={regForm.name}
                onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs outline-none focus:border-sanvi-orange"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Centro Comercial / Galería</label>
                <select
                  value={regForm.commercial_center}
                  onChange={(e) => setRegForm({ ...regForm, commercial_center: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-sanvi-orange"
                >
                  <option value="El Gran San">El Gran San</option>
                  <option value="Plaza San Victorino">Plaza San Victorino</option>
                  <option value="Neos Centro">Neos Centro</option>
                  <option value="Centro Mayorista Visto">Centro Mayorista Visto</option>
                  <option value="El Trébol">C.C. El Trébol</option>
                  <option value="Calle 11 Mayorista">Calle 11 Mayorista</option>
                  <option value="Pasaje Rivas">Pasaje Rivas</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Número de Local *</label>
                <input
                  required
                  type="text"
                  placeholder="Ej: Local 204 - Piso 2"
                  value={regForm.local_number}
                  onChange={(e) => setRegForm({ ...regForm, local_number: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs outline-none focus:border-sanvi-orange"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">WhatsApp de Ventas *</label>
                <input
                  required
                  type="tel"
                  placeholder="3123456789"
                  value={regForm.phone_whatsapp}
                  onChange={(e) => setRegForm({ ...regForm, phone_whatsapp: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs outline-none focus:border-sanvi-orange"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Correo de Acceso *</label>
                <input
                  required
                  type="email"
                  placeholder="contacto@milocal.com"
                  value={regForm.email}
                  onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs outline-none focus:border-sanvi-orange"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Contraseña de Acceso</label>
              <input
                required
                type="password"
                placeholder="Crea una contraseña segura"
                value={regForm.password}
                onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs outline-none focus:border-sanvi-orange"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sanvi-orange hover:bg-orange-600 text-white font-black py-3 rounded-xl transition-all shadow active:scale-95 text-xs sm:text-sm mt-2"
            >
              {loading ? 'Creando negocio...' : 'Registrar Mi Negocio y Entrar a Mi Panel'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

