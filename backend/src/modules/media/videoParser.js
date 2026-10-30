/**
 * Procesa y normaliza enlaces de video de TikTok y YouTube Shorts
 * para incrustarlos sin costo de ancho de banda ni almacenamiento.
 */
export function parseVideoUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return null;

  const trimmed = rawUrl.trim();

  // 1. YouTube Shorts o enlaces estándar
  const ytShortsMatch = trimmed.match(/(?:shorts\/|v\/|watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (ytShortsMatch) {
    const videoId = ytShortsMatch[1];
    return {
      type: 'youtube',
      videoId,
      embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`,
      originalUrl: trimmed
    };
  }

  // 2. TikTok
  const tiktokMatch = trimmed.match(/tiktok\.com\/(?:@[\w.-]+\/video\/|v\/|t\/)(\d+)/);
  if (tiktokMatch) {
    const videoId = tiktokMatch[1];
    return {
      type: 'tiktok',
      videoId,
      embedUrl: `https://www.tiktok.com/embed/v2/${videoId}`,
      originalUrl: trimmed
    };
  }

  // Si no coincide con el regex directo pero es un enlace válido de tiktok
  if (trimmed.includes('tiktok.com')) {
    return {
      type: 'tiktok',
      videoId: null,
      embedUrl: trimmed,
      originalUrl: trimmed
    };
  }

  return {
    type: 'unknown',
    videoId: null,
    embedUrl: trimmed,
    originalUrl: trimmed
  };
}

