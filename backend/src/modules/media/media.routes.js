import { Router } from 'express';
import multer from 'multer';
import { compressAndSaveImage } from './compressor.js';
import { parseVideoUrl } from './videoParser.js';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB máximo antes de comprimir
});

// Ruta para subir y comprimir imagen automáticamente a WebP
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se envió ningún archivo de imagen' });
    }

    const compressed = await compressAndSaveImage(req.file.buffer);

    return res.json({
      message: 'Imagen comprimida a WebP con éxito',
      ...compressed
    });
  } catch (error) {
    console.error('Error procesando imagen:', error);
    return res.status(500).json({ error: 'Error al comprimir la imagen' });
  }
});

// Ruta para verificar y parsear enlace de TikTok o YouTube Shorts
router.post('/parse-video', (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'La URL del video es requerida' });
  }

  const parsed = parseVideoUrl(url);
  return res.json(parsed);
});

export default router;

