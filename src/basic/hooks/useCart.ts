import { useCallback, useEffect, useState } from 'react';
import { CartItemType } from '../../types';
import { ProductWithUI } from '../types/product';
import { getRemainingStock } from '../utils';
import { useLocalStorage } from './useLocalStorage';

interface UseCartPropsType {
  products: ProductWithUI[];
  addNotification: (message: string, type: 'success' | 'error') => void;
}

export const useCart = ({ products, addNotification }: UseCartPropsType) => {
  // 장바구니 상태 관리 (로컬스토리지에서 복원)
  const [cart, setCart] = useLocalStorage<CartItemType[]>('cart', []);

  // 장바구니 데이터 로컬스토리지 저장
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
    } else {
      localStorage.removeItem('cart');
    }
  }, [cart]);

  // 장바구니 총 아이템 수 상태
  const [totalItemCount, setTotalItemCount] = useState(0);

  // 장바구니 아이템 수 업데이트
  useEffect(() => {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    setTotalItemCount(count);
  }, [cart]);

  // 장바구니에 상품 추가
  const addToCart = useCallback(
    (product: ProductWithUI) => {
      const remainingStock = getRemainingStock(product, cart);
      if (remainingStock <= 0) {
        addNotification('재고가 부족합니다!', 'error');
        return;
      }

      setCart((prevCart) => {
        const existingItem = prevCart.find((item) => item.product.id === product.id);

        if (existingItem) {
          const newQuantity = existingItem.quantity + 1;

          // 재고 초과 체크
          if (newQuantity > product.stock) {
            addNotification(`재고는 ${product.stock}개까지만 있습니다.`, 'error');
            return prevCart;
          }

          return prevCart.map((item) =>
            item.product.id === product.id ? { ...item, quantity: newQuantity } : item
          );
        }

        return [...prevCart, { product, quantity: 1 }];
      });

      addNotification('장바구니에 담았습니다', 'success');
    },
    [cart, addNotification]
  );

  // 장바구니에서 상품 제거
  const removeFromCart = useCallback((productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  }, []);

  // 장바구니 상품 수량 업데이트
  const updateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
      }

      const product = products.find((p) => p.id === productId);
      if (!product) return;

      const maxStock = product.stock;
      if (newQuantity > maxStock) {
        addNotification(`재고는 ${maxStock}개까지만 있습니다.`, 'error');
        return;
      }

      setCart((prevCart) =>
        prevCart.map((item) =>
          item.product.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    },
    [products, removeFromCart, addNotification]
  );

  return {
    cart,
    setCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    totalItemCount,
  };
};
