import React, { useState, useEffect } from 'react';
import { Flame, Clock, Tag, ChevronRight } from 'lucide-react';

export default function FlashDealsBanner({ onFilterMadrugon }) {
  // Contador regresivo estilo Temu
  const [timeLeft, setTimeLeft] = useState({
    hours: 3,
    minutes: 42,
    seconds: 15
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 4, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatNum = (n) => String(n).padStart(2, '0');

  return (
    <div className="bg-gradient-to-r from-orange-600 via-sanvi-orange to-red-600 text-white rounded-2xl p-4 sm:p-5 shadow-lg my-4 relative overflow-hidden">
      {/* Elementos visuales de fondo */}
      <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -left-8 -bottom-8 w-40 h-40 bg-yellow-400/20 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Lado izquierdo: Título y propuesta de valor */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-black tracking-wide uppercase text-yellow-300">
            <Flame className="w-4 h-4 text-yellow-400 animate-bounce" />
            Liquidación Madrugón Sanvi
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight leading-tight">
            Precios de Taller sin Intermediarios
          </h2>
          <p className="text-orange-100 text-xs sm:text-sm font-medium max-w-xl">
            Compre jeans, buzos y chaquetas con hasta <strong className="text-white font-extrabold">50% de descuento</strong>. Lleve al detal o por docena para su negocio en cualquier ciudad de Colombia.
          </p>
        </div>

        {/* Lado derecho: Reloj de urgencia y botón */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-3 py-2 rounded-xl border border-white/20">
            <Clock className="w-4 h-4 text-yellow-300 mr-1 hidden sm:inline" />
            <div className="flex items-center gap-1 text-center font-black">
              <span className="bg-white text-gray-900 px-2 py-1 rounded-md text-sm font-black shadow-sm">
                {formatNum(timeLeft.hours)}
              </span>
              <span className="text-white font-bold">:</span>
              <span className="bg-white text-gray-900 px-2 py-1 rounded-md text-sm font-black shadow-sm">
                {formatNum(timeLeft.minutes)}
              </span>
              <span className="text-white font-bold">:</span>
              <span className="bg-white text-gray-900 px-2 py-1 rounded-md text-sm font-black shadow-sm text-red-600">
                {formatNum(timeLeft.seconds)}
              </span>
            </div>
          </div>

          <button
            onClick={onFilterMadrugon}
            className="bg-yellow-400 hover:bg-yellow-300 text-gray-950 font-black text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-1 whitespace-nowrap active:scale-95"
          >
            Ver Ofertas <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

