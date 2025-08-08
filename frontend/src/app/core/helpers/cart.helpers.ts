import { ProductAttributes } from '@shared/dto/product.dto';

/**
 * Normaliza el product_id a string para comparaciones consistentes
 */
export function normalizeProductId(id: string | number | undefined | null): string {
  if (id === undefined || id === null) {
    return '';
  }
  return String(id);
}

/**
 * Compara dos product_ids de forma segura
 */
export function isSameProduct(productA: ProductAttributes, productB: ProductAttributes): boolean {
  return normalizeProductId(productA.product_id) === normalizeProductId(productB.product_id);
}

/**
 * Busca un producto en el carrito por ID
 */
export function findProductInCart(
  cartItems: { product: ProductAttributes; quantity: number }[], 
  productId: string | number
): number {
  return cartItems.findIndex(
    item => normalizeProductId(item.product.product_id) === normalizeProductId(productId)
  );
}

/**
 * Valida que un producto tenga los campos requeridos
 */
export function isValidProduct(product: ProductAttributes): boolean {
  return !!(
    product &&
    product.product_id &&
    product.modelo &&
    typeof product.costo_m2 === 'number' &&
    product.costo_m2 > 0
  );
}