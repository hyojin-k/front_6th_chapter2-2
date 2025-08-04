import { useCallback, useEffect, useState } from 'react';
import { CartItemType, CouponType } from '../../types';
import { ProductWithUI } from '../types/product';
import { getRemainingStock } from '../utils';
import { useLocalStorage } from './useLocalStorage';

export const useCart = (
  products: ProductWithUI[],
  addNotification: (message: string, type: 'success' | 'error') => void,
  selectedCoupon: CouponType | null
): {
  cart: CartItemType[];
  setCart: (cart: CartItemType[]) => void;
  addToCart: (product: ProductWithUI) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  calculateItemTotal: (item: CartItemType) => number;
  calculateCartTotal: () => {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
  };
} => {
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

  // 최대 적용 가능한 할인율 계산
  const getMaxApplicableDiscount = (item: CartItemType): number => {
    const { discounts } = item.product;
    const { quantity } = item;

    // 기본 할인율 계산 (수량에 따른 할인)
    const baseDiscount = discounts.reduce((maxDiscount, discount) => {
      return quantity >= discount.quantity && discount.rate > maxDiscount
        ? discount.rate
        : maxDiscount;
    }, 0);

    // 대량 구매 추가 할인 (10개 이상 구매시 5% 추가 할인)
    const hasBulkPurchase = cart.some((cartItem) => cartItem.quantity >= 10);
    if (hasBulkPurchase) {
      return Math.min(baseDiscount + 0.05, 0.5); // 최대 50% 할인
    }

    return baseDiscount;
  };

  // 개별 상품 총액 계산 (할인 적용)
  const calculateItemTotal = (item: CartItemType): number => {
    const { price } = item.product;
    const { quantity } = item;
    const discount = getMaxApplicableDiscount(item);

    return Math.round(price * quantity * (1 - discount));
  };

  // 장바구니 총액 계산
  const calculateCartTotal = (): {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
  } => {
    let totalBeforeDiscount = 0;
    let totalAfterDiscount = 0;

    // 각 상품의 할인 적용 전/후 금액 계산
    cart.forEach((item) => {
      const itemPrice = item.product.price * item.quantity;
      totalBeforeDiscount += itemPrice;
      totalAfterDiscount += calculateItemTotal(item);
      // totalAfterDiscount += item.product.price * item.quantity;
    });

    // 쿠폰 할인 적용
    if (selectedCoupon) {
      if (selectedCoupon.discountType === 'amount') {
        // 정액 할인
        totalAfterDiscount = Math.max(0, totalAfterDiscount - selectedCoupon.discountValue);
      } else {
        // 정률 할인
        totalAfterDiscount = Math.round(
          totalAfterDiscount * (1 - selectedCoupon.discountValue / 100)
        );
      }
    }

    return {
      totalBeforeDiscount: Math.round(totalBeforeDiscount),
      totalAfterDiscount: Math.round(totalAfterDiscount),
    };
  };

  return {
    cart,
    setCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    calculateItemTotal,
    calculateCartTotal,
  };
};
