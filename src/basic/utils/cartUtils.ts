import { CartItemType, CouponType } from '../../types';
import { CartTotalType } from '../types/cart';

// 기본 할인율 계산 (수령 수량에 따른 할인)
const getBaseDiscount = (item: CartItemType) => {
  const { discounts } = item.product;
  const { quantity } = item;

  return discounts.reduce((maxDiscount, discount) => {
    return quantity >= discount.quantity && discount.rate > maxDiscount
      ? discount.rate
      : maxDiscount;
  }, 0);
};

// 대량 구매 추가 할인 (10개 이상 구매시 5% 추가 할인)
const getBulkPurchaseDiscount = (cart: CartItemType[]): number => {
  const hasBulkPurchase = cart.some((cartItem) => cartItem.quantity >= 10);

  return hasBulkPurchase ? 0.05 : 0;
};

// 최대 적용 가능한 할인율 계산
const getMaxApplicableDiscount = (item: CartItemType, cart: CartItemType[]): number => {
  const baseDiscount = getBaseDiscount(item);
  const bulkPurchaseDiscount = getBulkPurchaseDiscount(cart);

  return Math.min(baseDiscount + bulkPurchaseDiscount, 0.5); // 최대 50% 할인
};

// 개별 상품 총액 계산 (할인 적용)
export const calculateItemTotal = (item: CartItemType, cart: CartItemType[]): number => {
  const { price } = item.product;
  const { quantity } = item;
  const discount = getMaxApplicableDiscount(item, cart);

  return Math.round(price * quantity * (1 - discount));
};

// 장바구니 총액 계산
export const calculateCartTotal = (
  cart: CartItemType[],
  selectedCoupon: CouponType
): CartTotalType => {
  let totalBeforeDiscount = 0;
  let totalAfterDiscount = 0;

  // 각 상품의 할인 적용 전/후 금액 계산
  cart.forEach((item) => {
    const itemPrice = item.product.price * item.quantity;
    totalBeforeDiscount += itemPrice;
    totalAfterDiscount += calculateItemTotal(item, cart);
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
