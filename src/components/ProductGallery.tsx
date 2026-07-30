import React, { useState, useMemo } from 'react';
import { Filter, SlidersHorizontal, SearchX } from 'lucide-react';
import { Product, Category, FilterState } from '../types';
import { ProductCard } from './ProductCard';
import { RealFoxLogo } from './RealFoxLogo';

interface ProductGalleryProps {
  products: Product[];
  wishlistIds: string[];
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, size: string, color: string) => void;
  onToggleWishlist: (product: Product) => void;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  products,
  wishlistIds,
  onQuickView,
  onAddToCart,
  onToggleWishlist,
}) => {
  const [filters, setFilters] = useState<FilterState>({
    category: 'All',
    searchQuery: '',
    maxPrice: 200,
    sortBy: 'featured',
  });

  const categories: Category[] = [
    'All',
    'Hoodies',
    'Jackets',
    'Caps & Headwear',
    'T-Shirts',
    'Pants',
  ];

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        if (filters.category !== 'All' && product.category !== filters.category) {
          return false;
        }
        if (
          filters.searchQuery &&
          !product.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
          !product.description.toLowerCase().includes(filters.searchQuery.toLowerCase())
        ) {
          return false;
        }
        if (product.price > filters.maxPrice) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'price-low') return a.price - b.price;
        if (filters.sortBy === 'price-high') return b.price - a.price;
        if (filters.sortBy === 'rating') return b.rating - a.rating;
        return 0; // featured default
      });
  }, [products, filters]);

  return (
    <section id="product-gallery-section" className="py-16 bg-slate-50/60 min-h-[650px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Gallery Header matching Mockup */}
        <div className="text-center mb-12 flex flex-col items-center">
          <div className="mb-2">
            <RealFoxLogo variant="text-only" size="lg" />
          </div>
          <h2 className="text-sm font-extrabold tracking-[0.25em] text-slate-800 uppercase">
            PRODUCT GALLERY
          </h2>
          <div className="h-0.5 w-16 bg-indigo-600 mt-3 rounded-full" />
        </div>

        {/* Filter Navigation Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 w-full md:w-auto overflow-x-auto py-1">
            {categories.map((cat) => {
              const isActive = filters.category === cat;
              return (
                <button
                  key={cat}
                  id={`cat-filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => setFilters({ ...filters, category: cat })}
                  className={`px-4 py-2 rounded-md text-xs font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Sort & Quick Controls */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-slate-100 pt-3 md:pt-0">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-bold text-slate-600">SORT:</span>
              <select
                id="gallery-sort-select"
                value={filters.sortBy}
                onChange={(e) =>
                  setFilters({ ...filters, sortBy: e.target.value as FilterState['sortBy'] })
                }
                aria-label="Sort products by"
                className="bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-600"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            <span className="text-xs font-semibold text-slate-500">
              {filteredProducts.length} items
            </span>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={wishlistIds.includes(product.id)}
                onQuickView={onQuickView}
                onAddToCart={onAddToCart}
                onToggleWishlist={onToggleWishlist}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
            <SearchX className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No products found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Try adjusting your category filters or search criteria.
            </p>
            <button
              onClick={() => setFilters({ category: 'All', searchQuery: '', maxPrice: 200, sortBy: 'featured' })}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md text-xs font-bold hover:bg-indigo-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
