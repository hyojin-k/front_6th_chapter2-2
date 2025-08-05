import { CartItemType } from '../../types';
import { SearchInput } from '../ui/SearchInput';
import { CartIcon } from '../icons';

interface HeaderPropsType {
  isAdmin: boolean;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  setIsAdmin: (value: boolean) => void;
  cart: CartItemType[];
  totalItemCount: number;
}
export const Header = ({
  isAdmin,
  searchTerm,
  setSearchTerm,
  setIsAdmin,
  cart,
  totalItemCount,
}: HeaderPropsType) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40 border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center flex-1">
            <h1 className="text-xl font-semibold text-gray-800">SHOP</h1>
            {/* 검색창 */}
            {!isAdmin && (
              <div className="ml-8 flex-1 max-w-md">
                <SearchInput
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  placeholder="상품 검색..."
                />
              </div>
            )}
          </div>
          <nav className="flex items-center space-x-4">
            {/* 관리자 모드 토글 버튼 */}
            <button
              onClick={() => setIsAdmin(!isAdmin)}
              className={`px-3 py-1.5 text-sm rounded transition-colors ${
                isAdmin ? 'bg-gray-800 text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {isAdmin ? '쇼핑몰로 돌아가기' : '관리자 페이지로'}
            </button>
            {/* 장바구니 아이콘 */}
            {!isAdmin && (
              <div className="relative">
                <CartIcon />
                {/* 장바구니 아이템 수 표시 */}
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItemCount}
                  </span>
                )}
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
