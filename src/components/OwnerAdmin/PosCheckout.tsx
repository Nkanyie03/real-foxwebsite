import React, { useState } from 'react';
import { Search, ShoppingBag, Plus, Minus, Trash2, CheckCircle2, Receipt, DollarSign, CreditCard, User, Sparkles } from 'lucide-react';
import { Product, CartItem, Order, StoreSettings } from '../../types';

interface PosCheckoutProps {
  products: Product[];
  settings: StoreSettings;
  onCompleteSale: (newOrder: Order) => void;
}

export const PosCheckout: React.FC<PosCheckoutProps> = ({
  products,
  settings,
  onCompleteSale,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [posCart, setPosCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState('Walk-in Customer');
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Credit Card' | 'Mobile Pay'>('Cash');
  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleAddToCart = (product: Product) => {
    if (product.stockQuantity <= 0) return;
    const defaultColor = product.colors[0]?.name || 'Standard';
    const defaultSize = product.sizes[0] || 'M';

    setPosCart((prev) => {
      const existing = prev.find(
        (item) =>
          item.product.id === product.id &&
          item.selectedColor === defaultColor &&
          item.selectedSize === defaultSize
      );

      if (existing) {
        if (existing.quantity >= product.stockQuantity) return prev;
        return prev.map((item) =>
          item === existing ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, selectedColor: defaultColor, selectedSize: defaultSize, quantity: 1 }];
    });
  };

  const updateQuantity = (index: number, delta: number) => {
    setPosCart((prev) => {
      const updated = [...prev];
      const target = updated[index];
      const newQty = target.quantity + delta;

      if (newQty <= 0) {
        return updated.filter((_, i) => i !== index);
      }
      if (newQty > target.product.stockQuantity) {
        return prev;
      }
      updated[index] = { ...target, quantity: newQty };
      return updated;
    });
  };

  const removeItem = (index: number) => {
    setPosCart((prev) => prev.filter((_, i) => i !== index));
  };

  const subtotal = posCart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const tax = subtotal * (settings.taxRate / 100);
  const total = subtotal + tax;

  const handleProcessSale = () => {
    if (posCart.length === 0) return;

    const orderNum = `POS-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      timestamp: Date.now(),
      items: posCart,
      subtotal,
      tax,
      shipping: 0,
      discount: 0,
      total,
      customerName: customerName || 'Walk-in Customer',
      customerEmail: 'in-store-sale@realfox.com',
      shippingAddress: 'In-Store Register Terminal 1',
      paymentMethod,
      status: 'Completed',
    };

    onCompleteSale(newOrder);
    setLastOrder(newOrder);
    setPosCart([]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Product Selector Left Column */}
      <div className="lg:col-span-2 space-y-4">
        
        {/* Search & Category Filter */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by product name or SKU (e.g. RF-HD-001)..."
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-md text-xs font-semibold outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {['All', 'Hoodies', 'Jackets', 'Caps & Headwear', 'T-Shirts', 'Pants'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Quick-Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {filteredProducts.map((p) => {
            const isOutOfStock = p.stockQuantity <= 0;
            return (
              <div
                key={p.id}
                onClick={() => !isOutOfStock && handleAddToCart(p)}
                className={`bg-white p-3 rounded-xl border transition-all flex flex-col justify-between cursor-pointer group ${
                  isOutOfStock
                    ? 'opacity-50 border-slate-200 cursor-not-allowed'
                    : 'border-slate-200 hover:border-indigo-600 hover:shadow-md'
                }`}
              >
                <div>
                  <div className="relative h-28 w-full rounded-lg overflow-hidden mb-2 bg-slate-100">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[10px] font-black uppercase bg-slate-900/80 text-white backdrop-blur-xs font-mono">
                      SKU: {p.sku}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{p.name}</h4>
                  <p className="text-[11px] text-slate-500 capitalize">{p.category}</p>
                </div>

                <div className="mt-2 flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-xs font-black text-indigo-600">
                    {settings.currencySymbol}{p.price.toFixed(2)}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      isOutOfStock
                        ? 'bg-red-100 text-red-700'
                        : p.stockQuantity <= settings.lowStockThreshold
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {isOutOfStock ? 'OUT' : `${p.stockQuantity} in stock`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* POS Cart Right Column */}
      <div className="space-y-4">
        
        {/* Register Cart Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col h-full min-h-[480px]">
          
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-indigo-600" />
              <h3 className="text-xs font-black uppercase text-slate-900 tracking-wider">
                REGISTER CART ({posCart.reduce((a, b) => a + b.quantity, 0)})
              </h3>
            </div>
            {posCart.length > 0 && (
              <button
                onClick={() => setPosCart([])}
                className="text-[11px] text-red-600 hover:underline font-bold"
              >
                Clear
              </button>
            )}
          </div>

          {/* Customer Name */}
          <div className="mb-3">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
              Customer Name / Reference
            </label>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-transparent text-xs font-semibold outline-none"
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto space-y-2 max-h-[260px] pr-1">
            {posCart.length === 0 ? (
              <div className="h-40 flex flex-col items-center justify-center text-slate-400 text-xs">
                <ShoppingBag className="w-8 h-8 mb-2 stroke-1 opacity-50" />
                <p>Click products on left to add to sale</p>
              </div>
            ) : (
              posCart.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-200/80 text-xs"
                >
                  <div className="flex-1 min-w-0 pr-2">
                    <p className="font-bold text-slate-900 truncate">{item.product.name}</p>
                    <p className="text-[10px] text-slate-500">
                      {item.selectedSize} • {item.selectedColor}
                    </p>
                    <p className="font-extrabold text-indigo-600 text-[11px]">
                      {settings.currencySymbol}{(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateQuantity(index, -1)}
                      className="w-5 h-5 flex items-center justify-center bg-white border border-slate-300 rounded text-slate-600 hover:bg-slate-200 font-bold"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-5 text-center font-bold text-xs">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(index, 1)}
                      className="w-5 h-5 flex items-center justify-center bg-white border border-slate-300 rounded text-slate-600 hover:bg-slate-200 font-bold"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => removeItem(index)}
                      className="p-1 text-slate-400 hover:text-red-500 ml-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Payment Method Selector */}
          <div className="pt-3 border-t border-slate-200 mt-3">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">
              Payment Method
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['Cash', 'Credit Card', 'Mobile Pay'] as const).map((method) => (
                <button
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`py-1.5 px-2 rounded-md text-[11px] font-bold border transition-all ${
                    paymentMethod === method
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          {/* Totals Breakdown */}
          <div className="pt-3 border-t border-slate-200 mt-3 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-semibold">{settings.currencySymbol}{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Tax ({settings.taxRate}%)</span>
              <span className="font-semibold">{settings.currencySymbol}{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-black text-slate-900 pt-1 border-t border-slate-100">
              <span>Total Sale</span>
              <span className="text-indigo-600">{settings.currencySymbol}{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Process Sale Button */}
          <button
            onClick={handleProcessSale}
            disabled={posCart.length === 0}
            className={`w-full mt-4 py-3 rounded-md text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md ${
              posCart.length === 0
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-950/20'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>COMPLETE POS SALE</span>
          </button>
        </div>

        {/* Last Sale Receipt Modal / Info */}
        {lastOrder && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Sale Completed: {lastOrder.orderNumber}</span>
            </div>
            <p className="text-[11px] text-emerald-700">
              Total: {settings.currencySymbol}{lastOrder.total.toFixed(2)} ({lastOrder.paymentMethod}) • Inventory updated automatically.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
