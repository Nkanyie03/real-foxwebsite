import React, { useState } from 'react';
import { X, Star, ShoppingBag, Heart, ShieldCheck, Truck, RefreshCw, Check } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  isWishlisted: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, color: string, quantity: number) => void;
  onToggleWishlist: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isWishlisted,
  onClose,
  onAddToCart,
  onToggleWishlist,
}) => {
  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0]?.name || 'Standard');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'details' | 'shipping' | 'sizing'>('details');

  const handleAdd = () => {
    onAddToCart(product, selectedSize, selectedColor, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
        
        {/* Close Button */}
        <button
          id="close-product-modal"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-slate-400 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Left: Main Image Display */}
          <div className="relative bg-slate-100 aspect-square md:aspect-auto flex items-center justify-center p-6 border-b md:border-b-0 md:border-r border-slate-200">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain max-h-[480px] drop-shadow-md"
              referrerPolicy="no-referrer"
            />
            {product.isNewArrival && (
              <span className="absolute top-4 left-4 bg-indigo-600 text-white text-xs font-black px-3 py-1 rounded-md uppercase tracking-wider">
                New Release
              </span>
            )}
          </div>

          {/* Right: Product Details & Controls */}
          <div className="p-6 md:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
            <div>
              {/* Category */}
              <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600">
                REAL FOX {product.category}
              </span>

              {/* Title */}
              <h2 className="text-2xl font-black text-slate-900 mt-1 mb-2">
                {product.name}
              </h2>

              {/* Price & Ratings */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-900">${product.price.toFixed(2)}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-slate-400 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-bold text-slate-800">{product.rating}</span>
                  <span className="text-xs text-slate-500">({product.reviewsCount} reviews)</span>
                </div>
              </div>

              {/* Color Selector */}
              <div className="mb-5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Color: <span className="text-indigo-600">{selectedColor}</span>
                </label>
                <div className="flex items-center gap-2">
                  {product.colors.map((color) => {
                    const isSelected = selectedColor === color.name;
                    return (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                          isSelected ? 'ring-2 ring-offset-2 ring-indigo-600 scale-105' : 'hover:scale-105'
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      >
                        {isSelected && (
                          <Check className={`w-4 h-4 ${color.hex === '#FFFFFF' ? 'text-slate-900' : 'text-white'}`} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Size Selector */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Select Size:
                  </label>
                  <button
                    onClick={() => setActiveTab('sizing')}
                    className="text-xs text-indigo-600 font-semibold hover:underline"
                  >
                    Size Guide
                  </button>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {product.sizes.map((size) => {
                    const isSelected = selectedSize === size;
                    return (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-2.5 rounded-md text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity Picker */}
              <div className="mb-6 flex items-center gap-4">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Quantity:
                </span>
                <div className="flex items-center border border-slate-300 rounded-md overflow-hidden bg-slate-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 font-bold transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-xs font-black text-slate-900 min-w-[36px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 font-bold transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Accordion Info Tabs */}
              <div className="border-t border-slate-200 pt-4 mb-6">
                <div className="flex border-b border-slate-200 gap-4">
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`pb-2 text-xs font-bold border-b-2 transition-colors ${
                      activeTab === 'details' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500'
                    }`}
                  >
                    FEATURES & FABRIC
                  </button>
                  <button
                    onClick={() => setActiveTab('shipping')}
                    className={`pb-2 text-xs font-bold border-b-2 transition-colors ${
                      activeTab === 'shipping' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500'
                    }`}
                  >
                    SHIPPING & RETURNS
                  </button>
                </div>

                <div className="py-3 text-xs text-slate-600 leading-relaxed">
                  {activeTab === 'details' && (
                    <ul className="space-y-1.5 list-disc list-inside">
                      {product.details.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  )}
                  {activeTab === 'shipping' && (
                    <div className="space-y-2">
                      <p className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-indigo-600" />
                        <span>Free express shipping on orders over $100.</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 text-indigo-600" />
                        <span>30-day hassle-free returns and size exchanges.</span>
                      </p>
                    </div>
                  )}
                  {activeTab === 'sizing' && (
                    <p>
                      Real Fox hoodies & tees fit true to modern oversized streetwear sizing. If you prefer a fitted look, select one size down.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
              <button
                id="modal-add-to-cart"
                onClick={handleAdd}
                className="flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white text-xs font-extrabold tracking-wider uppercase rounded-md shadow-lg flex items-center justify-center gap-2 transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>ADD TO BAG • ${(product.price * quantity).toFixed(2)}</span>
              </button>

              <button
                id="modal-toggle-wishlist"
                onClick={() => onToggleWishlist(product)}
                className={`p-3.5 rounded-xl border transition-all ${
                  isWishlisted
                    ? 'bg-red-50 text-red-600 border-red-200'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
                }`}
                title="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-600' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
