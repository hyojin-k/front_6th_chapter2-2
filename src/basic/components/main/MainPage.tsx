import { Cart, Coupon, Payment, Product } from '.';
import { CartItemType, CouponType } from '../../../types';
import { ProductWithUI } from '../../types/product';

export const MainPage = ({
  products,
  isAdmin,
  cart,
  coupons,
  addNotification,
  filteredProducts,
  debouncedSearchTerm,
  addToCart,
  removeFromCart,
  updateQuantity,
  selectedCoupon,
  setSelectedCoupon,
  setCart,
}: {
  products: ProductWithUI[];
  isAdmin: boolean;
  cart: CartItemType[];
  addNotification: (message: string, type: 'success' | 'error') => void;
  coupons: CouponType[];
  filteredProducts: ProductWithUI[];
  addToCart: (product: ProductWithUI) => void;
  debouncedSearchTerm: string;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  selectedCoupon: CouponType | null;
  setSelectedCoupon: (coupon: CouponType | null) => void;
  setCart: (cart: CartItemType[]) => void;
}) => {
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
          <Cart cart={cart} removeFromCart={removeFromCart} updateQuantity={updateQuantity} />
          {/* 쿠폰 및 결제 정보 (장바구니에 상품이 있을 때만 표시) */}
          {cart.length > 0 && (
            <>
              {/* 쿠폰 섹션 */}
              <Coupon
                cart={cart}
                coupons={coupons}
                selectedCoupon={selectedCoupon}
                setSelectedCoupon={setSelectedCoupon}
              />

              {/* 결제 정보 섹션 */}
              <Payment
                addNotification={addNotification}
                setCart={setCart}
                setSelectedCoupon={setSelectedCoupon}
                cart={cart}
                selectedCoupon={selectedCoupon}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
