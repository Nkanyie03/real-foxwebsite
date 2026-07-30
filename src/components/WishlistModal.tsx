import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Product } from '../types';

interface WishlistModalProps {
  isOpen: boolean;
  wishlistProducts: Product[];
  onClose: () => void;
  onRemoveFromWishlist: (product: Product) => void;
  onAddToCart: (product: Product, size: string, color: string) => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  wishlistProducts,
  onClose,
  onRemoveFromWishlist,
  onAddToCart,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end">
      <div className="relative bg-white w-full max-w-md h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
            <h2 className="text-base font-black text-slate-900 uppercase tracking-wide">
              YOUR WISHLIST ({wishlistProducts.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-900 bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {wishlistProducts.length > 0 ? (
            wishlistProducts.map((product) => (
              <div
                key={product.id}
                className="flex gap-4 p-3 bg-slate-50 rounded-xl border border-slate-200/60 items-center justify-between"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-lg bg-white border border-slate-200 flex-shrink-0"
                  referrerPolicy="no-referrer"
                />

                <div className="flex-1">
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                    {product.name}
                  </h4>
                  <p className="text-xs font-black text-indigo-600 mt-0.5">
                    ${product.price.toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onAddToCart(product, product.sizes[0] || 'M', product.colors[0]?.name || 'Standard');
                      onRemoveFromWishlist(product);
                    }}
                    className="p-2 bg-indigo-600 text-white rounded-md text-xs font-bold hover:bg-indigo-700 transition-colors"
                    title="Add to cart"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onRemoveFromWishlist(product)}
                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <Heart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-700">Your wishlist is empty</p>
              <p className="text-xs text-slate-500 mt-1">
                Save your favorite Real Fox items by clicking the heart icon on any product.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
