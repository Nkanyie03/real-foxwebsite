import React from 'react';
import { CheckCircle2, ShoppingBag, Heart } from 'lucide-react';

interface ToastProps {
  message: string | null;
  type: 'cart' | 'wishlist' | 'info';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-700 animate-in slide-in-from-bottom-5 duration-300">
      {type === 'cart' && <ShoppingBag className="w-4 h-4 text-emerald-400" />}
      {type === 'wishlist' && <Heart className="w-4 h-4 text-red-400 fill-red-400" />}
      {type === 'info' && <CheckCircle2 className="w-4 h-4 text-blue-400" />}

      <span className="text-xs font-bold">{message}</span>

      <button onClick={onClose} className="ml-2 text-slate-400 hover:text-white text-xs font-black">
        ✕
      </button>
    </div>
  );
};
