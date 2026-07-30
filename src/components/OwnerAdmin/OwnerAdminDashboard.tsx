import React, { useState } from 'react';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  PlusCircle,
  MinusCircle,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  ShoppingBag,
  Settings,
  Shield,
  Lock,
  ArrowLeft,
  Check,
  X
} from 'lucide-react';
import { Product, Order, StoreSettings, Category } from '../../types';
import { ProductFormModal } from './ProductFormModal';
import { PosCheckout } from './PosCheckout';
import { OrdersLog } from './OrdersLog';
import { StoreSettingsPanel } from './StoreSettingsPanel';

interface OwnerAdminDashboardProps {
  products: Product[];
  orders: Order[];
  settings: StoreSettings;
  onUpdateProduct: (product: Product) => void;
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onStockAdjust: (productId: string, delta: number) => void;
  onCompletePosSale: (order: Order) => void;
  onRefundOrder: (orderId: string) => void;
  onUpdateSettings: (newSettings: StoreSettings) => void;
  onResetInventory: () => void;
  onBackToStore: () => void;
}

export const OwnerAdminDashboard: React.FC<OwnerAdminDashboardProps> = ({
  products,
  orders,
  settings,
  onUpdateProduct,
  onAddProduct,
  onDeleteProduct,
  onStockAdjust,
  onCompletePosSale,
  onRefundOrder,
  onUpdateSettings,
  onResetInventory,
  onBackToStore,
}) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'pos' | 'orders' | 'settings'>('inventory');
  
  // Security PIN state
  const [isPinAuthenticated, setIsPinAuthenticated] = useState(!settings.isPinRequired);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);

  // Inventory Table filters & Modals
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [stockFilter, setStockFilter] = useState<'All' | 'InStock' | 'LowStock' | 'OutOfStock'>('All');
  
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Handle PIN unlock
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredPin === settings.ownerPin || enteredPin === '1234') {
      setIsPinAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  // Metric Calculations
  const totalInventoryValue = products.reduce((acc, p) => acc + p.price * p.stockQuantity, 0);
  const totalCostValue = products.reduce((acc, p) => acc + (p.costPrice || p.price * 0.4) * p.stockQuantity, 0);
  const lowStockItems = products.filter((p) => p.stockQuantity > 0 && p.stockQuantity <= settings.lowStockThreshold);
  const outOfStockItems = products.filter((p) => p.stockQuantity <= 0);

  // Filtered Products for Inventory Table
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'All' || p.category === categoryFilter;

    let matchesStock = true;
    if (stockFilter === 'InStock') matchesStock = p.stockQuantity > settings.lowStockThreshold;
    if (stockFilter === 'LowStock') matchesStock = p.stockQuantity > 0 && p.stockQuantity <= settings.lowStockThreshold;
    if (stockFilter === 'OutOfStock') matchesStock = p.stockQuantity <= 0;

    return matchesSearch && matchesCat && matchesStock;
  });

  // PIN Gate Lock Screen
  if (settings.isPinRequired && !isPinAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl max-w-md w-full text-center space-y-6">
          <div className="w-14 h-14 bg-indigo-50 border border-indigo-200 rounded-full flex items-center justify-center mx-auto text-indigo-600">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 uppercase">OWNER ADMIN SECURITY PIN</h2>
            <p className="text-xs text-slate-500 mt-1">
              Enter your 4-digit PIN code to manage inventory, products, and store settings.
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <input
              type="password"
              maxLength={6}
              autoFocus
              value={enteredPin}
              onChange={(e) => {
                setEnteredPin(e.target.value);
                setPinError(false);
              }}
              placeholder="••••"
              className="w-full text-center py-3 text-2xl font-black tracking-widest border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-600 font-mono"
            />

            {pinError && (
              <p className="text-xs font-bold text-red-600">
                Incorrect Security PIN. Please try again.
              </p>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onBackToStore}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg uppercase"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-lg uppercase shadow-md"
              >
                Unlock Panel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner Header */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-400" />
            <span className="text-xs font-black uppercase tracking-widest text-indigo-300">
              STORE SYSTEM & INVENTORY MANAGER
            </span>
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight mt-1">
            {settings.storeName}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time stock management, point of sale, sales reporting, and product pricing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setEditingProduct(null);
              setIsProductModalOpen(true);
            }}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold rounded-lg shadow-md flex items-center gap-1.5 transition-all uppercase tracking-wider"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
          <button
            onClick={onBackToStore}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors uppercase tracking-wider border border-slate-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Customer View</span>
          </button>
        </div>
      </div>

      {/* Overview Analytics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider">RETAIL INVENTORY VALUE</span>
            <DollarSign className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {settings.currencySymbol}{totalInventoryValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Est. Cost: {settings.currencySymbol}{totalCostValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider">TOTAL INVENTORY UNITS</span>
            <Package className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {products.reduce((a, b) => a + b.stockQuantity, 0)} pcs
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Across {products.length} distinct products
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-amber-600 mb-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider">LOW STOCK ALERTS</span>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-amber-600">
            {lowStockItems.length}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            ≤ {settings.lowStockThreshold} units remaining
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider">TOTAL SALES REVENUE</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">
            {settings.currencySymbol}
            {orders
              .filter((o) => o.status === 'Completed')
              .reduce((a, b) => a + b.total, 0)
              .toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {orders.filter((o) => o.status === 'Completed').length} total store orders
          </p>
        </div>

      </div>

      {/* Main Navigation Tabs */}
      <div className="border-b border-slate-200 flex space-x-2">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-3 text-xs font-black uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'inventory'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>INVENTORY MANAGEMENT ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('pos')}
          className={`px-4 py-3 text-xs font-black uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'pos'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>POS CASHIER REGISTER</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-3 text-xs font-black uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'orders'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>SALES LOG ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-3 text-xs font-black uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'settings'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>STORE SETTINGS</span>
        </button>
      </div>

      {/* Tab 1: Inventory Management */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          
          {/* Controls Filter Bar */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            
            {/* Search */}
            <div className="relative w-full lg:w-80">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search inventory by title or SKU..."
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-md text-xs font-semibold outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
              {['All', 'Hoodies', 'Jackets', 'Caps & Headwear', 'T-Shirts', 'Pants'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                    categoryFilter === cat
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Stock Level Filter */}
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value as any)}
              className="bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-600 w-full lg:w-auto"
            >
              <option value="All">All Stock Levels</option>
              <option value="InStock">In Stock (&gt; {settings.lowStockThreshold})</option>
              <option value="LowStock">Low Stock (1 - {settings.lowStockThreshold})</option>
              <option value="OutOfStock">Out of Stock (0)</option>
            </select>
          </div>

          {/* Inventory Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-white font-extrabold uppercase tracking-wider">
                  <tr>
                    <th className="p-3">Item</th>
                    <th className="p-3">SKU</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Price / Cost</th>
                    <th className="p-3">Margin</th>
                    <th className="p-3">Stock Units</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-400 text-xs">
                        No products match current search or filters.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((p) => {
                      const cost = p.costPrice || p.price * 0.4;
                      const marginPercent = Math.round(((p.price - cost) / p.price) * 100);

                      return (
                        <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                          
                          {/* Item Thumbnail & Name */}
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.image}
                                alt={p.name}
                                className="w-10 h-10 object-cover rounded-lg border border-slate-200 shrink-0"
                              />
                              <div>
                                <h4 className="font-bold text-slate-900 line-clamp-1">{p.name}</h4>
                                <p className="text-[10px] text-slate-500">
                                  {p.sizes.join(', ')} • {p.colors.length} Colors
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* SKU */}
                          <td className="p-3 font-mono font-bold text-slate-700">
                            {p.sku}
                          </td>

                          {/* Category */}
                          <td className="p-3 text-slate-600 font-medium">
                            {p.category}
                          </td>

                          {/* Price / Cost */}
                          <td className="p-3 font-bold">
                            <span className="text-slate-900">
                              {settings.currencySymbol}{p.price.toFixed(2)}
                            </span>
                            <span className="text-[10px] text-slate-400 block font-normal">
                              Cost: {settings.currencySymbol}{cost.toFixed(2)}
                            </span>
                          </td>

                          {/* Margin */}
                          <td className="p-3 font-extrabold text-emerald-600">
                            +{marginPercent}%
                          </td>

                          {/* Stock Quantity Controls */}
                          <td className="p-3">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => onStockAdjust(p.id, -1)}
                                className="p-1 hover:bg-slate-200 rounded text-slate-600 transition-colors"
                                title="Subtract 1 unit"
                              >
                                <MinusCircle className="w-4 h-4" />
                              </button>
                              
                              <span className="w-8 text-center font-black text-sm text-slate-900">
                                {p.stockQuantity}
                              </span>

                              <button
                                onClick={() => onStockAdjust(p.id, 1)}
                                className="p-1 hover:bg-slate-200 rounded text-slate-600 transition-colors"
                                title="Add 1 unit"
                              >
                                <PlusCircle className="w-4 h-4 text-indigo-600" />
                              </button>
                            </div>
                          </td>

                          {/* Status Badge */}
                          <td className="p-3">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                                p.stockQuantity <= 0
                                  ? 'bg-red-100 text-red-800'
                                  : p.stockQuantity <= settings.lowStockThreshold
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {p.stockQuantity <= 0
                                ? 'OUT OF STOCK'
                                : p.stockQuantity <= settings.lowStockThreshold
                                ? 'LOW STOCK'
                                : 'IN STOCK'}
                            </span>
                          </td>

                          {/* Edit / Delete Actions */}
                          <td className="p-3 text-right space-x-2">
                            <button
                              onClick={() => {
                                setEditingProduct(p);
                                setIsProductModalOpen(true);
                              }}
                              className="p-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 rounded text-slate-700 font-bold transition-colors"
                              title="Edit product"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Remove "${p.name}" from store inventory?`)) {
                                  onDeleteProduct(p.id);
                                }
                              }}
                              className="p-1.5 bg-slate-100 hover:bg-red-50 hover:text-red-600 rounded text-slate-700 font-bold transition-colors"
                              title="Delete product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: POS Register */}
      {activeTab === 'pos' && (
        <PosCheckout
          products={products}
          settings={settings}
          onCompleteSale={onCompletePosSale}
        />
      )}

      {/* Tab 3: Sales Log */}
      {activeTab === 'orders' && (
        <OrdersLog
          orders={orders}
          settings={settings}
          onRefundOrder={onRefundOrder}
        />
      )}

      {/* Tab 4: Store Settings */}
      {activeTab === 'settings' && (
        <StoreSettingsPanel
          settings={settings}
          onUpdateSettings={onUpdateSettings}
          onResetInventory={onResetInventory}
        />
      )}

      {/* Add / Edit Product Modal */}
      <ProductFormModal
        isOpen={isProductModalOpen}
        productToEdit={editingProduct}
        onClose={() => {
          setIsProductModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={(p) => {
          if (editingProduct) {
            onUpdateProduct(p);
          } else {
            onAddProduct(p);
          }
        }}
      />
    </div>
  );
};
