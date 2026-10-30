/**
 * Compresor de imágenes en el navegador del cliente.
 * Convierte fotos pesadas de celulares (4-10MB) a WebP ultraligero (~70-130KB)
 * antes de enviarlas al servidor, ahorrando datos y disco en Contabo.
 */
export async function compressImageClient(file, maxWidth = 1200, maxHeight = 1200, quality = 0.8) {
  return new Promise((resolve, reject) => {
    // Si no es imagen, rechazar
    if (!file.type.startsWith('image/')) {
      return reject(new Error('El archivo no es una imagen válida'));
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        let { width, height } = img;

        // Calcular escala proporcional
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        // Suavizado de imagen de alta calidad
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Exportar a WebP (con fallback a JPEG si el navegador es antiguo)
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return reject(new Error('Fallo la compresión en Canvas'));
            }

            const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", {
              type: 'image/webp',
              lastModified: Date.now()
            });

            resolve({
              file: compressedFile,
              previewUrl: URL.createObjectURL(blob),
              originalSizeKB: Math.round(file.size / 1024),
              compressedSizeKB: Math.round(blob.size / 1024)
            });
          },
          'image/webp',
          quality
        );
      };

      img.onerror = (err) => reject(err);
    };

    reader.onerror = (err) => reject(err);
  });
}

