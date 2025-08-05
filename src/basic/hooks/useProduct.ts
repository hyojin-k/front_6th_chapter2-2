import { ProductWithUI } from '../types/product';

interface UseProductPropsType {
  products: ProductWithUI[];
  debouncedSearchTerm: string;
}

export const useProduct = ({ products, debouncedSearchTerm }: UseProductPropsType) => {
  // 검색어에 따른 상품 필터링
  const filteredProducts = debouncedSearchTerm
    ? products.filter(
        (product) =>
          product.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          (product.description &&
            product.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
      )
    : products;

  return {
    products,
    filteredProducts,
  };
};
