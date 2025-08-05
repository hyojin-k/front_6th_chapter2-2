import { ProductWithUI } from '../types/product';
import { initialProducts } from '../constants';
import { useLocalStorage } from './useLocalStorage';

interface UseProductPropsType {
  debouncedSearchTerm: string;
}

export const useProduct = ({ debouncedSearchTerm }: UseProductPropsType) => {
  // 상품 목록 상태 관리 (로컬스토리지에서 복원)
  const [products, setProducts] = useLocalStorage<ProductWithUI[]>('products', initialProducts);

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
    setProducts,
    filteredProducts,
  };
};
