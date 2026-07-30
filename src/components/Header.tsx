import React from 'react';
import { Search, Heart, ShoppingBag, User } from 'lucide-react';
import { RealFoxLogo } from './RealFoxLogo';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenSearch: () => void;
  onOpenAuth: () => void;
  onOpenContact: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenSearch,
  onOpenAuth,
  onOpenContact,
}) => {
  const navItems = [
    { id: 'home', label: 'HOME' },
    { id: 'shop', label: 'SHOP' },
    { id: 'new-arrivals', label: 'NEW ARRIVALS' },
    { id: 'about', label: 'ABOUT' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs transition-all">
      {/* Top indigo accent bar from Professional Polish theme */}
      <div className="h-1.5 bg-indigo-600 w-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0 cursor-pointer" onClick={() => setActiveTab('home')}>
            <RealFoxLogo size="md" />
          </div>

          {/* Navigation Links - Center */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-3">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-4 py-2 rounded-md text-xs font-bold tracking-wider transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-3 lg:space-x-5">
            {/* Sign in */}
            <button
              id="header-sign-in"
              onClick={onOpenAuth}
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
            >
              <User className="w-4 h-4 text-slate-500" />
              <span>Sign in</span>
            </button>

            {/* Vertical Divider */}
            <div className="hidden sm:block h-4 w-px bg-slate-200" />

            {/* Search Icon */}
            <button
              id="header-search"
              onClick={onOpenSearch}
              className="p-2 text-slate-700 hover:text-indigo-600 hover:bg-slate-50 rounded-full transition-colors relative"
              title="Search products"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Icon */}
            <button
              id="header-wishlist"
              onClick={onOpenWishlist}
              className="p-2 text-slate-700 hover:text-indigo-600 hover:bg-slate-50 rounded-full transition-colors relative"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-indigo-600 text-white text-[10px] font-bold rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Icon */}
            <button
              id="header-cart"
              onClick={onOpenCart}
              className="p-2 text-slate-700 hover:text-indigo-600 hover:bg-slate-50 rounded-full transition-colors relative"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-indigo-600 text-white text-[10px] font-bold rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Contact Us CTA Button matching Professional Polish */}
            <button
              id="header-contact-us"
              onClick={onOpenContact}
              className="hidden lg:inline-flex items-center justify-center px-6 py-2.5 rounded-md text-xs font-bold tracking-wider text-white bg-slate-900 hover:bg-slate-800 active:scale-95 transition-all shadow-xs"
            >
              CONTACT US
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer Bar */}
        <div className="md:hidden flex items-center justify-around border-t border-slate-100 py-2 bg-slate-50">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`text-[11px] font-bold px-2 py-1 rounded ${
                activeTab === item.id ? 'text-indigo-600 bg-white shadow-xs' : 'text-slate-600'
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={onOpenContact}
            className="text-[11px] font-bold text-indigo-600 px-2 py-1"
          >
            CONTACT
          </button>
        </div>
      </div>
    </header>
  );
};
