import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';

const UPLOAD_DIR = path.resolve('uploads');

// Asegurar que la carpeta uploads exista
fs.mkdir(UPLOAD_DIR, { recursive: true }).catch(console.error);

/**
 * Comprime y optimiza imágenes a formato WebP moderno.
 * Reduce fotos de 5MB a ~80-120KB manteniendo calidad nítida.
 * @param {Buffer} buffer - Buffer de la imagen cargada
 * @returns {Promise<{ filename: string, url: string, sizeBytes: number }>}
 */
export async function compressAndSaveImage(buffer) {
  const hash = crypto.randomBytes(12).toString('hex');
  const filename = `sanvi-${Date.now()}-${hash}.webp`;
  const outputPath = path.join(UPLOAD_DIR, filename);

  const compressedBuffer = await sharp(buffer)
    .resize({
      width: 1200,
      height: 1200,
      fit: 'inside', // Mantiene proporción original sin recortar
      withoutEnlargement: true
    })
    .webp({
      quality: 80, // Balance óptimo entre compresión y detalle textil
      effort: 4
    })
    .toBuffer();

  await fs.writeFile(outputPath, compressedBuffer);

  return {
    filename,
    url: `/uploads/${filename}`,
    sizeBytes: compressedBuffer.length
  };
}

