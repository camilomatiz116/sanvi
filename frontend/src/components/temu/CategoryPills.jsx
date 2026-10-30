import React from 'react';
import {
  Flame,
  Sparkles,
  Smartphone,
  Shirt,
  Heart,
  Gamepad2,
  Home,
  Briefcase,
  Footprints,
  Building2
} from 'lucide-react';

export default function CategoryPills({
  activeCategory,
  onSelectCategory,
  activeCenter,
  onSelectCenter
}) {
  const categories = [
    { label: 'Todos', value: 'Todos', icon: Sparkles },
    { label: '⚡ Madrugón', value: 'Madrugón', icon: Flame },
    { label: 'Tecnología & Celulares', value: 'Tecnología', icon: Smartphone },
    { label: 'Moda & Confección', value: 'Moda', icon: Shirt },
    { label: 'Belleza & Maquillaje', value: 'Belleza', icon: Heart },
    { label: 'Juguetería & Niños', value: 'Juguetería', icon: Gamepad2 },
    { label: 'Hogar & Cocina', value: 'Hogar', icon: Home },
    { label: 'Morrales & Maletas', value: 'Morrales', icon: Briefcase },
    { label: 'Calzado & Cuero', value: 'Calzado', icon: Footprints },
  ];

  const centers = [
    { label: 'Todos los Centros', value: '' },
    { label: 'Plaza San Victorino', value: 'Plaza San Victorino' },
    { label: 'Calle 11 Mayorista', value: 'Calle 11' },
    { label: 'El Gran San', value: 'El Gran San' },
    { label: 'Neos Centro', value: 'Neos Centro' },
    { label: 'C.C. Visto', value: 'Visto' },
    { label: 'C.C. El Trébol', value: 'El Trébol' },
    { label: 'Pasaje Rivas', value: 'Pasaje Rivas' }
  ];

  return (
    <div className="space-y-2.5 mb-4">
      {/* Carrusel horizontal de categorías multi-producto */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.value;
          const Icon = cat.icon;
          return (
            <button
              key={cat.value}
              onClick={() => onSelectCategory(cat.value)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shadow-sm active:scale-95 ${
                isActive
                  ? 'bg-sanvi-orange text-white shadow-orange-300'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {Icon && <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-sanvi-orange'}`} />}
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Filtro por centro comercial de San Victorino */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] font-semibold text-gray-500">
        <span className="flex items-center gap-1 text-gray-800 font-black whitespace-nowrap mr-1">
          <Building2 className="w-3.5 h-3.5 text-sanvi-orange" />
          Sector / C.C.:
        </span>
        {centers.map((center) => (
          <button
            key={center.value}
            onClick={() => onSelectCenter(center.value)}
            className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap ${
              activeCenter === center.value
                ? 'bg-gray-900 text-white font-bold shadow-sm'
                : 'bg-white text-gray-600 hover:bg-gray-200 border border-gray-200/80'
            }`}
          >
            {center.label}
          </button>
        ))}
      </div>
    </div>
  );
}
