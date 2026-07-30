import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Truck, Tag, Check } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  cartItems: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  cartItems,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) => {
  if (!isOpen) return null;

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoMessage, setPromoMessage] = useState<string | null>(null);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const discountAmount = (subtotal * discountPercent) / 100;
  const finalTotal = Math.max(0, subtotal - discountAmount);
  const freeShippingThreshold = 100;
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = freeShippingThreshold - subtotal;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'REALFOX10') {
      setDiscountPercent(10);
      setPromoMessage('10% VIP Discount Applied!');
    } else if (promoCode.trim().toUpperCase() === 'STREETWEAR20') {
      setDiscountPercent(20);
      setPromoMessage('20% Streetwear Season Discount Applied!');
    } else {
      setPromoMessage('Invalid promo code. Try REALFOX10');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end">
      <div className="relative bg-white w-full max-w-md h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-black text-slate-900 uppercase tracking-wide">
              YOUR SHOPPING BAG ({cartItems.reduce((a, b) => a + b.quantity, 0)})
            </h2>
          </div>
          <button
            id="close-cart-drawer"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-900 bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-slate-50 p-4 border-b border-slate-200">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
            <span className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-indigo-600" />
              {remainingForFreeShipping <= 0
                ? ' You unlocked FREE Express Shipping!'
                : `Add $${remainingForFreeShipping.toFixed(2)} more for FREE Shipping`}
            </span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full transition-all duration-300 rounded-full"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cartItems.length > 0 ? (
            cartItems.map((item, index) => (
              <div
                key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`}
                className="flex gap-4 p-3 bg-slate-50 rounded-xl border border-slate-200/60"
              >
                {/* Product Image */}
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded-lg bg-white border border-slate-200 flex-shrink-0"
                  referrerPolicy="no-referrer"
                />

                {/* Info & Quantity controls */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs font-extrabold text-slate-900 line-clamp-1">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(index)}
                        className="text-slate-400 hover:text-red-600 transition-colors p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Size: <span className="font-bold text-slate-700">{item.selectedSize}</span> | Color:{' '}
                      <span className="font-bold text-slate-700">{item.selectedColor}</span>
                    </p>
                  </div>

                  <div className="flex justify-between items-center mt-2">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-slate-300 rounded-md bg-white">
                      <button
                        onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                        className="px-2 py-0.5 text-xs font-bold text-slate-600 hover:bg-slate-100"
                      >
                        -
                      </button>
                      <span className="px-2.5 text-xs font-black text-slate-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                        className="px-2 py-0.5 text-xs font-bold text-slate-600 hover:bg-slate-100"
                      >
                        +
                      </button>
                    </div>

                    <span className="text-sm font-black text-slate-900">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-700">Your bag is empty</p>
              <p className="text-xs text-slate-500 mt-1">
                Explore the gallery and add streetwear pieces to your bag.
              </p>
            </div>
          )}
        </div>

        {/* Footer & Checkout */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t border-slate-200 bg-white space-y-4">
            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Promo code (REALFOX10)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-md outline-none focus:ring-2 focus:ring-indigo-600 uppercase font-semibold"
                />
              </div>
              <button
                type="submit"
                className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-md transition-colors"
              >
                Apply
              </button>
            </form>

            {promoMessage && (
              <p className={`text-[11px] font-bold ${discountPercent > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                {promoMessage}
              </p>
            )}

            {/* Calculations */}
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">${subtotal.toFixed(2)}</span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discount ({discountPercent}%)</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-bold text-slate-900">
                  {subtotal >= freeShippingThreshold ? 'FREE' : '$9.95'}
                </span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-100">
                <span>Total</span>
                <span className="text-indigo-600">${(finalTotal + (subtotal >= freeShippingThreshold ? 0 : 9.95)).toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              id="proceed-to-checkout"
              onClick={() => {
                onClose();
                onCheckout();
              }}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white rounded-md text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-950/20"
            >
              <span>PROCEED TO CHECKOUT</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
