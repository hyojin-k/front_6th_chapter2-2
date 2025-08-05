import { useState } from 'react';
import { CouponType } from '../../types';

export const useCouponForm = () => {
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [couponForm, setCouponForm] = useState({
    name: '',
    code: '',
    discountType: 'amount' as 'amount' | 'percentage',
    discountValue: 0,
  });

  // 쿠폰 폼 제출 처리
  const handleCouponSubmit = (e: React.FormEvent, addCoupon: (coupon: CouponType) => void) => {
    e.preventDefault();
    addCoupon(couponForm);
    // 폼 초기화
    setCouponForm({
      name: '',
      code: '',
      discountType: 'amount',
      discountValue: 0,
    });
    setShowCouponForm(false);
  };

  return {
    showCouponForm,
    setShowCouponForm,
    couponForm,
    setCouponForm,
    handleCouponSubmit,
  };
};
