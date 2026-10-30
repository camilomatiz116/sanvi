import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  Store,
  ChevronRight,
  User,
  ArrowRight
} from 'lucide-react';
import { api } from '../../services/api';

export default function AuthModal({
  isOpen,
  onClose,
  stores = [],
  onLoginSuccess,
  onLoginCustomer,
  loggedInCustomer,
  initialMode = 'customer'
}) {
  const [mode, setMode] = useState(initialMode); // 'customer' | 'merchant'

  useEffect(() => {
    if (isOpen && initialMode) {
      setMode(initialMode);
    }
  }, [isOpen, initialMode]);

  const [customerAuthMethod, setCustomerAuthMethod] = useState('main'); // 'main' | 'email_form' | 'phone_form'
  const [emailInput, setEmailInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [customerNameInput, setCustomerNameInput] = useState('Camilo Matiz');

  // Estado comerciante
  const [merchantTab, setMerchantTab] = useState('login'); // 'login' | 'register'
  const [merchantEmail, setMerchantEmail] = useState('');
  const [merchantPassword, setMerchantPassword] = useState('');
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

  // 1-Click Login con Google estilo Temu (Camilo Matiz)
  const handleGoogleOneClick = (customName, customEmail) => {
    setLoading(true);
    setTimeout(() => {
      const customer = {
        name: customName || 'Camilo Matiz',
        email: customEmail || 'camilomatiz114@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop',
        city: 'Bogotá, Colombia',
        is_verified_buyer: true,
        login_type: 'Google'
      };
      localStorage.setItem('sanvi_customer', JSON.stringify(customer));
      if (onLoginCustomer) onLoginCustomer(customer);
      setLoading(false);
      onClose();
    }, 350);
  };

  // Login de cliente por correo
  const handleCustomerEmailSubmit = (e) => {
    e.preventDefault();
    if (!emailInput) return;
    handleGoogleOneClick(customerNameInput || 'Cliente Sanvi', emailInput);
  };

  // Login de cliente por teléfono (+57)
  const handleCustomerPhoneSubmit = (e) => {
    e.preventDefault();
    if (!phoneInput) return;
    const phone = phoneInput.startsWith('+57') ? phoneInput : `+57 ${phoneInput}`;
    handleGoogleOneClick(customerNameInput || 'Cliente Sanvi', phone);
  };

  // Login comerciante
  const handleMerchantLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    const found = stores.find(
      (s) => s.email?.toLowerCase() === merchantEmail.toLowerCase() || s.name?.toLowerCase().includes(merchantEmail.toLowerCase())
    );

    setTimeout(() => {
      setLoading(false);
      if (found) {
        onLoginSuccess(found);
      } else if (stores.length > 0) {
        onLoginSuccess(stores[0]);
      }
      onClose();
    }, 300);
  };

  // Registro comerciante
  const handleMerchantRegister = async (e) => {
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
      alert('Error registrando el local');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 border border-gray-100 my-auto">
        
        {/* CABECERA CON SELECTOR DE ROL Y BOTÓN CERRAR */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-2 flex-1 text-xs font-bold text-center">
            <button
              type="button"
              onClick={() => setMode('customer')}
              className={`py-3 px-3 transition-all flex items-center justify-center gap-1.5 ${
                mode === 'customer'
                  ? 'bg-white text-sanvi-orange border-b-2 border-sanvi-orange font-black'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <User className="w-4 h-4 text-sanvi-orange" />
              <span>Soy Comprador</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('merchant')}
              className={`py-3 px-3 transition-all flex items-center justify-center gap-1.5 ${
                mode === 'merchant'
                  ? 'bg-white text-blue-600 border-b-2 border-blue-600 font-black'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Store className="w-4 h-4 text-blue-600" />
              <span>Soy Comerciante (Tengo Local)</span>
            </button>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 p-2.5 mr-1 rounded-full hover:bg-gray-100 transition-colors"
            title="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CABECERA TEMU: TÍTULO + CANDADO VERDE */}
        <div className="text-center px-4 pt-4">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            {mode === 'customer' ? 'Iniciar sesión' : 'Portal de Comerciantes San Victorino'}
          </h2>
          <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-700 font-semibold mt-1">
            <Lock className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
            <span>Todos los datos están protegidos</span>
          </div>
        </div>

        {/* BARRA DE LOS 4 BENEFICIOS VERDES ESTILO TEMU */}
        {mode === 'customer' && (
          <div className="mx-4 sm:mx-8 my-4 p-2.5 bg-emerald-50/50 rounded-xl border border-emerald-100 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            {/* 1. Ajuste de precios */}
            <div className="flex flex-col items-center justify-center text-[10px] sm:text-[11px] leading-tight">
              <div className="flex items-center gap-1 text-emerald-700 font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Ajuste de precios</span>
              </div>
              <span className="text-[10px] text-gray-500 mt-0.5">En un plazo de 30 días</span>
            </div>

            {/* 2. Envío gratis */}
            <div className="flex flex-col items-center justify-center text-[10px] sm:text-[11px] leading-tight border-l border-emerald-100 sm:border-l">
              <div className="flex items-center gap-1 text-emerald-700 font-bold">
                <Truck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Envío gratis</span>
              </div>
              <span className="text-[10px] text-gray-500 mt-0.5">¡Especial para ti!</span>
            </div>

            {/* 3. Devoluciones gratis */}
            <div className="flex flex-col items-center justify-center text-[10px] sm:text-[11px] leading-tight border-t sm:border-t-0 sm:border-l border-emerald-100 pt-1 sm:pt-0">
              <div className="flex items-center gap-1 text-emerald-700 font-bold">
                <RotateCcw className="w-3.5 h-3.5 text-emerald-600" />
                <span>Devoluciones gratis</span>
              </div>
              <span className="text-[10px] text-gray-500 mt-0.5">Hasta 90 días</span>
            </div>

            {/* 4. Entrega garantizada */}
            <div className="flex flex-col items-center justify-center text-[10px] sm:text-[11px] leading-tight border-t sm:border-t-0 border-l border-emerald-100 pt-1 sm:pt-0">
              <div className="flex items-center gap-1 text-emerald-700 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Entrega garantizada</span>
              </div>
              <span className="text-[10px] text-gray-500 mt-0.5">Reembolso sin trabas</span>
            </div>
          </div>
        )}

        {/* CONTENIDO PRINCIPAL: CLIENTE (ESTILO EXACTO TEMU) */}
        {mode === 'customer' && (
          <div className="px-4 sm:px-8 pb-6">
            {customerAuthMethod === 'main' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                
                {/* COLUMNA IZQUIERDA: Cuenta utilizada anteriormente (Camilo Matiz) */}
                <div className="space-y-4 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-gray-700 mb-3 text-center sm:text-left">
                      Inicia sesión con una cuenta utilizada anteriormente
                    </h3>

                    {/* Tarjeta de Usuario Guardada */}
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-200">
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden shrink-0 border border-gray-300">
                        <img
                          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop"
                          alt="Camilo Matiz"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-black text-gray-900 truncate">Camilo Matiz</p>
                        <p className="text-xs text-gray-500 font-medium truncate">cam***114@gmail.com</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {/* Botón Google 1-Click Temu */}
                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => handleGoogleOneClick('Camilo Matiz', 'camilomatiz114@gmail.com')}
                      className="w-full py-2.5 px-4 bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-800 text-xs font-bold rounded-full border border-gray-300 shadow-sm flex items-center justify-center gap-2 transition-all"
                    >
                      {/* Logo multicolor Google */}
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                      <span>Continuar con Google</span>
                    </button>

                    {/* Botón otra forma */}
                    <button
                      type="button"
                      onClick={() => setCustomerAuthMethod('email_form')}
                      className="w-full py-2.5 px-4 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-full border border-gray-300 transition-all text-center"
                    >
                      Utiliza otra forma de iniciar sesión
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
                    <button
                      type="button"
                      onClick={() => alert('Para eliminar tu cuenta de Sanvi contacta a soporte@sanvi.com.co')}
                      className="hover:underline"
                    >
                      Eliminar cuenta
                    </button>
                    <span>|</span>
                    <button
                      type="button"
                      onClick={() => alert('Recupera el acceso ingresando tu correo registrado.')}
                      className="hover:underline"
                    >
                      ¿Problemas al iniciar sesión?
                    </button>
                  </div>
                </div>

                {/* DIVISOR CENTRAL CON CÍRCULO "o" */}
                <div className="hidden md:flex flex-col items-center justify-center absolute left-1/2 top-4 bottom-4 -translate-x-1/2">
                  <div className="w-[1px] bg-gray-200 flex-1" />
                  <div className="w-5 h-5 rounded-full border border-gray-200 bg-white flex items-center justify-center text-[10px] text-gray-400 font-bold my-2 shadow-sm">
                    o
                  </div>
                  <div className="w-[1px] bg-gray-200 flex-1" />
                </div>

                {/* COLUMNA DERECHA: Regístrate / inicia sesión con otra cuenta */}
                <div className="space-y-3 flex flex-col justify-between md:pl-4">
                  <h3 className="text-xs font-bold text-gray-700 mb-1 text-center sm:text-left">
                    Regístrate/inicia sesión con otra cuenta
                  </h3>

                  <div className="space-y-2">
                    {/* Continuar con Email */}
                    <button
                      type="button"
                      onClick={() => setCustomerAuthMethod('email_form')}
                      className="w-full py-2.5 px-4 bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-800 text-xs font-semibold rounded-full border border-gray-300 shadow-sm flex items-center justify-center gap-2.5 transition-all"
                    >
                      <Mail className="w-4 h-4 text-gray-600" />
                      <span>Continuar con Email</span>
                    </button>

                    {/* Continuar con Número de teléfono */}
                    <button
                      type="button"
                      onClick={() => setCustomerAuthMethod('phone_form')}
                      className="w-full py-2.5 px-4 bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-800 text-xs font-semibold rounded-full border border-gray-300 shadow-sm flex items-center justify-center gap-2.5 transition-all"
                    >
                      <Phone className="w-4 h-4 text-gray-600" />
                      <span>Continuar con Número de teléfono</span>
                    </button>

                    {/* Continuar con Google genérico */}
                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => handleGoogleOneClick('Usuario Google', 'usuario.nuevo@gmail.com')}
                      className="w-full py-2.5 px-4 bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-800 text-xs font-semibold rounded-full border border-gray-300 shadow-sm flex items-center justify-center gap-2.5 transition-all"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                      <span>Continuar con Google</span>
                    </button>

                    {/* Continuar con Facebook */}
                    <button
                      type="button"
                      onClick={() => handleGoogleOneClick('Usuario Facebook', 'cliente.facebook@sanvi.com.co')}
                      className="w-full py-2.5 px-4 bg-white hover:bg-gray-50 text-gray-800 text-xs font-semibold rounded-full border border-gray-300 shadow-sm flex items-center justify-center gap-2.5 transition-all"
                    >
                      <svg className="w-4 h-4 text-[#1877F2] fill-[#1877F2]" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      <span>Continuar con Facebook</span>
                    </button>

                    {/* Continuar con Apple */}
                    <button
                      type="button"
                      onClick={() => handleGoogleOneClick('Usuario Apple', 'cliente.apple@icloud.com')}
                      className="w-full py-2.5 px-4 bg-white hover:bg-gray-50 text-gray-800 text-xs font-semibold rounded-full border border-gray-300 shadow-sm flex items-center justify-center gap-2.5 transition-all"
                    >
                      <svg className="w-4 h-4 fill-black" viewBox="0 0 24 24">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.89c.65-.8 1.09-1.91.97-3.03-.94.04-2.08.63-2.75 1.42-.59.69-1.11 1.82-.97 2.91 1.05.08 2.1-.5 2.75-1.3" />
                      </svg>
                      <span>Continuar con Apple</span>
                    </button>
                  </div>
                </div>

              </div>
            ) : customerAuthMethod === 'email_form' ? (
              /* FORMULARIO DE INGRESO CON EMAIL */
              <form onSubmit={handleCustomerEmailSubmit} className="max-w-md mx-auto space-y-4 py-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Tu Nombre Completo</label>
                  <input
                    type="text"
                    required
                    value={customerNameInput}
                    onChange={(e) => setCustomerNameInput(e.target.value)}
                    placeholder="ej: Camilo Matiz"
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-sanvi-orange"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Correo Electrónico</label>
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="ej: camilo@gmail.com"
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-sanvi-orange"
                  />
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setCustomerAuthMethod('main')}
                    className="flex-1 py-2.5 border border-gray-300 text-xs font-bold rounded-xl text-gray-700 hover:bg-gray-50"
                  >
                    Volver
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-sanvi-orange hover:bg-orange-600 text-white text-xs font-black rounded-xl shadow-md"
                  >
                    Ingresar con Email
                  </button>
                </div>
              </form>
            ) : (
              /* FORMULARIO DE INGRESO CON NÚMERO DE TELÉFONO */
              <form onSubmit={handleCustomerPhoneSubmit} className="max-w-md mx-auto space-y-4 py-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Tu Nombre Completo</label>
                  <input
                    type="text"
                    required
                    value={customerNameInput}
                    onChange={(e) => setCustomerNameInput(e.target.value)}
                    placeholder="ej: Camilo Matiz"
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-sanvi-orange"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Número de Celular (Colombia +57)</label>
                  <div className="flex gap-2">
                    <span className="bg-gray-100 border border-gray-300 text-xs font-bold text-gray-700 px-3 py-2.5 rounded-xl flex items-center">
                      🇨🇴 +57
                    </span>
                    <input
                      type="tel"
                      required
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      placeholder="310 123 4567"
                      className="flex-1 bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-sanvi-orange"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setCustomerAuthMethod('main')}
                    className="flex-1 py-2.5 border border-gray-300 text-xs font-bold rounded-xl text-gray-700 hover:bg-gray-50"
                  >
                    Volver
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-sanvi-orange hover:bg-orange-600 text-white text-xs font-black rounded-xl shadow-md"
                  >
                    Ingresar con Celular
                  </button>
                </div>
              </form>
            )}

            {/* TEXTOS LEGALES PIE DE PÁGINA (TAL CUAL TEMU) */}
            <p className="text-[10px] text-gray-500 leading-relaxed text-center mt-6 pt-4 border-t border-gray-100">
              Al iniciar sesión o continuar, aceptas nuestros{' '}
              <span className="text-gray-900 font-bold underline cursor-pointer">Términos de uso</span>{' '}
              y autorizas el procesamiento de tus datos personales de acuerdo con la{' '}
              <span className="text-gray-900 font-bold underline cursor-pointer">Política de privacidad</span>.
              Para obtener más detalles sobre los propósitos y los métodos de procesamiento de datos, tus derechos y cómo ejercerlos, visita nuestra{' '}
              <span className="text-gray-900 font-bold underline cursor-pointer">Política de privacidad</span>.
            </p>

            {/* ENLACE PARA COMERCIANTES CON LOCAL */}
            <div className="mt-4 pt-3 text-center border-t border-gray-100">
              <button
                type="button"
                onClick={() => setMode('merchant')}
                className="text-xs font-bold text-sanvi-orange hover:text-orange-700 inline-flex items-center gap-1.5"
              >
                <Store className="w-4 h-4" />
                <span>¿Tienes un local en San Victorino? Entra a tu Seller Center aquí</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* MODO 2: PORTAL DE COMERCIANTES CON LOCAL */}
        {mode === 'merchant' && (
          <div>
            <div className="grid grid-cols-2 border-b border-gray-200 bg-gray-50 text-xs font-bold text-center">
              <button
                onClick={() => setMerchantTab('login')}
                className={`py-3 transition-colors ${
                  merchantTab === 'login'
                    ? 'bg-white text-sanvi-orange border-b-2 border-sanvi-orange font-black'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Entrar a Mi Panel de Negocio
              </button>
              <button
                onClick={() => setMerchantTab('register')}
                className={`py-3 transition-colors ${
                  merchantTab === 'register'
                    ? 'bg-white text-sanvi-orange border-b-2 border-sanvi-orange font-black'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Registrar Nuevo Local ($120k/mes)
              </button>
            </div>

            {merchantTab === 'login' ? (
              <div className="p-5 space-y-4">
                <form onSubmit={handleMerchantLogin} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Correo de tu Negocio o Nombre</label>
                    <input
                      type="text"
                      placeholder="ej: donlucho@sanvi.com.co o Confecciones Don Lucho"
                      value={merchantEmail}
                      onChange={(e) => setMerchantEmail(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs outline-none focus:border-sanvi-orange"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Contraseña</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={merchantPassword}
                      onChange={(e) => setMerchantPassword(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs outline-none focus:border-sanvi-orange"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-sanvi-orange hover:bg-orange-600 text-white font-black py-2.5 rounded-xl shadow-md transition-all text-xs"
                  >
                    Iniciar Sesión en el Negocio
                  </button>
                </form>

                {/* Acceso Rápido Demo a Locales */}
                {stores.length > 0 && (
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-[11px] font-bold text-gray-500 mb-2">Locales de San Victorino activos:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {stores.slice(0, 4).map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => {
                            onLoginSuccess(s);
                            onClose();
                          }}
                          className="text-left p-2 rounded-xl bg-gray-50 hover:bg-orange-50 border border-gray-200 hover:border-sanvi-orange transition-all text-xs"
                        >
                          <p className="font-black text-gray-900 truncate">{s.name}</p>
                          <p className="text-[10px] text-gray-500 truncate">{s.commercial_center} ({s.local_number})</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => setMode('customer')}
                    className="text-xs font-bold text-gray-500 hover:text-gray-900"
                  >
                    ← Volver a inicio de sesión de Compradores
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-5">
                <form onSubmit={handleMerchantRegister} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Nombre Comercial del Local</label>
                    <input
                      type="text"
                      required
                      placeholder="ej: Confecciones Don Lucho Denim"
                      value={regForm.name}
                      onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Centro Comercial</label>
                      <input
                        type="text"
                        required
                        placeholder="ej: El Gran San"
                        value={regForm.commercial_center}
                        onChange={(e) => setRegForm({ ...regForm, commercial_center: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Número de Local</label>
                      <input
                        type="text"
                        required
                        placeholder="Local 142 Piso 1"
                        value={regForm.local_number}
                        onChange={(e) => setRegForm({ ...regForm, local_number: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">WhatsApp de Pedidos</label>
                    <input
                      type="text"
                      required
                      placeholder="573102345678"
                      value={regForm.phone_whatsapp}
                      onChange={(e) => setRegForm({ ...regForm, phone_whatsapp: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Correo Electrónico</label>
                    <input
                      type="email"
                      required
                      placeholder="contacto@mimodasanvi.com"
                      value={regForm.email}
                      onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2.5 rounded-xl shadow-md text-xs transition-all"
                  >
                    Activar Tienda en Sanvi ($120.000 COP/mes)
                  </button>
                </form>

                <div className="pt-3 text-center">
                  <button
                    type="button"
                    onClick={() => setMode('customer')}
                    className="text-xs font-bold text-gray-500 hover:text-gray-900"
                  >
                    ← Volver a inicio de sesión de Compradores
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
