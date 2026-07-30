import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ProductGallery } from './components/ProductGallery';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { WishlistModal } from './components/WishlistModal';
import { SearchModal } from './components/SearchModal';
import { AboutSection } from './components/AboutSection';
import { ContactModal } from './components/ContactModal';
import { AuthModal } from './components/AuthModal';
import { Toast } from './components/Toast';
import { Footer } from './components/Footer';
import { PRODUCTS } from './data/products';
import { Product, CartItem } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Cart & Wishlist local state persistence
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('real_fox_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('real_fox_wishlist');
      return saved ? JSON.parse(saved) : ['rf-001', 'rf-002'];
    } catch {
      return ['rf-001', 'rf-002'];
    }
  });

  // Modal Dialog states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Toast notification
  const [toast, setToast] = useState<{ message: string; type: 'cart' | 'wishlist' | 'info' } | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('real_fox_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error(e);
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem('real_fox_wishlist', JSON.stringify(wishlistIds));
    } catch (e) {
      console.error(e);
    }
  }, [wishlistIds]);

  const showToast = (message: string, type: 'cart' | 'wishlist' | 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Cart operations
  const handleAddToCart = (product: Product, size: string, color: string, quantity = 1) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === size &&
          item.selectedColor === color
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prev, { product, selectedSize: size, selectedColor: color, quantity }];
    });
    showToast(`Added ${quantity}x ${product.name} (${size}) to bag`, 'cart');
  };

  const handleUpdateCartQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(index);
      return;
    }
    setCartItems((prev) => {
      const updated = [...prev];
      updated[index].quantity = newQty;
      return updated;
    });
  };

  const handleRemoveCartItem = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
    showToast('Item removed from bag', 'info');
  };

  // Wishlist operations
  const handleToggleWishlist = (product: Product) => {
    setWishlistIds((prev) => {
      if (prev.includes(product.id)) {
        showToast(`Removed ${product.name} from wishlist`, 'info');
        return prev.filter((id) => id !== product.id);
      } else {
        showToast(`Saved ${product.name} to wishlist`, 'wishlist');
        return [...prev, product.id];
      }
    });
  };

  const wishlistProducts = PRODUCTS.filter((p) => wishlistIds.includes(p.id));
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const scrollToGallery = () => {
    setActiveTab('shop');
    const galleryEl = document.getElementById('product-gallery-section');
    if (galleryEl) {
      galleryEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToAbout = () => {
    setActiveTab('about');
    const aboutEl = document.getElementById('about-brand-section');
    if (aboutEl) {
      aboutEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'shop' || tab === 'new-arrivals') {
      scrollToGallery();
    } else if (tab === 'about') {
      scrollToAbout();
    } else if (tab === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-[#1E60D5] selection:text-white antialiased">
      
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        cartCount={cartCount}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
      />

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <HeroSection
          onShopClick={scrollToGallery}
          onNewArrivalsClick={scrollToGallery}
        />

        {/* Product Gallery */}
        <ProductGallery
          products={PRODUCTS}
          wishlistIds={wishlistIds}
          onQuickView={(p) => setSelectedProduct(p)}
          onAddToCart={handleAddToCart}
          onToggleWishlist={handleToggleWishlist}
        />

        {/* Brand Story Section */}
        <AboutSection />
      </main>

      {/* Footer */}
      <Footer
        onOpenContact={() => setIsContactOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Modals & Drawers */}
      <ProductDetailModal
        product={selectedProduct}
        isWishlisted={selectedProduct ? wishlistIds.includes(selectedProduct.id) : false}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
      />

      <CartDrawer
        isOpen={isCartOpen}
        cartItems={cartItems}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={() => setIsCheckoutOpen(true)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        cartItems={cartItems}
        onClose={() => setIsCheckoutOpen(false)}
        onClearCart={() => setCartItems([])}
      />

      <WishlistModal
        isOpen={isWishlistOpen}
        wishlistProducts={wishlistProducts}
        onClose={() => setIsWishlistOpen(false)}
        onRemoveFromWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
      />

      <SearchModal
        isOpen={isSearchOpen}
        products={PRODUCTS}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(user) => showToast(`Welcome back, ${user.name}!`, 'info')}
      />

      {/* Toast Feedback */}
      <Toast
        message={toast?.message || null}
        type={toast?.type || 'info'}
        onClose={() => setToast(null)}
      />
    </div>
  );
}
