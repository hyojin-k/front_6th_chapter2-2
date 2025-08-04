import { useCallback } from 'react';
import { CouponType } from '../../types';
import { initialCoupons } from '../constants/coupon';
import { useLocalStorage } from './useLocalStorage';

export const useCoupon = (
  calculateCartTotal: () => { totalAfterDiscount: number },
  addNotification: (message: string, type: 'success' | 'error') => void,
  selectedCoupon: CouponType | null,
  setSelectedCoupon: (coupon: CouponType | null) => void
) => {
  // 쿠폰 목록 상태 관리 (로컬스토리지에서 복원)
  const [coupons, setCoupons] = useLocalStorage<CouponType[]>('coupons', initialCoupons);

  // 쿠폰 적용
  const applyCoupon = useCallback(
    (coupon: CouponType) => {
      const currentTotal = calculateCartTotal().totalAfterDiscount;

      // 정률 쿠폰은 10,000원 이상 구매시에만 사용 가능
      if (currentTotal < 10000 && coupon.discountType === 'percentage') {
        addNotification('percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.', 'error');
        return;
      }

      setSelectedCoupon(coupon);
      addNotification('쿠폰이 적용되었습니다.', 'success');
    },
    [addNotification, calculateCartTotal]
  );

  // 쿠폰 추가 (관리자 기능)
  const addCoupon = useCallback(
    (newCoupon: CouponType) => {
      const existingCoupon = coupons.find((c) => c.code === newCoupon.code);
      if (existingCoupon) {
        addNotification('이미 존재하는 쿠폰 코드입니다.', 'error');
        return;
      }
      setCoupons((prev) => [...prev, newCoupon]);
      addNotification('쿠폰이 추가되었습니다.', 'success');
    },
    [coupons, addNotification]
  );

  // 쿠폰 삭제 (관리자 기능)
  const deleteCoupon = useCallback(
    (couponCode: string) => {
      setCoupons((prev) => prev.filter((c) => c.code !== couponCode));
      if (selectedCoupon?.code === couponCode) {
        setSelectedCoupon(null); // 삭제된 쿠폰이 선택되어 있으면 선택 해제
      }
      addNotification('쿠폰이 삭제되었습니다.', 'success');
    },
    [selectedCoupon, addNotification]
  );

  return { coupons, setCoupons, applyCoupon, addCoupon, deleteCoupon };
};
