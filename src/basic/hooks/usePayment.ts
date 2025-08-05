import { useCallback } from 'react';
import { CartItemType } from '../../types';
import { CouponType } from '../../types';
import { CartTotalType } from '../types/cart';
import { calculateCartTotal } from '../utils/calculateUtils';

export const usePayment = (
  addNotification: (message: string, type: 'success' | 'error') => void,
  setCart: (cart: CartItemType[]) => void,
  setSelectedCoupon: (coupon: CouponType | null) => void,
  cart: CartItemType[],
  selectedCoupon: CouponType | null
): { totals: CartTotalType; completeOrder: () => void } => {
  // 주문 완료 처리
  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(`주문이 완료되었습니다. 주문번호: ${orderNumber}`, 'success');
    setCart([]);
    setSelectedCoupon(null);
  }, [addNotification]);

  // 장바구니 총액 계산
  const totals = selectedCoupon
    ? calculateCartTotal(cart, selectedCoupon)
    : { totalBeforeDiscount: 0, totalAfterDiscount: 0 };

  return { totals, completeOrder };
};
