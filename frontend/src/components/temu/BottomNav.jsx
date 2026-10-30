import React from 'react';
import { Home, Flame, ShoppingBag, Store } from 'lucide-react';

export default function BottomNav({
  activeTab,
  setActiveTab,
  cartCount,
  onOpenCart,
  onOpenDashboard,
  onFilterMadrugon
}) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 py-1.5 px-3 md:hidden flex items-center justify-around shadow-lg">
      <button
        onClick={() => {
          setActiveTab('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
          activeTab === 'home' ? 'text-sanvi-orange' : 'text-gray-500'
        }`}
      >
        <Home className="w-5 h-5" />
        <span>Inicio</span>
      </button>

      <button
        onClick={() => {
          setActiveTab('madrugon');
          onFilterMadrugon();
        }}
        className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
          activeTab === 'madrugon' ? 'text-sanvi-red' : 'text-gray-500'
        }`}
      >
        <Flame className="w-5 h-5 text-sanvi-red animate-pulse" />
        <span>Madrugón</span>
      </button>

      <button
        onClick={onOpenCart}
        className="flex flex-col items-center gap-0.5 text-[10px] font-bold text-gray-500 relative"
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5 text-gray-700" />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-sanvi-red text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </div>
        <span>Carrito</span>
      </button>

      <button
        onClick={onOpenDashboard}
        className="flex flex-col items-center gap-0.5 text-[10px] font-bold text-gray-700"
      >
        <Store className="w-5 h-5 text-amber-600" />
        <span>Mi Local ($120k)</span>
      </button>
    </nav>
  );
}

