import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, CreditCard, Truck, Lock } from 'lucide-react';
import { CartItem } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  cartItems: CartItem[];
  onClose: () => void;
  onClearCart: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  cartItems,
  onClose,
  onClearCart,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<'details' | 'success'>('details');
  const [formData, setFormData] = useState({
    fullName: 'Alex Vance',
    email: 'alex.vance@example.com',
    address: '742 Streetwear Ave, Suite 4B',
    city: 'Los Angeles',
    state: 'CA',
    zip: '90015',
    cardNumber: '4532 •••• •••• 8892',
    cardExp: '08/28',
    cardCvc: '882',
  });

  const [orderNumber, setOrderNumber] = useState('');

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shipping = subtotal >= 100 ? 0 : 9.95;
  const total = subtotal + shipping;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedId = `RF-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderNumber(generatedId);
    setStep('success');
    onClearCart();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs font-black uppercase tracking-widest text-white">
              {step === 'details' ? 'SECURE STREETWEAR CHECKOUT' : 'ORDER CONFIRMED'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'details' ? (
          <form onSubmit={handleSubmitOrder} className="p-6 md:p-8 space-y-6">
            
            {/* Customer & Shipping Details */}
            <div>
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Truck className="w-4 h-4 text-indigo-600" /> 1. Shipping Address
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="px-3 py-2 border border-slate-200 rounded-md text-xs outline-none focus:ring-2 focus:ring-indigo-600"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="px-3 py-2 border border-slate-200 rounded-md text-xs outline-none focus:ring-2 focus:ring-indigo-600"
                />
                <input
                  type="text"
                  placeholder="Street Address"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="md:col-span-2 px-3 py-2 border border-slate-200 rounded-md text-xs outline-none focus:ring-2 focus:ring-indigo-600"
                />
                <input
                  type="text"
                  placeholder="City"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="px-3 py-2 border border-slate-200 rounded-md text-xs outline-none focus:ring-2 focus:ring-indigo-600"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="State"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="px-3 py-2 border border-slate-200 rounded-md text-xs outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                  <input
                    type="text"
                    placeholder="Zip"
                    required
                    value={formData.zip}
                    onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                    className="px-3 py-2 border border-slate-200 rounded-md text-xs outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div>
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-indigo-600" /> 2. Payment Method
              </h4>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <input
                  type="text"
                  placeholder="Card Number"
                  required
                  value={formData.cardNumber}
                  onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md text-xs outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    required
                    value={formData.cardExp}
                    onChange={(e) => setFormData({ ...formData, cardExp: e.target.value })}
                    className="px-3 py-2 border border-slate-200 rounded-md text-xs outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
                  />
                  <input
                    type="text"
                    placeholder="CVC"
                    required
                    value={formData.cardCvc}
                    onChange={(e) => setFormData({ ...formData, cardCvc: e.target.value })}
                    className="px-3 py-2 border border-slate-200 rounded-md text-xs outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Summary & Submit */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-medium">Order Total:</span>
                <p className="text-xl font-black text-slate-900">${total.toFixed(2)}</p>
              </div>

              <button
                type="submit"
                className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-black text-xs uppercase tracking-wider rounded-md shadow-lg shadow-indigo-950/20 transition-all flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>PAY & PLACE ORDER</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="p-8 text-center space-y-4">
            <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto" />
            <h3 className="text-2xl font-black text-slate-900 uppercase">
              THANK YOU FOR YOUR ORDER!
            </h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Your Real Fox order <span className="font-extrabold text-indigo-600">{orderNumber}</span> has been confirmed. A receipt and tracking link will be sent to <span className="font-bold">{formData.email}</span>.
            </p>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 max-w-sm mx-auto text-left text-xs space-y-1">
              <p className="font-bold text-slate-900">Shipment Details:</p>
              <p className="text-slate-600">{formData.fullName}</p>
              <p className="text-slate-600">{formData.address}, {formData.city}, {formData.state}</p>
              <p className="text-slate-500 pt-1">Estimated delivery: 2-3 Business Days</p>
            </div>

            <button
              onClick={onClose}
              className="mt-6 px-8 py-3 bg-indigo-600 text-white rounded-md text-xs font-bold uppercase tracking-wider hover:bg-indigo-700 transition-colors"
            >
              CONTINUE SHOPPING
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
