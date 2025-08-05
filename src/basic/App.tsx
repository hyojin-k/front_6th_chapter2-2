import { useState } from 'react';
import { Notification, Header, AdminPage, MainPage } from './components';
import { useProduct, useCoupon, useCart, useDebounce, useNotification } from './hooks';

const App = () => {
  const { searchTerm, setSearchTerm, debouncedSearchTerm } = useDebounce();
  const { notifications, setNotifications, addNotification } = useNotification();
  const { products, addProduct, updateProduct, deleteProduct, filteredProducts } = useProduct({
    debouncedSearchTerm,
    addNotification,
  });
  const { cart, setCart, addToCart, removeFromCart, updateQuantity, totalItemCount } = useCart({
    products,
    addNotification,
  });
  const { coupons, addCoupon, deleteCoupon, selectedCoupon, setSelectedCoupon } = useCoupon({
    addNotification,
  });

  const [isAdmin, setIsAdmin] = useState(false); // 관리자 모드 여부

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 알림 메시지 표시 영역 */}
      <Notification notifications={notifications} setNotifications={setNotifications} />

      {/* 헤더 영역 */}
      <Header
        isAdmin={isAdmin}
        cart={cart}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setIsAdmin={setIsAdmin}
        totalItemCount={totalItemCount}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          // 관리자 대시보드
          <AdminPage
            products={products}
            cart={cart}
            isAdmin={isAdmin}
            addNotification={addNotification}
            coupons={coupons}
            updateProduct={updateProduct}
            addProduct={addProduct}
            deleteProduct={deleteProduct}
            addCoupon={addCoupon}
            deleteCoupon={deleteCoupon}
          />
        ) : (
          // 쇼핑몰 메인 페이지
          <MainPage
            products={products}
            cart={cart}
            isAdmin={isAdmin}
            addNotification={addNotification}
            coupons={coupons}
            filteredProducts={filteredProducts}
            debouncedSearchTerm={debouncedSearchTerm}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
            selectedCoupon={selectedCoupon}
            setSelectedCoupon={setSelectedCoupon}
            setCart={setCart}
          />
        )}
      </main>
    </div>
  );
};

export default App;
