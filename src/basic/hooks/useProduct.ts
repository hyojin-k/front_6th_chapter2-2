import { useState, useEffect, useCallback } from 'react';
import { ProductWithUI } from '../types/product';
import { initialProducts } from '../constants';
import { useNotification } from './useNotification';
import { useLocalStorage } from './useLocalStorage';

export const useProduct = (debouncedSearchTerm: string) => {
  const { addNotification } = useNotification();

  // 상품 목록 상태 관리 (로컬스토리지에서 복원)
  const [products, setProducts] = useLocalStorage<ProductWithUI[]>('products', initialProducts);

  // 상품 데이터 로컬스토리지 저장
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  // 상품 추가 (관리자 기능)
  const addProduct = useCallback((newProduct: Omit<ProductWithUI, 'id'>) => {
    const product: ProductWithUI = {
      ...newProduct,
      id: `p${Date.now()}`,
    };
    setProducts((prev) => [...prev, product]);
    addNotification(`${newProduct.name} 상품이 추가되었습니다.`, 'success');
    return product;
  }, []);

  // 상품 수정 (관리자 기능)
  const updateProduct = useCallback((productId: string, updates: Partial<ProductWithUI>) => {
    setProducts((prev) =>
      prev.map((product) => (product.id === productId ? { ...product, ...updates } : product))
    );
    addNotification(`${updates.name} 상품이 수정되었습니다.`, 'success');
  }, []);

  // 상품 삭제 (관리자 기능)
  const deleteProduct = useCallback((productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    addNotification(`${productId} 상품이 삭제되었습니다.`, 'success');
  }, []);

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
    addProduct,
    updateProduct,
    deleteProduct,
    filteredProducts,
  };
};
