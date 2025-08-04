import { CouponType } from '../../types';

// 초기 쿠폰 데이터
export const initialCoupons: CouponType[] = [
  {
    name: '5000원 할인',
    code: 'AMOUNT5000',
    discountType: 'amount', // 정액 할인
    discountValue: 5000,
  },
  {
    name: '10% 할인',
    code: 'PERCENT10',
    discountType: 'percentage', // 정률 할인
    discountValue: 10,
  },
];
