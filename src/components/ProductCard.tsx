import React from 'react';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, size: string, color: string) => void;
  onToggleWishlist: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onQuickView,
  onAddToCart,
  onToggleWishlist,
}) => {
  const defaultSize = product.sizes[0] || 'M';
  const defaultColor = product.colors[0]?.name || 'Standard';

  return (
    <div className="group relative bg-white rounded-xl border border-slate-200/80 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Product Image Container */}
      <div className="relative aspect-square w-full bg-slate-100 overflow-hidden cursor-pointer" onClick={() => onQuickView(product)}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isNewArrival && (
            <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold tracking-wider uppercase bg-indigo-600 text-white shadow-xs">
              NEW
            </span>
          )}
          {product.isBestSeller && (
            <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold tracking-wider uppercase bg-slate-900 text-white shadow-xs">
              BESTSELLER
            </span>
          )}
          {product.stockQuantity <= 0 ? (
            <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold tracking-wider uppercase bg-red-600 text-white shadow-xs">
              SOLD OUT
            </span>
          ) : product.stockQuantity <= 5 ? (
            <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold tracking-wider uppercase bg-amber-500 text-white shadow-xs font-mono">
              ONLY {product.stockQuantity} LEFT
            </span>
          ) : null}
        </div>

        {/* Top-Right Wishlist Button */}
        <button
          id={`wishlist-btn-${product.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all z-10 ${
            isWishlisted
              ? 'bg-red-50 text-red-600 border border-red-200 shadow-xs'
              : 'bg-white/80 text-slate-700 hover:bg-white hover:text-red-500'
          }`}
          title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-600' : ''}`} />
        </button>

        {/* Quick View Hover Overlay Button */}
        <div className="absolute inset-x-0 bottom-3 px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2 z-10">
          <button
            id={`quickview-btn-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="flex-1 py-2 bg-slate-900/90 hover:bg-slate-900 text-white text-xs font-bold rounded-lg backdrop-blur-xs flex items-center justify-center gap-1.5 transition-colors shadow-md"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>QUICK VIEW</span>
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex flex-col flex-grow justify-between bg-white">
        <div>
          {/* Color Swatches */}
          <div className="flex items-center gap-1.5 mb-2">
            {product.colors.map((col, idx) => (
              <span
                key={idx}
                className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-2xs"
                style={{ backgroundColor: col.hex }}
                title={col.name}
              />
            ))}
            <span className="text-[10px] text-slate-400 font-medium ml-1">
              {product.colors.length} color{product.colors.length > 1 ? 's' : ''}
            </span>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => onQuickView(product)}
            className="text-sm font-bold text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer line-clamp-1"
          >
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-1">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
            </div>
            <span className="text-xs font-bold text-slate-700">{product.rating}</span>
            <span className="text-xs text-slate-400">({product.reviewsCount})</span>
          </div>
        </div>

        {/* Price & Add to Bag */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-black text-slate-900">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-xs text-slate-400 line-through font-medium">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <button
            id={`add-cart-btn-${product.id}`}
            disabled={product.stockQuantity <= 0}
            onClick={() => onAddToCart(product, defaultSize, defaultColor)}
            className={`px-3 py-2 rounded-md text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs ${
              product.stockQuantity <= 0
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-slate-900 hover:bg-indigo-600 text-white active:scale-95'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{product.stockQuantity <= 0 ? 'OUT' : 'ADD'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
