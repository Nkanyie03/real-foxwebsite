import React, { useState } from 'react';
import {
  X,
  CheckCircle,
  ShieldCheck,
  CreditCard,
  Truck,
  Lock,
  Sparkles,
  Smartphone,
  QrCode,
  ArrowRight,
  RefreshCw,
  Check,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { CartItem, Order, StoreSettings } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  cartItems: CartItem[];
  settings?: StoreSettings;
  onClose: () => void;
  onClearCart: () => void;
  onCompleteOrder: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  cartItems,
  settings,
  onClose,
  onClearCart,
  onCompleteOrder,
}) => {
  if (!isOpen) return null;

  const currency = settings?.currencySymbol || '$';
  const taxRate = settings?.taxRate ?? 8.5;

  const [step, setStep] = useState<'details' | 'processing' | 'success'>('details');
  const [processingStatus, setProcessingStatus] = useState('Initializing 256-Bit SSL Gateway...');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'paypal' | 'klarna'>('card');

  const [formData, setFormData] = useState({
    fullName: 'Alex Vance',
    email: 'alex.vance@example.com',
    address: '742 Streetwear Ave, Suite 4B',
    city: 'Los Angeles',
    state: 'CA',
    zip: '90015',
    cardName: 'Alex Vance',
    cardNumber: '4532 8891 0042 8892',
    cardExp: '08/28',
    cardCvc: '882',
    paypalEmail: 'alex.vance@example.com',
  });

  const [orderNumber, setOrderNumber] = useState('');
  const [transactionId, setTransactionId] = useState('');

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const tax = subtotal * (taxRate / 100);
  const shipping = subtotal >= 100 ? 0 : 9.95;
  const total = subtotal + tax + shipping;

  // Format credit card numbers nicely
  const handleCardNumberChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})/g, '$1 ').trim();
    setFormData((prev) => ({ ...prev, cardNumber: formatted }));
  };

  // Quick fill demo test card
  const fillTestCard = () => {
    setFormData((prev) => ({
      ...prev,
      cardName: 'Alex Vance',
      cardNumber: '4242 4242 4242 4242',
      cardExp: '12/28',
      cardCvc: '424',
    }));
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    setStep('processing');
    setProcessingStatus('Connecting to Stripe SSL Secure Server...');

    const generatedId = `RF-${Math.floor(100000 + Math.random() * 900000)}`;
    const txId = `TX-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    setOrderNumber(generatedId);
    setTransactionId(txId);

    // Dynamic processing delay simulation
    setTimeout(() => {
      setProcessingStatus('Verifying 3D-Secure Fraud Shield...');
    }, 900);

    setTimeout(() => {
      setProcessingStatus(`Authorizing ${currency}${total.toFixed(2)} with payment gateway...`);
    }, 1800);

    setTimeout(() => {
      let finalPaymentMethodLabel = 'Credit Card (Online)';
      if (paymentMethod === 'apple_pay') finalPaymentMethodLabel = 'Apple Pay / Google Pay Express';
      if (paymentMethod === 'paypal') finalPaymentMethodLabel = `PayPal Express (${formData.paypalEmail})`;
      if (paymentMethod === 'klarna') finalPaymentMethodLabel = 'Klarna Pay-in-4 (Installments)';
      if (paymentMethod === 'card') {
        const last4 = formData.cardNumber.slice(-4) || '4242';
        finalPaymentMethodLabel = `Credit Card (Visa ending in ${last4})`;
      }

      const newOrder: Order = {
        id: generatedId,
        orderNumber: generatedId,
        date: new Date().toISOString().split('T')[0],
        customerName: formData.fullName,
        customerEmail: formData.email,
        shippingAddress: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zip}`,
        items: cartItems,
        subtotal,
        tax,
        shipping,
        total,
        paymentMethod: finalPaymentMethodLabel,
        status: 'Processing',
        trackingNumber: `TRK-${Math.floor(100000 + Math.random() * 900000)}`,
        carrier: 'FedEx Express',
        notes: `Online Online Gateway Auth: ${txId}`,
      };

      onCompleteOrder(newOrder);
      setStep('success');
      onClearCart();
    }, 2700);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-white">
                {step === 'details'
                  ? 'ONLINE CHECKOUT & SECURE PAYMENT'
                  : step === 'processing'
                  ? 'PROCESSING ONLINE PAYMENT'
                  : 'PAYMENT SUCCESSFUL'}
              </h3>
              <p className="text-[10px] text-slate-400 font-mono">
                256-BIT SSL ENCRYPTED GATEWAY
              </p>
            </div>
          </div>
          {step !== 'processing' && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* STEP 1: Form & Payment Selection */}
        {step === 'details' && (
          <form onSubmit={handleSubmitOrder} className="p-6 md:p-8 space-y-6">
            
            {/* Shipping Info */}
            <div>
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Truck className="w-4 h-4 text-indigo-600" /> 1. Delivery & Customer Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="px-3 py-2 border border-slate-200 rounded-md text-xs font-semibold outline-none focus:ring-2 focus:ring-indigo-600"
                />
                <input
                  type="email"
                  placeholder="Email Address (for receipt & tracking)"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="px-3 py-2 border border-slate-200 rounded-md text-xs font-semibold outline-none focus:ring-2 focus:ring-indigo-600"
                />
                <input
                  type="text"
                  placeholder="Street Address"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="md:col-span-2 px-3 py-2 border border-slate-200 rounded-md text-xs font-semibold outline-none focus:ring-2 focus:ring-indigo-600"
                />
                <input
                  type="text"
                  placeholder="City"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="px-3 py-2 border border-slate-200 rounded-md text-xs font-semibold outline-none focus:ring-2 focus:ring-indigo-600"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="State"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="px-3 py-2 border border-slate-200 rounded-md text-xs font-semibold outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                  <input
                    type="text"
                    placeholder="Zip Code"
                    required
                    value={formData.zip}
                    onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                    className="px-3 py-2 border border-slate-200 rounded-md text-xs font-semibold outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              </div>
            </div>

            {/* Online Payment Method Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-indigo-600" /> 2. Select Online Payment Method
                </h4>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Instant Verification
                </span>
              </div>

              {/* Payment Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border text-center flex flex-col items-center justify-center gap-1 transition-all ${
                    paymentMethod === 'card'
                      ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-600 text-indigo-900'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-indigo-600" />
                  <span className="text-[11px] font-bold">Credit / Debit</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('apple_pay')}
                  className={`p-3 rounded-xl border text-center flex flex-col items-center justify-center gap-1 transition-all ${
                    paymentMethod === 'apple_pay'
                      ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-600 text-indigo-900'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-slate-900" />
                  <span className="text-[11px] font-bold">Apple / Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('paypal')}
                  className={`p-3 rounded-xl border text-center flex flex-col items-center justify-center gap-1 transition-all ${
                    paymentMethod === 'paypal'
                      ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-600 text-indigo-900'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="font-black italic text-blue-700 text-sm">PayPal</span>
                  <span className="text-[11px] font-bold">PayPal</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('klarna')}
                  className={`p-3 rounded-xl border text-center flex flex-col items-center justify-center gap-1 transition-all ${
                    paymentMethod === 'klarna'
                      ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-600 text-indigo-900'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="font-extrabold text-pink-600 text-xs uppercase">Klarna.</span>
                  <span className="text-[11px] font-bold">Pay in 4</span>
                </button>
              </div>

              {/* CARD PAYMENT DETAILS */}
              {paymentMethod === 'card' && (
                <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  
                  {/* Virtual Card Graphic */}
                  <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 rounded-xl shadow-md border border-slate-800 space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="w-8 h-6 bg-amber-400/80 rounded-md border border-amber-300 shadow-inner" />
                      <span className="font-black italic tracking-wider text-xs uppercase text-slate-300">
                        VISA / MASTERCARD
                      </span>
                    </div>
                    <div>
                      <p className="font-mono text-lg font-bold tracking-widest text-slate-100">
                        {formData.cardNumber || '•••• •••• •••• ••••'}
                      </p>
                    </div>
                    <div className="flex justify-between text-[10px] uppercase text-slate-400 font-bold">
                      <div>
                        <span className="block text-[8px] text-slate-400">CARDHOLDER</span>
                        <span>{formData.cardName || 'ALEX VANCE'}</span>
                      </div>
                      <div>
                        <span className="block text-[8px] text-slate-400">EXPIRES</span>
                        <span>{formData.cardExp || 'MM/YY'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Form Inputs */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black uppercase text-slate-700">Cardholder Name</label>
                      <button
                        type="button"
                        onClick={fillTestCard}
                        className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 underline"
                      >
                        ⚡ Fill Demo Test Card
                      </button>
                    </div>

                    <input
                      type="text"
                      required
                      placeholder="Name as printed on card"
                      value={formData.cardName}
                      onChange={(e) => setFormData({ ...formData, cardName: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-md text-xs font-semibold outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
                    />

                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-700 block mb-1">
                        16-Digit Card Number
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="4532 8891 0042 8892"
                        value={formData.cardNumber}
                        onChange={(e) => handleCardNumberChange(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-md text-xs font-mono font-bold outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-black uppercase text-slate-700 block mb-1">
                          Expiration (MM/YY)
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="08/28"
                          maxLength={5}
                          value={formData.cardExp}
                          onChange={(e) => setFormData({ ...formData, cardExp: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-md text-xs font-mono font-bold outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-black uppercase text-slate-700 block mb-1">
                          CVC / Security Code
                        </label>
                        <input
                          type="password"
                          required
                          maxLength={4}
                          placeholder="882"
                          value={formData.cardCvc}
                          onChange={(e) => setFormData({ ...formData, cardCvc: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-md text-xs font-mono font-bold outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
                        />
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* APPLE / GOOGLE PAY DETAILS */}
              {paymentMethod === 'apple_pay' && (
                <div className="bg-slate-900 text-white p-5 rounded-xl border border-slate-800 text-center space-y-3">
                  <Smartphone className="w-8 h-8 text-indigo-400 mx-auto" />
                  <h5 className="text-xs font-black uppercase tracking-wider">
                    Express 1-Touch Apple Pay / Google Pay
                  </h5>
                  <p className="text-[11px] text-slate-300 max-w-sm mx-auto">
                    Clicking below will authorize secure biometrics with your stored Wallet card ending in <span className="font-mono font-bold text-white">4242</span>.
                  </p>
                </div>
              )}

              {/* PAYPAL DETAILS */}
              {paymentMethod === 'paypal' && (
                <div className="bg-blue-50/80 p-5 rounded-xl border border-blue-200 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="font-black italic text-blue-800 text-lg">PayPal</span>
                    <span className="text-xs font-bold text-blue-900">Express Online Authorization</span>
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="PayPal Account Email"
                    value={formData.paypalEmail}
                    onChange={(e) => setFormData({ ...formData, paypalEmail: e.target.value })}
                    className="w-full px-3 py-2 border border-blue-200 rounded-md text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                  />
                  <p className="text-[11px] text-blue-700">
                    You will be redirected to PayPal to authorize the payment of {currency}{total.toFixed(2)}.
                  </p>
                </div>
              )}

              {/* KLARNA DETAILS */}
              {paymentMethod === 'klarna' && (
                <div className="bg-pink-50/70 p-5 rounded-xl border border-pink-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-pink-700 uppercase tracking-wider text-sm">Klarna. Pay in 4</span>
                    <span className="text-[10px] font-extrabold bg-pink-100 text-pink-800 px-2 py-0.5 rounded">0% Interest</span>
                  </div>
                  <p className="text-xs text-slate-700 font-semibold">
                    Pay 4 interest-free installments of <span className="font-black text-pink-700">{currency}{(total / 4).toFixed(2)}</span> bi-weekly.
                  </p>
                  <div className="grid grid-cols-4 gap-1 text-[10px] text-center font-bold">
                    <div className="p-1.5 bg-white border border-pink-200 rounded">1. Today ({currency}{(total / 4).toFixed(2)})</div>
                    <div className="p-1.5 bg-white border border-pink-200 rounded">2. 2 Wks ({currency}{(total / 4).toFixed(2)})</div>
                    <div className="p-1.5 bg-white border border-pink-200 rounded">3. 4 Wks ({currency}{(total / 4).toFixed(2)})</div>
                    <div className="p-1.5 bg-white border border-pink-200 rounded">4. 6 Wks ({currency}{(total / 4).toFixed(2)})</div>
                  </div>
                </div>
              )}

            </div>

            {/* Price Breakdown & Submit */}
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <div className="space-y-1 text-xs text-slate-600 font-semibold">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{currency}{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax ({taxRate}%):</span>
                  <span>{currency}{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>{shipping === 0 ? 'FREE' : `${currency}${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Amount Due:</span>
                  <span className="text-indigo-600">{currency}{total.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-indigo-950/20 transition-all flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>CONFIRM & PAY {currency}{total.toFixed(2)} ONLINE</span>
              </button>
            </div>

          </form>
        )}

        {/* STEP 2: Processing Gateway Spinner */}
        {step === 'processing' && (
          <div className="p-12 text-center space-y-6">
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-indigo-200 animate-ping" />
              <div className="relative w-16 h-16 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-indigo-600" />
              </div>
            </div>

            <div>
              <h4 className="text-lg font-black uppercase text-slate-900 tracking-tight">
                AUTHORIZING PAYMENT...
              </h4>
              <p className="text-xs font-mono text-indigo-600 font-bold mt-2 animate-pulse">
                {processingStatus}
              </p>
            </div>

            <div className="max-w-xs mx-auto bg-slate-50 p-3 rounded-lg border border-slate-200 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              🔒 SSL 256-Bit Payment Encryption Active
            </div>
          </div>
        )}

        {/* STEP 3: Order Success & Digital Receipt */}
        {step === 'success' && (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-[10px] font-black uppercase border border-emerald-200">
                Payment Authorized & Receipt Sent
              </span>
              <h3 className="text-2xl font-black text-slate-900 uppercase mt-2">
                THANK YOU FOR YOUR ORDER!
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto mt-1">
                Your online transaction <span className="font-mono font-bold text-indigo-600">{transactionId}</span> was successful. Order reference: <span className="font-extrabold text-slate-900">{orderNumber}</span>.
              </p>
            </div>

            {/* Receipt details block */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 max-w-md mx-auto text-left text-xs space-y-2">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="font-bold text-slate-900 uppercase">Paid Amount:</span>
                <span className="font-black text-emerald-600 text-sm">{currency}{total.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-slate-500 font-semibold block">Customer & Shipping:</span>
                <p className="font-bold text-slate-800">{formData.fullName}</p>
                <p className="text-slate-600">{formData.address}, {formData.city}, {formData.state}</p>
                <p className="text-slate-500">{formData.email}</p>
              </div>
              <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                <span>Carrier: FedEx Express | Estimated Delivery: 2-3 Days</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg transition-all"
            >
              CONTINUE SHOPPING
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
