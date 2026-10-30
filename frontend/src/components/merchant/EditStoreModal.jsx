import React, { useState, useEffect } from 'react';
import {
  X,
  Upload,
  Image as ImageIcon,
  Check,
  Building2,
  Phone,
  Store,
  Sparkles,
  Camera,
  MapPin,
  HelpCircle
} from 'lucide-react';
import { compressImageClient } from '../../utils/imageCompressor';
import { api } from '../../services/api';

// Banners rápidos de alta calidad listos para San Victorino
const BANNER_PRESETS = [
  {
    label: '👖 Denim & Ropa El Gran San',
    url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop'
  },
  {
    label: '🏬 Bodega & Pasillo Comercial',
    url: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&auto=format&fit=crop'
  },
  {
    label: '📱 Tecnología & Iluminación LED',
    url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&auto=format&fit=crop'
  },
  {
    label: '👟 Taller de Calzado en Cuero',
    url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1200&auto=format&fit=crop'
  },
  {
    label: '🎒 Morrales & Bolsos Mayoristas',
    url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1200&auto=format&fit=crop'
  }
];

// Logos rápidos de alta resolución para el cuadrito
const LOGO_PRESETS = [
  {
    label: '👖 Ropa Denim',
    url: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=300&auto=format&fit=crop'
  },
  {
    label: '🎧 Tecnología',
    url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&auto=format&fit=crop'
  },
  {
    label: '👢 Calzado',
    url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&auto=format&fit=crop'
  },
  {
    label: '🧸 Juguetes',
    url: 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=300&auto=format&fit=crop'
  },
  {
    label: '💄 Belleza',
    url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&auto=format&fit=crop'
  }
];

