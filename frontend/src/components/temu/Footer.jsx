import React from 'react';
import {
  ShieldCheck,
  Truck,
  Lock,
  Store,
  ChevronDown,
  CheckCircle2,
  PhoneCall,
  Clock,
  Sparkles,
  Award,
  BadgeCheck
} from 'lucide-react';

export default function Footer({ onOpenAuthModal, onOpenStorePortal }) {
  return (
    <footer className="bg-[#111111] text-gray-300 font-sans border-t border-gray-800 pb-24 lg:pb-10 transition-colors">
      {/* CONTENEDOR PRINCIPAL */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        
        {/* GRILLA DE 4 COLUMNAS ESTILO TEMU */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 pb-10 border-b border-gray-800/80">
          
          {/* COLUMNA 1: INFORMACIÓN DE LA EMPRESA */}
          <div>
            <h4 className="text-white text-sm font-extrabold tracking-wide uppercase mb-4 flex items-center gap-2">
              <Store className="w-4 h-4 text-sanvi-orange" />
              <span>Información de SANVI</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li>
                <a href="#acerca" className="hover:text-white transition-colors">
                  Acerca de SANVI Colombia
                </a>
              </li>
              <li>
                <a href="#madrugon" className="hover:text-white transition-colors">
                  El Madrugón Virtual: Miércoles y Sábados
                </a>
              </li>
              <li>
                <a href="#bodegas" className="hover:text-white transition-colors">
                  Fabricantes Directos de San Victorino
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenStorePortal}
                  className="text-left hover:text-sanvi-orange transition-colors font-medium text-amber-400"
                >
                  ¿Tienes bodega o local? Vende con nosotros
                </button>
              </li>
              <li>
                <a href="#prensa" className="hover:text-white transition-colors">
                  Noticias del Comercio Mayorista
                </a>
              </li>
              <li>
                <a href="#sostenible" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>Apoyo a la Confección Nacional</span>
                  <span className="text-[10px] bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-1 rounded font-bold">100% COL</span>
                </a>
              </li>
            </ul>
          </div>

          {/* COLUMNA 2: ATENCIÓN AL CLIENTE */}
          <div>
            <h4 className="text-white text-sm font-extrabold tracking-wide uppercase mb-4 flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-emerald-500" />
              <span>Atención al cliente</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li>
                <a href="#devoluciones" className="hover:text-white transition-colors">
                  Política de devolución y cambio en bodega
                </a>
              </li>
              <li>
                <a href="#envios" className="hover:text-white transition-colors">
                  Información y tarifas de envío nacional
                </a>
              </li>
              <li>
                <a href="#garantia" className="hover:text-white transition-colors">
                  Garantía directa con el comerciante
                </a>
              </li>
              <li>
                <a href="#reportar" className="hover:text-white transition-colors">
                  Reportar local o producto sospechoso
                </a>
              </li>
              <li>
                <a href="#mayorista" className="hover:text-white transition-colors">
                  Mínimos de compra mayorista (desde 6 uds)
                </a>
              </li>
              <li>
                <a href="#rastreo" className="hover:text-white transition-colors">
                  Rastreo de envíos intermunicipales
                </a>
              </li>
            </ul>
          </div>

          {/* COLUMNA 3: AYUDA Y SEGURIDAD */}
          <div>
            <h4 className="text-white text-sm font-extrabold tracking-wide uppercase mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>Ayuda y Seguridad</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  Centro de ayuda y preguntas frecuentes
                </a>
              </li>
              <li>
                <a href="#seguridad" className="hover:text-white transition-colors">
                  Centro de seguridad de compras SANVI
                </a>
              </li>
              <li>
                <a href="#proteccion" className="hover:text-white transition-colors">
                  Protección al comprador contra fraudes
                </a>
              </li>
              <li>
                <a href="#propiedad" className="hover:text-white transition-colors">
                  Política de propiedad intelectual y marcas
                </a>
              </li>
              <li>
                <a href="#facturacion" className="hover:text-white transition-colors">
                  Facturación electrónica y RUT de locales
                </a>
              </li>
            </ul>
          </div>

          {/* COLUMNA 4: DESCARGA DE APP Y REDES (TEMU STYLE) */}
          <div className="space-y-5">
            <div>
              <h4 className="text-white text-sm font-extrabold tracking-wide uppercase mb-3">
                Descarga la App de SANVI
              </h4>
              
              {/* Bullets con Checks */}
              <ul className="space-y-1.5 text-[11px] text-gray-400 mb-4">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Alertas del Madrugón en tiempo real</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Rastrea pedidos a toda Colombia</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Pago seguro PSE, Nequi y Contra Entrega</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Precios directos de fábrica sin intermediarios</span>
                </li>
              </ul>

              {/* Badges de App Store y Google Play */}
              <div className="flex flex-col sm:flex-row gap-2.5">
                {/* App Store */}
                <a
                  href="#appstore"
                  className="bg-black hover:bg-neutral-800 border border-gray-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-2 transition-all active:scale-95"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.99.6-2.61 1.33-.55.63-.99 1.68-.86 2.7.99.08 2.02-.53 2.54-1.18z"/>
                  </svg>
                  <div className="text-left">
                    <p className="text-[9px] text-gray-400 leading-none">Consíguelo en el</p>
                    <p className="text-xs font-bold leading-tight">App Store</p>
                  </div>
                </a>

                {/* Google Play */}
                <a
                  href="#googleplay"
                  className="bg-black hover:bg-neutral-800 border border-gray-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-2 transition-all active:scale-95"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186c-.339-.335-.61-.83-.61-1.503V3.317c0-.673.271-1.168.609-1.503zm11.233 11.234l2.542-2.542-11.83-6.83 9.288 9.372zm0 1.904l-9.288 9.372 11.83-6.83-2.542-2.542zm1.488-1.488l3.473-2.005c.983-.568.983-1.492 0-2.06l-3.473-2.005-2.03 2.035 2.03 2.035z"/>
                  </svg>
                  <div className="text-left">
                    <p className="text-[9px] text-gray-400 leading-none">Disponible en</p>
                    <p className="text-xs font-bold leading-tight">Google Play</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Redes Sociales */}
            <div>
              <h5 className="text-white text-xs font-bold mb-2">Conectar con SANVI</h5>
              <div className="flex items-center gap-3 text-gray-400">
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:text-pink-500 hover:border-pink-500 transition-colors">
                  <span className="text-xs font-bold">IG</span>
                </a>
                <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:text-white hover:border-white transition-colors">
                  <span className="text-xs font-bold">TT</span>
                </a>
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:text-blue-500 hover:border-blue-500 transition-colors">
                  <span className="text-xs font-bold">FB</span>
                </a>
                <a href="https://whatsapp.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:text-emerald-500 hover:border-emerald-500 transition-colors">
                  <span className="text-xs font-bold">WA</span>
                </a>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:text-red-500 hover:border-red-500 transition-colors">
                  <span className="text-xs font-bold">YT</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* SECCIÓN DE CERTIFICACIÓN DE SEGURIDAD Y MÉTODOS DE PAGO */}
        <div className="py-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-center border-b border-gray-800/80">
          
          {/* Certificación de Seguridad */}
          <div>
            <span className="text-xs font-extrabold text-gray-300 uppercase tracking-wider block mb-3">
              Certificación de Seguridad
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-neutral-900 border border-neutral-800 text-gray-300 text-[10px] font-bold px-2.5 py-1.5 rounded flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-emerald-400" />
                <span>SSL 256-bit</span>
              </span>
              <span className="bg-neutral-900 border border-neutral-800 text-gray-300 text-[10px] font-bold px-2.5 py-1.5 rounded flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-blue-400" />
                <span>PCI-DSS Compliant</span>
              </span>
              <span className="bg-neutral-900 border border-neutral-800 text-gray-300 text-[10px] font-bold px-2.5 py-1.5 rounded flex items-center gap-1.5">
                <BadgeCheck className="w-3 h-3 text-amber-400" />
                <span>Comercio Verificado</span>
              </span>
              <span className="bg-neutral-900 border border-neutral-800 text-gray-300 text-[10px] font-bold px-2.5 py-1.5 rounded flex items-center gap-1.5">
                <Award className="w-3 h-3 text-purple-400" />
                <span>Garantía Sanvi</span>
              </span>
            </div>
          </div>

          {/* Aceptamos (Métodos de Pago Colombia) */}
          <div className="md:text-right">
            <span className="text-xs font-extrabold text-gray-300 uppercase tracking-wider block mb-3">
              Aceptamos
            </span>
            <div className="flex flex-wrap items-center gap-2 md:justify-end">
              <span className="bg-white text-gray-950 font-black text-[10px] px-2.5 py-1 rounded shadow-xs">
                PSE
              </span>
              <span className="bg-[#20002c] text-[#ff007a] border border-[#ff007a]/40 font-black text-[10px] px-2.5 py-1 rounded shadow-xs">
                Nequi
              </span>
              <span className="bg-[#ed1c24] text-white font-black text-[10px] px-2.5 py-1 rounded shadow-xs">
                Daviplata
              </span>
              <span className="bg-[#fdcb02] text-gray-950 font-black text-[10px] px-2.5 py-1 rounded shadow-xs">
                Bancolombia
              </span>
              <span className="bg-neutral-800 text-white font-bold text-[10px] px-2.5 py-1 rounded border border-neutral-700">
                VISA
              </span>
              <span className="bg-neutral-800 text-white font-bold text-[10px] px-2.5 py-1 rounded border border-neutral-700">
                Mastercard
              </span>
              <span className="bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 font-extrabold text-[10px] px-2.5 py-1 rounded flex items-center gap-1">
                <Truck className="w-3 h-3 text-emerald-400" />
                <span>Contra Entrega</span>
              </span>
            </div>
          </div>
        </div>

        {/* BARRA LEGAL Y COPYRIGHT INFERIOR */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between text-[11px] text-gray-500 gap-4 text-center md:text-left">
          <p>
            © 2024 - 2026 SANVI Tecnologías de Colombia S.A.S. • La plataforma oficial del comercio de San Victorino, Bogotá D.C.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <a href="#terminos" className="hover:text-gray-300 transition-colors">
              Términos de uso
            </a>
            <a href="#privacidad" className="hover:text-gray-300 transition-colors">
              Política de privacidad
            </a>
            <a href="#habeas" className="hover:text-gray-300 transition-colors">
              Habeas Data
            </a>
            <a href="#sic" className="hover:text-gray-300 transition-colors">
              Superintendencia de Industria y Comercio
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
