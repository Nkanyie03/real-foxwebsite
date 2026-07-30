import React, { useState } from 'react';
import { X, Search, Sparkles } from 'lucide-react';
import { Product } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  products: Product[];
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  products,
  onClose,
  onSelectProduct,
}) => {
  if (!isOpen) return null;

  const [query, setQuery] = useState('');

  const popularTags = ['Hoodies', 'Bomber Jacket', 'Cap', 'Blue', 'Beanie', 'Cargo Pants'];

  const searchResults = query.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-start justify-center pt-20 px-4">
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50">
          <Search className="w-5 h-5 text-slate-400 ml-2" />
          <input
            type="text"
            placeholder="Search hoodies, jackets, caps, colors..."
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-xs text-slate-400 hover:text-slate-700">
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-900 bg-slate-200/60 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Popular Tags */}
        <div className="p-4 border-b border-slate-100 bg-white">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            POPULAR SEARCHES:
          </span>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className="px-3 py-1 bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-700 rounded-full text-xs font-semibold transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-2">
          {query.trim() ? (
            searchResults.length > 0 ? (
              searchResults.map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    onSelectProduct(product);
                    onClose();
                  }}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-lg bg-slate-100"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{product.name}</h4>
                      <span className="text-[11px] text-slate-500">{product.category}</span>
                    </div>
                  </div>
                  <span className="text-xs font-black text-indigo-600">${product.price.toFixed(2)}</span>
                </div>
              ))
            ) : (
              <p className="text-center py-8 text-xs text-slate-500 font-medium">
                No products found matching "{query}"
              </p>
            )
          ) : (
            <div className="text-center py-6 text-slate-400 text-xs flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Type keywords above to instantly search Real Fox inventory</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