export default function EditStoreModal({
  isOpen,
  onClose,
  store,
  onStoreUpdated
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [commercialCenter, setCommercialCenter] = useState('El Gran San');
  const [localNumber, setLocalNumber] = useState('');
  const [phoneWhatsapp, setPhoneWhatsapp] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [logoUrl, setLogoUrl] = useState('');

  const [compressingBanner, setCompressingBanner] = useState(false);
  const [compressingLogo, setCompressingLogo] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (store) {
      setName(store.name || '');
      setDescription(store.description || '');
      setCommercialCenter(store.commercial_center || 'El Gran San');
      setLocalNumber(store.local_number || '');
      setPhoneWhatsapp(store.phone_whatsapp || '');
      setBannerUrl(
        store.banner_url ||
          'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop'
      );
      setLogoUrl(
        store.logo_url ||
          'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=200&auto=format&fit=crop'
      );
    }
  }, [store]);

  if (!isOpen || !store) return null;

  // Subir y comprimir nuevo banner a WebP
  const handleBannerUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setCompressingBanner(true);
      const res = await compressImageClient(file);
      setBannerUrl(res.previewUrl);
    } catch (err) {
      alert('Error cargando el banner: ' + err.message);
    } finally {
      setCompressingBanner(false);
    }
  };

  // Subir y comprimir nuevo logo a WebP
  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setCompressingLogo(true);
      const res = await compressImageClient(file);
      setLogoUrl(res.previewUrl);
    } catch (err) {
      alert('Error cargando el logo: ' + err.message);
    } finally {
      setCompressingLogo(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name || !phoneWhatsapp) {
      alert('El nombre del local y el WhatsApp de ventas son requeridos');
      return;
    }

    try {
      setSaving(true);
      const updatedData = {
        name,
        description,
        commercial_center: commercialCenter,
        local_number: localNumber,
        phone_whatsapp: phoneWhatsapp,
        banner_url: bannerUrl,
        logo_url: logoUrl
      };

      const res = await api.updateStore(store.id, updatedData);

      if (onStoreUpdated) {
        onStoreUpdated(res.store || { ...store, ...updatedData });
      }

      onClose();
    } catch (err) {
      alert('Error guardando los datos de la tienda: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Cabecera Temu Seller Style */}
        <div className="bg-[#1C1D1F] text-white p-4 flex items-center justify-between border-b-2 border-sanvi-orange">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sanvi-orange text-white flex items-center justify-center font-black">
              🖼️
            </div>
            <div>
              <h3 className="text-base font-black flex items-center gap-2">
                Personalizar Portada & Logo de Mi Tienda
              </h3>
              <p className="text-[11px] text-gray-400">
                Cambia la foto del banner ancho, la imagen del cuadrito y tus datos comerciales
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-4 sm:p-5 space-y-4 max-h-[82vh] overflow-y-auto">
          {/* ======================================================== */}
          {/* PREVISUALIZACIÓN EN VIVO (BANNER + LOGO CUADRITO)         */}
          {/* ======================================================== */}
          <div>
            <label className="block text-xs font-black text-gray-800 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Vista Previa de tu Portada en Sanvi:</span>
              <span className="text-[10px] text-sanvi-orange font-bold">
                Así lo ven los compradores
              </span>
            </label>

            <div className="rounded-2xl overflow-hidden border-2 border-gray-300 shadow-sm bg-gray-900 relative">
              {/* Banner Ancho */}
              <div className="relative h-28 sm:h-36 w-full overflow-hidden bg-gray-800">
                <img
                  src={bannerUrl}
                  alt="Banner de tu tienda"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Botón flotante para cambiar el banner directamente */}
                <label className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white text-[11px] font-bold px-3 py-1.5 rounded-full cursor-pointer flex items-center gap-1.5 backdrop-blur-md border border-white/20 shadow-md transition-all active:scale-95">
                  <Camera className="w-3.5 h-3.5 text-sanvi-orange" />
                  <span>{compressingBanner ? 'Cargando...' : 'Cambiar Banner Ancho'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBannerUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Barra inferior con el Cuadrito del Logo */}
              <div className="p-3 bg-white flex items-end justify-between relative">
                <div className="flex items-end gap-3 -mt-10 sm:-mt-12">
                  {/* Cuadrito del Logo */}
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-4 border-white shadow-lg overflow-hidden bg-white shrink-0 group">
                    <img
                      src={logoUrl}
                      alt="Logo del local"
                      className="w-full h-full object-cover"
                    />

                    {/* Botón flotante para cambiar el logo del cuadrito */}
                    <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white cursor-pointer transition-opacity">
                      <Camera className="w-4 h-4 text-sanvi-orange" />
                      <span className="text-[8px] font-black uppercase mt-0.5">Cambiar</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="min-w-0 pb-1">
                    <h4 className="font-black text-gray-900 text-sm sm:text-base leading-tight truncate">
                      {name || 'Nombre de tu Tienda'}
                    </h4>
                    <p className="text-[11px] text-gray-500 font-medium truncate flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-sanvi-orange" />
                      {commercialCenter} • {localNumber || 'Local Comercial'}
                    </p>
                  </div>
                </div>

                <label className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-indigo-200 cursor-pointer flex items-center gap-1.5 transition-all">
                  <Camera className="w-3.5 h-3.5" />
                  <span>{compressingLogo ? 'Cargando...' : 'Cambiar Cuadrito'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* SELECCIÓN RÁPIDA DE BANNERS SAN VICTORINO (1 CLIC)       */}
          {/* ======================================================== */}
          <div className="border border-gray-200 bg-gray-50 p-3 rounded-xl space-y-2">
            <span className="text-[11px] font-black text-gray-700 uppercase tracking-wide block">
              ⚡ O elige un Banner de Portada de Alta Calidad (1 Clic):
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {BANNER_PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setBannerUrl(p.url)}
                  className={`text-left p-1.5 rounded-lg border text-[11px] font-bold transition-all flex items-center gap-1.5 ${
                    bannerUrl === p.url
                      ? 'bg-orange-100 border-sanvi-orange text-sanvi-orange'
                      : 'bg-white hover:bg-gray-100 border-gray-200 text-gray-700'
                  }`}
                >
                  <img src={p.url} alt={p.label} className="w-8 h-8 rounded object-cover shrink-0" />
                  <span className="truncate">{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ======================================================== */}
          {/* SELECCIÓN RÁPIDA DE LOGOS PARA EL CUADRITO               */}
          {/* ======================================================== */}
          <div className="border border-gray-200 bg-gray-50 p-3 rounded-xl space-y-2">
            <span className="text-[11px] font-black text-gray-700 uppercase tracking-wide block">
              ⚡ O elige una Foto para el Cuadrito (1 Clic):
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              {LOGO_PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setLogoUrl(p.url)}
                  className={`p-1 rounded-xl border text-[11px] font-bold transition-all flex items-center gap-1.5 ${
                    logoUrl === p.url
                      ? 'bg-indigo-100 border-indigo-600 text-indigo-900 ring-2 ring-indigo-400'
                      : 'bg-white hover:bg-gray-100 border-gray-200 text-gray-700'
                  }`}
                >
                  <img src={p.url} alt={p.label} className="w-7 h-7 rounded-lg object-cover" />
                  <span className="pr-1.5">{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ======================================================== */}
          {/* DATOS COMERCIALES DEL LOCAL FÍSICO                       */}
          {/* ======================================================== */}
          <div className="space-y-3 pt-2 border-t border-gray-200">
            <div>
              <label className="block text-xs font-black text-gray-800 mb-1">
                Nombre Comercial de tu Tienda / Local *
              </label>
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Confecciones Don Lucho Denim"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-sanvi-orange"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-gray-800 mb-1">
                Descripción o Lema del Negocio
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ej: Fabricantes directos de Jeans colombianos rígidos, levanta cola y chaquetas denim..."
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs outline-none focus:border-sanvi-orange"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-black text-gray-800 mb-1">
                  Centro Comercial en San Victorino
                </label>
                <select
                  value={commercialCenter}
                  onChange={(e) => setCommercialCenter(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-sanvi-orange"
                >
                  <option value="El Gran San">🏬 El Gran San</option>
                  <option value="Neos Centro">🏬 Neos Centro</option>
                  <option value="Plaza San Victorino">🏬 Plaza San Victorino</option>
                  <option value="Centro Mayorista Visto">🏬 Centro Mayorista Visto</option>
                  <option value="El Trébol">🏬 C.C. El Trébol</option>
                  <option value="Pasaje Rivas">🏬 Pasaje Rivas (Calle 10)</option>
                  <option value="Calle 11 Mayorista">🏬 Calle 11 Mayorista</option>
                  <option value="Manzana 22">🏬 Manzana 22</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-800 mb-1">
                  Número de Local / Piso
                </label>
                <input
                  type="text"
                  value={localNumber}
                  onChange={(e) => setLocalNumber(e.target.value)}
                  placeholder="Ej: Local 142 - Piso 1"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-sanvi-orange"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-800 mb-1">
                WhatsApp de Ventas & Pedidos (Directo al comerciante) *
              </label>
              <div className="relative">
                <input
                  required
                  type="tel"
                  value={phoneWhatsapp}
                  onChange={(e) => setPhoneWhatsapp(e.target.value)}
                  placeholder="573102345678"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-9 pr-3 py-2 text-xs font-mono font-bold outline-none focus:border-sanvi-orange"
                />
                <Phone className="w-4 h-4 text-emerald-600 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
              <span className="text-[10px] text-gray-500">
                Los clientes en Sanvi harán clic en "Pedir por WhatsApp" y los mensajes llegarán a esta línea
              </span>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving || compressingBanner || compressingLogo}
              className="bg-sanvi-orange hover:bg-orange-600 text-white font-black text-xs px-6 py-2.5 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              {saving ? 'Guardando...' : 'Guardar Portada & Datos de Tienda'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

