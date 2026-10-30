import React from 'react';
import { Search, ShoppingBag, Store, Sparkles, LogIn, ExternalLink, LogOut, User, CheckCircle2 } from 'lucide-react';

export default function Header({
  searchTerm,
  setSearchTerm,
  cartCount,
  onOpenCart,
  onGoHome,
  loggedInStore,
  loggedInCustomer,
  onOpenAuthModal,
  onOpenMerchantPortal,
  onViewStore,
  onLogout,
  onLogoutCustomer
}) {
  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-100">
      {/* Barra superior estilo Temu de beneficios locales */}
      <div className="bg-gradient-to-r from-sanvi-orange to-sanvi-red text-white text-xs font-semibold px-4 py-1.5 flex items-center justify-between overflow-x-auto whitespace-nowrap gap-4">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          ⚡ Madrugón Virtual San Victorino en Vivo
        </span>
        <span className="hidden md:inline">🚚 Entregas el mismo día en Bogotá | Envíos a todo Colombia</span>
        <span className="bg-white/20 px-2 py-0.5 rounded text-[11px] font-bold">
          🇨🇴 Confección Nacional & Bazar Mayorista
        </span>
      </div>

      {/* Navegación principal */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Logo SANVI (Click lleva al inicio) */}
        <div onClick={onGoHome} className="flex items-center gap-1.5 cursor-pointer select-none">
          <div className="bg-sanvi-orange text-white font-black text-2xl tracking-tighter px-2.5 py-0.5 rounded-lg shadow-sm flex items-center">
            SANVI
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-sanvi-red border border-sanvi-red/30 px-1 py-0.5 rounded hidden sm:inline-block">
            Bogotá
          </span>
        </div>

        {/* Buscador inteligente */}
        <div className="flex-1 max-w-2xl relative">
          <input
            type="text"
            placeholder="Buscar en todo San Victorino: jeans, smartwatches, juguetes, bolsos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-100 border-2 border-sanvi-orange/40 focus:border-sanvi-orange text-sm rounded-full pl-10 pr-24 py-2 outline-none transition-all placeholder-gray-400 font-medium"
          />
          <Search className="w-4 h-4 text-sanvi-orange absolute left-3.5 top-1/2 -translate-y-1/2" />
          <button className="absolute right-1 top-1/2 -translate-y-1/2 bg-sanvi-orange hover:bg-orange-600 text-white text-xs font-bold px-4 py-1.5 rounded-full transition-colors">
            Buscar
          </button>
        </div>

        {/* Acciones principales */}
        <div className="flex items-center gap-2">
          
          {/* CUENTA CLIENTE / INICIAR SESIÓN (TAL CUAL TEMU) */}
          {loggedInCustomer ? (
            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 pl-1.5 pr-2 py-1 rounded-full text-xs">
              <div className="w-6 h-6 rounded-full overflow-hidden border border-gray-300 shrink-0">
                <img
                  src={loggedInCustomer.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop'}
                  alt={loggedInCustomer.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left hidden sm:block leading-tight">
                <p className="text-[11px] font-black text-gray-800 truncate max-w-[90px]">
                  {loggedInCustomer.name?.split(' ')[0]}
                </p>
                <p className="text-[9px] text-emerald-700 font-bold">Compra Segura</p>
              </div>
              <button
                type="button"
                onClick={onLogoutCustomer}
                className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                title="Cerrar sesión de comprador"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenAuthModal}
              className="flex items-center gap-1.5 text-xs font-bold text-gray-800 hover:text-sanvi-orange bg-gray-50 hover:bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-full transition-all"
              title="Iniciar sesión en Sanvi"
            >
              <User className="w-4 h-4 text-gray-600" />
              <div className="text-left hidden sm:block leading-tight">
                <span className="text-[10px] text-gray-400 block -mb-0.5">Iniciar sesión</span>
                <span className="text-[11px] font-bold">Pedidos y Cuenta</span>
              </div>
            </button>
          )}

          {/* ACCESO AL LOCAL / VENDEDOR (SELLER CENTER SAN VICTORINO) */}
          {loggedInStore ? (
            /* Estado de Comerciante Autenticado */
            <div className="flex items-center gap-1">
              <button
                onClick={onOpenMerchantPortal}
                className="bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-xs font-black px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
                title="Abrir el panel de administración de tu tienda"
              >
                <Store className="w-3.5 h-3.5 text-blue-600" />
                <span className="hidden md:inline truncate max-w-[120px]">{loggedInStore.name}</span>
                <span className="md:hidden">Mi Local</span>
              </button>

              <button
                onClick={() => onViewStore(loggedInStore)}
                className="hidden xl:flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold px-2 py-1.5 rounded-xl transition-colors"
                title="Ver tu tienda pública tal como la ven los clientes"
              >
                <span>Mi Tienda</span>
                <ExternalLink className="w-3 h-3 text-gray-500" />
              </button>

              <button
                onClick={onLogout}
                className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg transition-colors"
                title="Cerrar sesión del negocio"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            /* Estado Visitante (Botón para Registrar o Iniciar Sesión de Negocio) */
            <button
              onClick={onOpenAuthModal}
              className="hidden lg:flex items-center gap-1.5 text-xs font-black bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 px-3 py-1.5 rounded-full transition-all shadow-sm"
              title="Registra tu negocio o entra a tu panel"
            >
              <Store className="w-3.5 h-3.5 text-sanvi-orange" />
              <span>Tengo Local ($120k)</span>
            </button>
          )}

          {/* Carrito de compras unificado */}
          <button
            onClick={onOpenCart}
            className="relative bg-gray-100 hover:bg-gray-200 text-gray-800 p-2 rounded-full transition-colors ml-0.5"
            title="Ver carrito de compras"
          >
            <ShoppingBag className="w-5 h-5 text-gray-700" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-sanvi-red text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center animate-bounce shadow">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
