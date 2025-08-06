import { useState } from 'react';
import { AdminPage, MainPage } from './pages';
import { Header, Notification } from './components';
import { useDebounce, useLocalStorage, useNotification } from './hooks';
import { useCart } from './entities/cart';
import { initialCoupons, useCoupon } from './entities/coupon';
import { initialProducts, useProductSearch, ProductWithUI } from './entities/product';
import { CartItemType, CouponType } from '@/types';

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  const [products, setProducts] = useLocalStorage<ProductWithUI[]>('products', initialProducts);
  const [cart, setCart] = useLocalStorage<CartItemType[]>('cart', []);
  const [coupons, setCoupons] = useState<CouponType[]>(initialCoupons);

  const { searchTerm, setSearchTerm, debouncedSearchTerm } = useDebounce();
  const { notifications, setNotifications, addNotification } = useNotification();
  const { filteredProducts } = useProductSearch({
    debouncedSearchTerm,
    products,
  });
  const { addToCart, removeFromCart, updateQuantity, totalItemCount } = useCart({
    products,
    addNotification,
    cart,
    setCart,
  });
  const { addCoupon, deleteCoupon, selectedCoupon, setSelectedCoupon } = useCoupon({
    coupons,
    setCoupons,
    addNotification,
  });

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
            setProducts={setProducts}
            cart={cart}
            isAdmin={isAdmin}
            addNotification={addNotification}
            coupons={coupons}
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
