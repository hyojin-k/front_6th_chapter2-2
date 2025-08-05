import { Cart, Coupon, Payment, Product } from '..';
import { CartItemType, CouponType } from '../../../types';
import { ProductWithUI } from '../../types/product';
import { usePayment } from '../../hooks/usePayment';

export const MainPage = ({
  products,
  filteredProducts,
  debouncedSearchTerm,
  addToCart,
  isAdmin,
  cart,
  calculateItemTotal,
  removeFromCart,
  updateQuantity,
  coupons,
  selectedCoupon,
  applyCoupon,
  setSelectedCoupon,
  addNotification,
  setCart,
  calculateCartTotal,
}: {
  products: ProductWithUI[];
  filteredProducts: ProductWithUI[];
  debouncedSearchTerm: string;
  addToCart: (product: ProductWithUI) => void;
  isAdmin: boolean;
  cart: CartItemType[];
  calculateItemTotal: (item: CartItemType) => number;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  coupons: CouponType[];
  selectedCoupon: CouponType | null;
  applyCoupon: (coupon: CouponType) => void;
  setSelectedCoupon: (coupon: CouponType | null) => void;
  addNotification: (message: string, type: 'success' | 'error') => void;
  setCart: (cart: CartItemType[]) => void;
  calculateCartTotal: () => { totalBeforeDiscount: number; totalAfterDiscount: number };
}) => {
  const { totals, completeOrder } = usePayment(
    addNotification,
    setCart,
    setSelectedCoupon,
    calculateCartTotal
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        {/* 상품 목록 섹션 */}
        <Product
          products={products}
          filteredProducts={filteredProducts}
          debouncedSearchTerm={debouncedSearchTerm}
          addToCart={addToCart}
          isAdmin={isAdmin}
          cart={cart}
        />
      </div>
      {/* 사이드바 - 장바구니 및 결제 정보 */}
      <div className="lg:col-span-1">
        <div className="sticky top-24 space-y-4">
          {/* 장바구니 섹션 */}
          <Cart
            cart={cart}
            calculateItemTotal={calculateItemTotal}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
          />
          {/* 쿠폰 및 결제 정보 (장바구니에 상품이 있을 때만 표시) */}
          {cart.length > 0 && (
            <>
              {/* 쿠폰 섹션 */}
              <Coupon
                coupons={coupons}
                selectedCoupon={selectedCoupon}
                applyCoupon={applyCoupon}
                setSelectedCoupon={setSelectedCoupon}
              />

              {/* 결제 정보 섹션 */}
              <Payment totals={totals} completeOrder={completeOrder} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
