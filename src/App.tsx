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
import { OwnerAdminDashboard } from './components/OwnerAdmin/OwnerAdminDashboard';
import { PRODUCTS as INITIAL_PRODUCTS } from './data/products';
import { Product, CartItem, Order, StoreSettings } from './types';

const INITIAL_SETTINGS: StoreSettings = {
  storeName: 'Real Fox Streetwear Flagship',
  currencySymbol: '$',
  taxRate: 8.5,
  lowStockThreshold: 5,
  ownerPin: '1234',
  isPinRequired: false,
  enableCardPayments: true,
  enableApplePay: true,
  enablePayPal: true,
  enableKlarna: true,
};

const INITIAL_ORDERS: Order[] = [
  {
    id: 'RF-882103',
    orderNumber: 'RF-882103',
    date: new Date().toISOString().split('T')[0],
    customerName: 'Jordan Reed',
    customerEmail: 'jordan@example.com',
    shippingAddress: '124 Market St, San Francisco, CA 94105',
    items: [
      {
        product: INITIAL_PRODUCTS[0],
        selectedSize: 'L',
        selectedColor: 'Signature Gray',
        quantity: 1,
      },
    ],
    subtotal: 85,
    tax: 7.23,
    total: 92.23,
    paymentMethod: 'Credit Card (Online)',
    status: 'Completed',
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // 1. Dynamic Inventory State with LocalStorage Persistence
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('real_fox_inventory');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // 2. Orders History Log State with LocalStorage
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('real_fox_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  // 3. Store Management Settings State
  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem('real_fox_settings');
      return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

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

  // Save Inventory to LocalStorage whenever modified
  useEffect(() => {
    try {
      localStorage.setItem('real_fox_inventory', JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  // Save Orders to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('real_fox_orders', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  // Save Settings to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('real_fox_settings', JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }, [settings]);

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

  // Inventory Management Handlers
  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    showToast(`Updated "${updatedProduct.name}" in inventory`, 'info');
  };

  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Added "${newProduct.name}" to inventory`, 'info');
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    showToast('Product removed from inventory', 'info');
  };

  const handleStockAdjust = (productId: string, delta: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const newQty = Math.max(0, p.stockQuantity + delta);
          return { ...p, stockQuantity: newQty };
        }
        return p;
      })
    );
  };

  const handleResetInventory = () => {
    setProducts(INITIAL_PRODUCTS);
    showToast('Inventory reset to initial defaults', 'info');
  };

  // Order & POS Processing Handler (automatically deducts stock)
  const handleCompleteOrder = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);

    // Deduct stock for each item sold
    setProducts((prev) =>
      prev.map((p) => {
        const itemSold = newOrder.items.find((i) => i.product.id === p.id);
        if (itemSold) {
          const remaining = Math.max(0, p.stockQuantity - itemSold.quantity);
          return { ...p, stockQuantity: remaining };
        }
        return p;
      })
    );

    showToast(`Order ${newOrder.orderNumber} placed & inventory updated!`, 'info');
  };

  // Order Refund Handler (restores stock back to inventory)
  const handleRefundOrder = (orderId: string) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return;

    // Mark order status as Refunded
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'Refunded' } : o))
    );

    // Restore item stock
    setProducts((prev) =>
      prev.map((p) => {
        const itemRefunded = targetOrder.items.find((i) => i.product.id === p.id);
        if (itemRefunded) {
          return { ...p, stockQuantity: p.stockQuantity + itemRefunded.quantity };
        }
        return p;
      })
    );

    showToast(`Order ${targetOrder.orderNumber} refunded & stock restored`, 'info');
  };

  // Order Update Tracking & Fulfillment Handler
  const handleUpdateOrder = (updatedOrder: Order) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
    );
    showToast(`Order ${updatedOrder.orderNumber} status and tracking updated!`, 'info');
  };

  // Cart operations
  const handleAddToCart = (product: Product, size: string, color: string, quantity = 1) => {
    if (product.stockQuantity <= 0) {
      showToast(`Sorry, ${product.name} is currently out of stock!`, 'info');
      return;
    }

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

  const wishlistProducts = products.filter((p) => wishlistIds.includes(p.id));
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
        settings={settings}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
        onOpenOwnerAdmin={() => setActiveTab('admin')}
      />

      {/* Main Content View Switcher */}
      <main className="flex-grow">
        {activeTab === 'admin' ? (
          <OwnerAdminDashboard
            products={products}
            orders={orders}
            settings={settings}
            onUpdateProduct={handleUpdateProduct}
            onAddProduct={handleAddProduct}
            onDeleteProduct={handleDeleteProduct}
            onStockAdjust={handleStockAdjust}
            onCompletePosSale={handleCompleteOrder}
            onUpdateOrder={handleUpdateOrder}
            onRefundOrder={handleRefundOrder}
            onUpdateSettings={setSettings}
            onResetInventory={handleResetInventory}
            onBackToStore={() => setActiveTab('home')}
          />
        ) : (
          <>
            {/* Hero Section */}
            <HeroSection
              onShopClick={scrollToGallery}
              onNewArrivalsClick={scrollToGallery}
            />

            {/* Product Gallery with Real Inventory State */}
            <ProductGallery
              products={products}
              wishlistIds={wishlistIds}
              onQuickView={(p) => setSelectedProduct(p)}
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
            />

            {/* Brand Story Section */}
            <AboutSection />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer
        settings={settings}
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
        settings={settings}
        onClose={() => setIsCheckoutOpen(false)}
        onClearCart={() => setCartItems([])}
        onCompleteOrder={handleCompleteOrder}
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
        products={products}
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

