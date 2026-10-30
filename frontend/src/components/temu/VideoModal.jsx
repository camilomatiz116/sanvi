import React from 'react';
import { X, ExternalLink, ShoppingBag, MessageCircle } from 'lucide-react';

export default function VideoModal({ product, onClose, onAddToCart, onDirectWhatsApp }) {
  if (!product) return null;

  const parsed = product.video_parsed || {};
  const isYouTube = parsed.type === 'youtube';
  const isTikTok = parsed.type === 'tiktok';

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Cabecera del modal */}
        <div className="p-3 bg-gray-900 text-white flex items-center justify-between">
          <div className="truncate pr-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-yellow-400">
              {isTikTok ? 'TikTok Video' : 'YouTube Short'} de la Prenda
            </span>
            <h4 className="text-xs font-bold truncate text-gray-200">{product.title}</h4>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Reproductor de Video */}
        <div className="relative aspect-[9/16] max-h-[55vh] w-full bg-black flex items-center justify-center">
          {isYouTube && parsed.embedUrl ? (
            <iframe
              src={parsed.embedUrl}
              title={product.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : isTikTok && parsed.videoId ? (
            <iframe
              src={`https://www.tiktok.com/embed/v2/${parsed.videoId}`}
              title={product.title}
              className="w-full h-full border-0"
              allowFullScreen
            />
          ) : (
            <div className="text-center p-6 text-white space-y-3">
              <p className="text-sm font-medium">Video de demostración disponible en redes:</p>
              <a
                href={product.video_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-black px-4 py-2 rounded-xl transition-all"
              >
                Abrir en la App <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>

        {/* Footer con compra inmediata */}
        <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-2">
          <div>
            <div className="text-xs text-gray-500 font-semibold">Precio Sanvi</div>
            <div className="text-lg font-black text-sanvi-red">
              ${new Intl.NumberFormat('es-CO').format(product.price_retail)} COP
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onDirectWhatsApp(product);
                onClose();
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-3 py-2.5 rounded-xl flex items-center gap-1 shadow-sm transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </button>
            <button
              onClick={() => {
                onAddToCart(product);
                onClose();
              }}
              className="bg-sanvi-orange hover:bg-orange-600 text-white text-xs font-black px-4 py-2.5 rounded-xl flex items-center gap-1 shadow-sm transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              Agregar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

