import { useState, useCallback, useEffect } from 'react';
import { Notification, Header, Coupon, Product, Cart } from './components';
import { useProduct, useDebounce, useNotification, useCoupon, useCart } from './hooks';
import { CouponType } from '../types';
import { AdminPage } from './components/admin/AdminPage';

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

  // UI 상태 관리
  // const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null); // 선택된 쿠폰
  const [isAdmin, setIsAdmin] = useState(false); // 관리자 모드 여부

  // 쿠폰 데이터 로컬스토리지 저장
  useEffect(() => {
    localStorage.setItem('coupons', JSON.stringify(coupons));
  }, [coupons]);

  // 장바구니 데이터 로컬스토리지 저장
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
    } else {
      localStorage.removeItem('cart');
    }
  }, [cart]);

  // 주문 완료 처리
  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(`주문이 완료되었습니다. 주문번호: ${orderNumber}`, 'success');
    setCart([]);
    setSelectedCoupon(null);
  }, [addNotification]);

  // 장바구니 총액 계산
  const totals = calculateCartTotal();

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
                    <section className="bg-white rounded-lg border border-gray-200 p-4">
                      <h3 className="text-lg font-semibold mb-4">결제 정보</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">상품 금액</span>
                          <span className="font-medium">
                            {totals.totalBeforeDiscount.toLocaleString()}원
                          </span>
                        </div>
                        {/* 할인 금액 표시 */}
                        {totals.totalBeforeDiscount - totals.totalAfterDiscount > 0 && (
                          <div className="flex justify-between text-red-500">
                            <span>할인 금액</span>
                            <span>
                              -
                              {(
                                totals.totalBeforeDiscount - totals.totalAfterDiscount
                              ).toLocaleString()}
                              원
                            </span>
                          </div>
                        )}
                        {/* 최종 결제 금액 */}
                        <div className="flex justify-between py-2 border-t border-gray-200">
                          <span className="font-semibold">결제 예정 금액</span>
                          <span className="font-bold text-lg text-gray-900">
                            {totals.totalAfterDiscount.toLocaleString()}원
                          </span>
                        </div>
                      </div>

                      {/* 결제 버튼 */}
                      <button
                        onClick={completeOrder}
                        className="w-full mt-4 py-3 bg-yellow-400 text-gray-900 rounded-md font-medium hover:bg-yellow-500 transition-colors"
                      >
                        {totals.totalAfterDiscount.toLocaleString()}원 결제하기
                      </button>

                      <div className="mt-3 text-xs text-gray-500 text-center">
                        <p>* 실제 결제는 이루어지지 않습니다</p>
                      </div>
                    </section>
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
