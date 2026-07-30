import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Image, Package, Tag, DollarSign, Layers } from 'lucide-react';
import { Product, Category } from '../../types';

interface ProductFormModalProps {
  isOpen: boolean;
  productToEdit?: Product | null;
  onClose: () => void;
  onSave: (product: Product) => void;
}

const CATEGORIES: Category[] = ['Hoodies', 'Jackets', 'Caps & Headwear', 'T-Shirts', 'Pants'];

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  productToEdit,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    sku: '',
    category: 'Hoodies',
    price: 0,
    costPrice: 0,
    stockQuantity: 10,
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
    description: '',
    details: ['100% Cotton', 'Pre-shrunk finish'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Black', hex: '#111111' }],
    rating: 5.0,
    reviewsCount: 1,
    inStock: true,
  });

  const [newDetail, setNewDetail] = useState('');
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#1E60D5');

  useEffect(() => {
    if (productToEdit) {
      setFormData({ ...productToEdit });
    } else {
      setFormData({
        id: `rf-${Date.now().toString().slice(-4)}`,
        sku: `RF-PRD-${Math.floor(100 + Math.random() * 900)}`,
        name: '',
        category: 'Hoodies',
        price: 75,
        costPrice: 30,
        stockQuantity: 20,
        image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
        description: 'Heavyweight organic cotton apparel built for maximum style and comfort.',
        details: ['450 GSM Heavyweight Terry', 'Double-stitched structural seams', 'Pre-shrunk finish'],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: [
          { name: 'Royal Blue', hex: '#1E60D5' },
          { name: 'Black', hex: '#111111' },
        ],
        rating: 5.0,
        reviewsCount: 0,
        inStock: true,
      });
    }
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.sku) return;

    const stock = Number(formData.stockQuantity) || 0;
    const finalProduct: Product = {
      id: formData.id || `rf-${Date.now()}`,
      sku: formData.sku || `RF-SKU-${Date.now().toString().slice(-4)}`,
      name: formData.name,
      category: formData.category as Category,
      price: Number(formData.price) || 0,
      costPrice: Number(formData.costPrice) || 0,
      stockQuantity: stock,
      image: formData.image || 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
      description: formData.description || '',
      details: formData.details && formData.details.length > 0 ? formData.details : ['100% Quality Fabric'],
      sizes: formData.sizes && formData.sizes.length > 0 ? formData.sizes : ['One Size'],
      colors: formData.colors && formData.colors.length > 0 ? formData.colors : [{ name: 'Standard', hex: '#111111' }],
      rating: formData.rating || 5.0,
      reviewsCount: formData.reviewsCount || 0,
      inStock: stock > 0 && formData.inStock !== false,
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
    };

    onSave(finalProduct);
    onClose();
  };

  const addDetail = () => {
    if (!newDetail.trim()) return;
    setFormData((prev) => ({
      ...prev,
      details: [...(prev.details || []), newDetail.trim()],
    }));
    setNewDetail('');
  };

  const removeDetail = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      details: (prev.details || []).filter((_, i) => i !== index),
    }));
  };

  const addColor = () => {
    if (!newColorName.trim()) return;
    setFormData((prev) => ({
      ...prev,
      colors: [...(prev.colors || []), { name: newColorName.trim(), hex: newColorHex }],
    }));
    setNewColorName('');
  };

  const removeColor = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      colors: (prev.colors || []).filter((_, i) => i !== index),
    }));
  };

  const toggleSize = (size: string) => {
    const currentSizes = formData.sizes || [];
    if (currentSizes.includes(size)) {
      setFormData((prev) => ({
        ...prev,
        sizes: currentSizes.filter((s) => s !== size),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        sizes: [...currentSizes, size],
      }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-black uppercase tracking-wider">
              {productToEdit ? 'EDIT INVENTORY ITEM' : 'ADD NEW PRODUCT TO STORE'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 max-h-[80vh] overflow-y-auto space-y-5">
          
          {/* Main Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Real Fox Core Pullover Hoodie"
                className="w-full px-3 py-2 border border-slate-200 rounded-md text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                SKU / Barcode *
              </label>
              <input
                type="text"
                required
                value={formData.sku || ''}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="e.g. RF-HD-109"
                className="w-full px-3 py-2 border border-slate-200 rounded-md text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-600 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
                className="w-full px-3 py-2 border border-slate-200 rounded-md text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-600"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Retail Price ($) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                min="0"
                value={formData.price !== undefined ? formData.price : ''}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-slate-200 rounded-md text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-600 font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Cost Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.costPrice !== undefined ? formData.costPrice : ''}
                onChange={(e) => setFormData({ ...formData, costPrice: parseFloat(e.target.value) || 0 })}
                placeholder="Owner cost"
                className="w-full px-3 py-2 border border-slate-200 rounded-md text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-600 text-slate-600"
              />
            </div>
          </div>

          {/* Stock & Availability */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase mb-1">
                Inventory Stock Units *
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  required
                  value={formData.stockQuantity !== undefined ? formData.stockQuantity : 0}
                  onChange={(e) => {
                    const q = parseInt(e.target.value) || 0;
                    setFormData({ ...formData, stockQuantity: q, inStock: q > 0 });
                  }}
                  className="w-28 px-3 py-2 border border-slate-300 rounded-md text-sm font-black text-indigo-600 bg-white"
                />
                <span className="text-xs text-slate-500 font-medium">
                  {formData.stockQuantity === 0 ? '❌ Out of Stock' : (formData.stockQuantity || 0) <= 5 ? '⚠️ Low Stock' : '✅ In Stock'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-6 pt-2 sm:pt-0">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.inStock !== false && (formData.stockQuantity || 0) > 0}
                  onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                />
                <span className="text-xs font-bold text-slate-800 uppercase">Listed for Sale</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isNewArrival || false}
                  onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                />
                <span className="text-xs font-bold text-slate-800 uppercase">New Release</span>
              </label>
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Image URL *
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                required
                value={formData.image || ''}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://..."
                className="flex-1 px-3 py-2 border border-slate-200 rounded-md text-xs outline-none focus:ring-2 focus:ring-indigo-600"
              />
              {formData.image && (
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-9 h-9 object-cover rounded-md border border-slate-200"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed description of fabric, fit, and aesthetic..."
              className="w-full px-3 py-2 border border-slate-200 rounded-md text-xs outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          {/* Available Sizes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Available Sizes
            </label>
            <div className="flex flex-wrap gap-2">
              {['XS', 'S', 'M', 'L', 'XL', 'XXL', '30', '32', '34', '36', 'One Size'].map((size) => {
                const isSelected = (formData.sizes || []).includes(size);
                return (
                  <button
                    type="button"
                    key={size}
                    onClick={() => toggleSize(size)}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold border transition-all ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Variants */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Color Variants
            </label>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {(formData.colors || []).map((col, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800"
                >
                  <span
                    className="w-3 h-3 rounded-full border border-slate-300"
                    style={{ backgroundColor: col.hex }}
                  />
                  <span>{col.name}</span>
                  <button
                    type="button"
                    onClick={() => removeColor(idx)}
                    className="text-slate-400 hover:text-red-500 ml-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newColorName}
                onChange={(e) => setNewColorName(e.target.value)}
                placeholder="Color Name (e.g. Cobalt)"
                className="px-3 py-1.5 border border-slate-200 rounded-md text-xs outline-none focus:ring-2 focus:ring-indigo-600 flex-1"
              />
              <input
                type="color"
                value={newColorHex}
                onChange={(e) => setNewColorHex(e.target.value)}
                className="w-9 h-8 p-0.5 rounded border border-slate-200 cursor-pointer"
              />
              <button
                type="button"
                onClick={addColor}
                className="px-3 py-1.5 bg-slate-800 text-white rounded-md text-xs font-bold hover:bg-slate-700 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Bullet Specifications */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Fabric Specifications / Details
            </label>
            <ul className="space-y-1.5 mb-2">
              {(formData.details || []).map((det, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between text-xs bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200"
                >
                  <span className="text-slate-700">{det}</span>
                  <button
                    type="button"
                    onClick={() => removeDetail(idx)}
                    className="text-slate-400 hover:text-red-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex gap-2">
              <input
                type="text"
                value={newDetail}
                onChange={(e) => setNewDetail(e.target.value)}
                placeholder="Add specification bullet (e.g. 450 GSM French Terry)"
                className="flex-1 px-3 py-1.5 border border-slate-200 rounded-md text-xs outline-none focus:ring-2 focus:ring-indigo-600"
              />
              <button
                type="button"
                onClick={addDetail}
                className="px-3 py-1.5 bg-slate-800 text-white rounded-md text-xs font-bold hover:bg-slate-700 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-xs font-extrabold uppercase tracking-wider shadow-md shadow-indigo-950/20 transition-all"
            >
              {productToEdit ? 'Save Changes' : 'Add to Inventory'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
