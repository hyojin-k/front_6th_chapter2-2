import { ProductWithUI } from '../types/product';

export const formatPrice = (
  product: ProductWithUI,
  products: ProductWithUI[],
  getRemainingStock: (product: ProductWithUI) => number,
  isAdmin: boolean
): string => {
  if (product.id) {
    const findProduct = products.find((p) => p.id === product.id);
    if (findProduct && getRemainingStock(findProduct) <= 0) {
      return 'SOLD OUT'; // 재고가 없으면 SOLD OUT 표시
    }
  }

  if (isAdmin) {
    return `${product.price.toLocaleString()}원`;
  }

  return `₩${product.price.toLocaleString()}`;
};
