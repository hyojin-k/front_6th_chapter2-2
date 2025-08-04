import { useState } from 'react';
import { Notification, Header, Coupon, Product, Cart, AdminPage, Payment } from './components';
import { useProduct, useDebounce, useNotification, useCoupon, useCart, usePayment } from './hooks';
import { CouponType } from '../types';

const App = () => {
  const { searchTerm, setSearchTerm, debouncedSearchTerm } = useDebounce();
  const { products, addProduct, updateProduct, deleteProduct, filteredProducts } =
    useProduct(debouncedSearchTerm);
  const { notifications, setNotifications, addNotification } = useNotification();

  const [selectedCoupon, setSelectedCoupon] = useState<CouponType | null>(null); // 선택된 쿠폰

  const {
    cart,
    setCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    calculateCartTotal,
    calculateItemTotal,
  } = useCart(products, addNotification, selectedCoupon);
  const { coupons, applyCoupon, addCoupon, deleteCoupon } = useCoupon(
    calculateCartTotal,
    addNotification,
    selectedCoupon,
    setSelectedCoupon
  );
  const { totals, completeOrder } = usePayment(
    addNotification,
    setCart,
    setSelectedCoupon,
    calculateCartTotal
  );
  // UI 상태 관리
  // const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null); // 선택된 쿠폰
  const [isAdmin, setIsAdmin] = useState(false); // 관리자 모드 여부

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 알림 메시지 표시 영역 */}
      <Notification notifications={notifications} setNotifications={setNotifications} />

      {/* 헤더 영역 */}
      <Header
        isAdmin={isAdmin}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setIsAdmin={setIsAdmin}
        cart={cart}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          // 관리자 대시보드
          <AdminPage
            products={products}
            cart={cart}
            isAdmin={isAdmin}
            updateProduct={updateProduct}
            addProduct={addProduct}
            deleteProduct={deleteProduct}
            addNotification={addNotification}
            coupons={coupons}
            addCoupon={addCoupon}
            deleteCoupon={deleteCoupon}
          />
        ) : (
          // 쇼핑몰 메인 페이지
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
        )}
      </main>
    </div>
  );
};

export default App;
