/**
 * Determina si una categoría corresponde a Prendas de Vestir, Moda o Calzado,
 * las únicas que deben gestionar y mostrar Tallas.
 * Categorías como Tecnología, Celulares, Hogar, Juguetería, Belleza NO llevan tallas.
 */
export function isApparelOrFootwearCategory(category) {
  if (!category) return false;
  const lower = category.toLowerCase();
  return (
    lower.includes('moda') ||
    lower.includes('confecci') ||
    lower.includes('calzado') ||
    lower.includes('cuero') ||
    lower.includes('ropa') ||
    lower.includes('zapato') ||
    lower.includes('jean') ||
    lower.includes('buzo')
  );
}

