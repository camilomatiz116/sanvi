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
  HelpCircle,
  CreditCard,
  Wallet,
  QrCode,
  ExternalLink,
  ShieldCheck,
  CheckCircle2
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
  onStoreUpdated,
  initialTab = 'profile'
}) {
  const [activeTab, setActiveTab] = useState(initialTab); // 'profile' | 'payments'

  // Datos de perfil
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [commercialCenter, setCommercialCenter] = useState('El Gran San');
  const [localNumber, setLocalNumber] = useState('');
  const [phoneWhatsapp, setPhoneWhatsapp] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [logoUrl, setLogoUrl] = useState('');

  // Pasarelas y Plataformas de Cobro Colombianas
  const [nequiNumber, setNequiNumber] = useState('');
  const [daviplataNumber, setDaviplataNumber] = useState('');
  const [wompiLink, setWompiLink] = useState('');
  const [boldLink, setBoldLink] = useState('');
  const [bancolombiaAccount, setBancolombiaAccount] = useState('');
  const [paymentMethods, setPaymentMethods] = useState({
    nequi: true,
    daviplata: true,
    wompi: true,
    bold: true,
    contraentrega: true
  });

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

      // Cargar configuraciones de pago
      setNequiNumber(store.nequi_number || store.phone_whatsapp?.replace(/\D/g, '').slice(-10) || '');
      setDaviplataNumber(store.daviplata_number || store.phone_whatsapp?.replace(/\D/g, '').slice(-10) || '');
      setWompiLink(store.wompi_link || '');
      setBoldLink(store.bold_link || '');
      setBancolombiaAccount(store.bancolombia_account || '');
      if (store.payment_methods) {
        setPaymentMethods(store.payment_methods);
      }
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
        logo_url: logoUrl,
        nequi_number: nequiNumber,
        daviplata_number: daviplataNumber,
        wompi_link: wompiLink,
        bold_link: boldLink,
        bancolombia_account: bancolombiaAccount,
        payment_methods: paymentMethods
      };

      const res = await api.updateStore(store.id, updatedData);

      if (onStoreUpdated) {
        onStoreUpdated(res.store || { ...store, ...updatedData });
      }

      onClose();
    } catch (err) {
      alert('Error al guardar datos de la tienda: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 border border-gray-100 my-auto">
        
        {/* Cabecera del Modal */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-sanvi-orange flex items-center justify-center">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-gray-900">
                Ajustes de Tienda & Pasarelas de Cobro
              </h2>
              <p className="text-[11px] text-gray-500 font-semibold">
                Personaliza la imagen de tu local y configura tus cobros por Nequi, Wompi o Daviplata
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pestañas de Navegación del Modal */}
        <div className="flex border-b border-gray-200 bg-gray-50/50 px-5 pt-2 gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`pb-2.5 text-xs font-bold transition-all flex items-center gap-1.5 border-b-2 ${
              activeTab === 'profile'
                ? 'border-sanvi-orange text-sanvi-orange font-black'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Portada & Local</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('payments')}
            className={`pb-2.5 text-xs font-bold transition-all flex items-center gap-1.5 border-b-2 ${
              activeTab === 'payments'
                ? 'border-sanvi-orange text-sanvi-orange font-black'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Wallet className="w-3.5 h-3.5 text-sanvi-orange" />
            <span>Pasarelas Colombianas (Nequi, Wompi, Daviplata, Bold)</span>
            <span className="bg-yellow-400 text-gray-950 text-[9px] font-black px-1.5 py-0.2 rounded-full">
              Nuevo
            </span>
          </button>
        </div>

        <form onSubmit={handleSave} className="p-4 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* PESTAÑA 1: PERFIL, PORTADA Y LOGO */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              {/* Sección 1: Portada Superior (Banner Ancho) */}
              <div className="space-y-2">
                <label className="block text-xs font-black text-gray-900">
                  1. Foto de Portada (Banner Superior Ancho)
                </label>
                <div className="relative aspect-[3/1] w-full rounded-xl overflow-hidden bg-gray-100 border border-gray-200 group">
                  <img src={bannerUrl} alt="Portada" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <label className="cursor-pointer bg-white text-gray-900 font-bold text-xs px-3 py-1.5 rounded-lg shadow-md hover:bg-gray-50 flex items-center gap-1.5 transition-all">
                      <Camera className="w-3.5 h-3.5 text-sanvi-orange" />
                      <span>{compressingBanner ? 'Comprimiendo WebP...' : 'Subir Imagen'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleBannerUpload}
                        disabled={compressingBanner}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Presets de Portada */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  <span className="text-[10px] font-bold text-gray-400 shrink-0">Banners listos:</span>
                  {BANNER_PRESETS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setBannerUrl(p.url)}
                      className={`text-[10px] font-semibold px-2 py-1 rounded-md shrink-0 transition-colors ${
                        bannerUrl === p.url
                          ? 'bg-orange-100 text-sanvi-orange font-bold border border-sanvi-orange'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sección 2: Logo Cuadrito del Local */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <label className="block text-xs font-black text-gray-900">
                  2. Foto de Perfil / Logo (El Cuadrito)
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 border-2 border-gray-200 shadow-sm shrink-0">
                    <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold px-3 py-1.5 rounded-lg border border-gray-300 transition-all">
                      <Upload className="w-3.5 h-3.5 text-sanvi-orange" />
                      <span>{compressingLogo ? 'Comprimiendo WebP...' : 'Subir Foto de Cuadrito'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        disabled={compressingLogo}
                        className="hidden"
                      />
                    </label>
                    <div className="flex items-center gap-1 overflow-x-auto">
                      {LOGO_PRESETS.map((p, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setLogoUrl(p.url)}
                          className={`text-[10px] px-1.5 py-0.5 rounded border transition-colors ${
                            logoUrl === p.url
                              ? 'bg-orange-50 border-sanvi-orange text-sanvi-orange font-bold'
                              : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sección 3: Datos de Identificación del Local */}
              <div className="space-y-3 pt-2 border-t border-gray-100">
                <div>
                  <label className="block text-xs font-black text-gray-800 mb-1">
                    Nombre del Negocio / Marca *
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
                    WhatsApp de Ventas & Pedidos *
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
                </div>
              </div>
            </div>
          )}

          {/* PESTAÑA 2: PASARELAS DE PAGO COLOMBIANAS (NEQUI, WOMPI, DAVIPLATA, BOLD) */}
          {activeTab === 'payments' && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-950">
                  <p className="font-black">Cobros directos a tu cuenta en Colombia (0% intermediación)</p>
                  <p className="text-[11px] text-amber-800 mt-0.5 font-medium">
                    Configura aquí tus canales de recaudo para que tus clientes mayoristas y al detal te paguen directamente por Nequi Negocios, Wompi Bancolombia, Daviplata o Bold.
                  </p>
                </div>
              </div>

              {/* 1. NEQUI / NEQUI NEGOCIOS */}
              <div className="bg-white border border-gray-200 rounded-xl p-3.5 space-y-2.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-[#20002c] text-[#ff007a] font-black text-xs flex items-center justify-center">
                      N
                    </span>
                    <div>
                      <h4 className="text-xs font-black text-gray-900">Nequi & Nequi Negocios</h4>
                      <p className="text-[10px] text-gray-500 font-medium">
                        Transferencias directas y cobro por código QR
                      </p>
                    </div>
                  </div>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={paymentMethods.nequi}
                      onChange={(e) => setPaymentMethods({ ...paymentMethods, nequi: e.target.checked })}
                      className="w-4 h-4 text-sanvi-orange rounded focus:ring-sanvi-orange"
                    />
                    <span className="text-[11px] font-bold text-gray-700">Activo</span>
                  </label>
                </div>

                {paymentMethods.nequi && (
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Número de celular Nequi o Llave de Negocio
                    </label>
                    <input
                      type="text"
                      value={nequiNumber}
                      onChange={(e) => setNequiNumber(e.target.value)}
                      placeholder="Ej: 3102345678"
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-xs font-mono font-bold outline-none focus:border-sanvi-orange"
                    />
                  </div>
                )}
              </div>

              {/* 2. WOMPI BANCOLOMBIA */}
              <div className="bg-white border border-gray-200 rounded-xl p-3.5 space-y-2.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-[#00109b] text-white font-black text-[10px] flex items-center justify-center">
                      W
                    </span>
                    <div>
                      <h4 className="text-xs font-black text-gray-900">Wompi (Bancolombia)</h4>
                      <p className="text-[10px] text-gray-500 font-medium">
                        Permite a los clientes pagar con Tarjetas Débito/Crédito y Botón Bancolombia
                      </p>
                    </div>
                  </div>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={paymentMethods.wompi}
                      onChange={(e) => setPaymentMethods({ ...paymentMethods, wompi: e.target.checked })}
                      className="w-4 h-4 text-sanvi-orange rounded focus:ring-sanvi-orange"
                    />
                    <span className="text-[11px] font-bold text-gray-700">Activo</span>
                  </label>
                </div>

                {paymentMethods.wompi && (
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Enlace de pago de Wompi (Link de cobro de tu local)
                    </label>
                    <input
                      type="url"
                      value={wompiLink}
                      onChange={(e) => setWompiLink(e.target.value)}
                      placeholder="https://checkout.wompi.co/l/tu-negocio"
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-xs font-mono outline-none focus:border-sanvi-orange"
                    />
                    <p className="text-[10px] text-gray-400 mt-1">
                      Copia el link de cobro desde tu panel de comercio en Wompi Bancolombia.
                    </p>
                  </div>
                )}
              </div>

              {/* 3. DAVIPLATA */}
              <div className="bg-white border border-gray-200 rounded-xl p-3.5 space-y-2.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-[#ed1c24] text-white font-black text-xs flex items-center justify-center">
                      D
                    </span>
                    <div>
                      <h4 className="text-xs font-black text-gray-900">Daviplata</h4>
                      <p className="text-[10px] text-gray-500 font-medium">
                        Recibe pagos inmediatos de Daviplata y Davivienda
                      </p>
                    </div>
                  </div>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={paymentMethods.daviplata}
                      onChange={(e) => setPaymentMethods({ ...paymentMethods, daviplata: e.target.checked })}
                      className="w-4 h-4 text-sanvi-orange rounded focus:ring-sanvi-orange"
                    />
                    <span className="text-[11px] font-bold text-gray-700">Activo</span>
                  </label>
                </div>

                {paymentMethods.daviplata && (
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Número Daviplata
                    </label>
                    <input
                      type="text"
                      value={daviplataNumber}
                      onChange={(e) => setDaviplataNumber(e.target.value)}
                      placeholder="Ej: 3102345678"
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-xs font-mono font-bold outline-none focus:border-sanvi-orange"
                    />
                  </div>
                )}
              </div>

              {/* 4. BOLD.CO (DATÁFONO Y LINK VIRTUAL) */}
              <div className="bg-white border border-gray-200 rounded-xl p-3.5 space-y-2.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-black text-white font-black text-[10px] flex items-center justify-center">
                      Bold
                    </span>
                    <div>
                      <h4 className="text-xs font-black text-gray-900">Bold.co</h4>
                      <p className="text-[10px] text-gray-500 font-medium">
                        Link de pago directo de datáfono virtual Bold
                      </p>
                    </div>
                  </div>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={paymentMethods.bold}
                      onChange={(e) => setPaymentMethods({ ...paymentMethods, bold: e.target.checked })}
                      className="w-4 h-4 text-sanvi-orange rounded focus:ring-sanvi-orange"
                    />
                    <span className="text-[11px] font-bold text-gray-700">Activo</span>
                  </label>
                </div>

                {paymentMethods.bold && (
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Link de cobro Bold
                    </label>
                    <input
                      type="url"
                      value={boldLink}
                      onChange={(e) => setBoldLink(e.target.value)}
                      placeholder="https://link.bold.co/tu-negocio"
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-xs font-mono outline-none focus:border-sanvi-orange"
                    />
                  </div>
                )}
              </div>

              {/* 5. BANCOLOMBIA DIRECTO O BRE-B / TRANSFIYA */}
              <div className="bg-white border border-gray-200 rounded-xl p-3.5 space-y-2.5 shadow-2xs">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-[#fdcb02] text-gray-950 font-black text-[10px] flex items-center justify-center">
                    BC
                  </span>
                  <div>
                    <h4 className="text-xs font-black text-gray-900">Cuenta Bancolombia / Transfiya</h4>
                    <p className="text-[10px] text-gray-500 font-medium">
                      Para transferencias interbancarias y pagos mayoristas de alto valor
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Tipo, Número de Cuenta y Titular
                  </label>
                  <input
                    type="text"
                    value={bancolombiaAccount}
                    onChange={(e) => setBancolombiaAccount(e.target.value)}
                    placeholder="Ej: Ahorros 245-891023-45 (Confecciones Don Lucho S.A.S.)"
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-xs font-semibold outline-none focus:border-sanvi-orange"
                  />
                </div>
              </div>

              {/* 6. PAGO CONTRA ENTREGA EN BOGOTÁ */}
              <div className="bg-white border border-gray-200 rounded-xl p-3.5 flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center">
                    📦
                  </span>
                  <div>
                    <h4 className="text-xs font-black text-gray-900">Pago Contra Entrega</h4>
                    <p className="text-[10px] text-gray-500 font-medium">
                      El cliente paga en efectivo o Nequi cuando el mensajero le entrega en Bogotá
                    </p>
                  </div>
                </div>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={paymentMethods.contraentrega}
                    onChange={(e) => setPaymentMethods({ ...paymentMethods, contraentrega: e.target.checked })}
                    className="w-4 h-4 text-sanvi-orange rounded focus:ring-sanvi-orange"
                  />
                  <span className="text-[11px] font-bold text-gray-700">Aceptar</span>
                </label>
              </div>
            </div>
          )}

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
              className="bg-sanvi-orange hover:bg-orange-600 text-white font-black text-xs px-6 py-2.5 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{saving ? 'Guardando en Sanvi...' : 'Guardar Configuración'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
