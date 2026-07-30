import React, { useState } from 'react';
import { Settings, ShieldCheck, Lock, RotateCcw, Save, DollarSign, Percent, AlertTriangle, CreditCard, Image, Upload, Sparkles, X, Eye } from 'lucide-react';
import { StoreSettings } from '../../types';
import { RealFoxLogo } from '../RealFoxLogo';

interface StoreSettingsPanelProps {
  settings: StoreSettings;
  onUpdateSettings: (newSettings: StoreSettings) => void;
  onResetInventory: () => void;
}

export const StoreSettingsPanel: React.FC<StoreSettingsPanelProps> = ({
  settings,
  onUpdateSettings,
  onResetInventory,
}) => {
  const [form, setForm] = useState<StoreSettings>({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sample preset logo options
  const PRESET_LOGOS = [
    {
      name: 'Default Geometric Fox',
      url: '',
      description: 'Original SVG Vector Emblem',
    },
    {
      name: 'Neon Cyber Art',
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
      description: 'Abstract Glowing Gradient',
    },
    {
      name: 'Streetwear Emblem',
      url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=200&q=80',
      description: 'Minimalist Monogram',
    },
    {
      name: 'Cyber Shield',
      url: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=200&q=80',
      description: 'Tactical Urban Shield',
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit. Please choose a smaller image.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setForm((prev) => ({ ...prev, logoUrl: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(form);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* General Store Config Form */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        
        <div className="flex items-center gap-2 pb-4 border-b border-slate-200 mb-5">
          <Settings className="w-5 h-5 text-indigo-600" />
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
            STORE MANAGEMENT PREFERENCES
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Store Name
            </label>
            <input
              type="text"
              required
              value={form.storeName}
              onChange={(e) => setForm({ ...form, storeName: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-md text-xs font-semibold outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          {/* WEBSITE LOGO & BRANDING MANAGEMENT */}
          <div className="pt-4 border-t border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold uppercase text-slate-800 flex items-center gap-1.5">
                <Image className="w-4 h-4 text-indigo-600" />
                Website Logo & Brand Emblem
              </h4>
              {form.logoUrl && (
                <button
                  type="button"
                  onClick={() => setForm({ ...form, logoUrl: '' })}
                  className="text-[10px] font-bold text-slate-500 hover:text-red-600 flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" /> Reset to Default Geometric Logo
                </button>
              )}
            </div>

            {/* Input methods: Upload File or Direct URL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Option 1: File Upload */}
              <div className="p-3 border border-slate-200 rounded-xl bg-slate-50 space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-700 block">
                  1. Upload Custom Image File
                </label>
                <div className="flex items-center gap-2">
                  <label className="flex-1 cursor-pointer py-2 px-3 bg-white border border-slate-300 rounded-lg hover:border-indigo-600 hover:bg-indigo-50/50 transition-all flex items-center justify-center gap-1.5 text-xs font-bold text-slate-700">
                    <Upload className="w-4 h-4 text-indigo-600" />
                    <span>Choose Image File...</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-[9px] text-slate-500">Supports PNG, JPG, SVG, WebP (Max 5MB)</p>
              </div>

              {/* Option 2: Image URL */}
              <div className="p-3 border border-slate-200 rounded-xl bg-slate-50 space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-700 block">
                  2. Or Paste Image Web URL
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/my-logo.png"
                  value={form.logoUrl || ''}
                  onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono font-semibold outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
                />
                <p className="text-[9px] text-slate-500">Direct image URL address</p>
              </div>
            </div>

            {/* Preset Logo Quick Choices */}
            <div>
              <label className="text-[10px] font-black uppercase text-slate-700 block mb-2 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-600" /> Or Select From Quick Sample Streetwear Logos:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PRESET_LOGOS.map((preset) => {
                  const isSelected = (form.logoUrl || '') === preset.url;
                  return (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => setForm({ ...form, logoUrl: preset.url })}
                      className={`p-2 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/80 ring-2 ring-indigo-600'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="h-8 flex items-center justify-center bg-slate-100 rounded-md mb-1.5 overflow-hidden">
                        {preset.url ? (
                          <img src={preset.url} alt={preset.name} className="h-6 object-contain" />
                        ) : (
                          <span className="text-[10px] font-black uppercase text-indigo-600">Default SVG</span>
                        )}
                      </div>
                      <p className="text-[10px] font-extrabold text-slate-800 truncate">{preset.name}</p>
                      <p className="text-[8px] text-slate-500 truncate">{preset.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live Logo Preview Boxes */}
            <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-1 text-[10px] font-black uppercase text-slate-600">
                <Eye className="w-3.5 h-3.5 text-indigo-600" /> Live Logo Header & Footer Preview
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {/* Header Preview (Light Theme) */}
                <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-between shadow-xs">
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Light Theme Header</span>
                  <RealFoxLogo logoUrl={form.logoUrl} storeName={form.storeName} size="sm" />
                </div>
                {/* Footer Preview (Dark Theme) */}
                <div className="p-3 bg-slate-950 text-white rounded-lg border border-slate-800 flex items-center justify-between">
                  <span className="text-[9px] font-bold text-slate-500 uppercase">Dark Theme Footer</span>
                  <RealFoxLogo logoUrl={form.logoUrl} storeName={form.storeName} variant="light" size="sm" />
                </div>
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Currency Symbol
              </label>
              <input
                type="text"
                required
                value={form.currencySymbol}
                onChange={(e) => setForm({ ...form, currencySymbol: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-md text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-600 font-mono text-center"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Sales Tax Rate (%)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                required
                value={form.taxRate}
                onChange={(e) => setForm({ ...form, taxRate: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-slate-200 rounded-md text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Low Stock Alert Threshold
              </label>
              <input
                type="number"
                min="1"
                required
                value={form.lowStockThreshold}
                onChange={(e) => setForm({ ...form, lowStockThreshold: parseInt(e.target.value) || 5 })}
                className="w-full px-3 py-2 border border-slate-200 rounded-md text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
          </div>

          {/* Online Payment Gateways Toggles */}
          <div className="pt-4 border-t border-slate-200 space-y-3">
            <h4 className="text-xs font-extrabold uppercase text-slate-800 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-indigo-600" />
              Accepted Online Payment Gateways
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold text-slate-700">
              <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.enableCardPayments !== false}
                  onChange={(e) => setForm({ ...form, enableCardPayments: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                />
                <span>Credit / Debit Cards (Visa, Mastercard, Amex)</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.enableApplePay !== false}
                  onChange={(e) => setForm({ ...form, enableApplePay: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                />
                <span>Apple Pay & Google Pay (1-Click Express)</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.enablePayPal !== false}
                  onChange={(e) => setForm({ ...form, enablePayPal: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                />
                <span>PayPal Express Checkout</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.enableKlarna !== false}
                  onChange={(e) => setForm({ ...form, enableKlarna: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                />
                <span>Klarna / Afterpay (4 Installment Payments)</span>
              </label>
            </div>
          </div>

          {/* Owner PIN Security Settings */}
          <div className="pt-4 border-t border-slate-200 space-y-3">
            <h4 className="text-xs font-extrabold uppercase text-slate-800 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-indigo-600" />
              Owner Mode Security PIN
            </h4>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isPinRequired}
                  onChange={(e) => setForm({ ...form, isPinRequired: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                />
                <span className="text-xs font-bold text-slate-700 uppercase">
                  Require PIN code to open Owner Admin Mode
                </span>
              </label>
            </div>

            {form.isPinRequired && (
              <div className="w-48">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Owner 4-Digit Security PIN
                </label>
                <input
                  type="password"
                  maxLength={6}
                  value={form.ownerPin}
                  onChange={(e) => setForm({ ...form, ownerPin: e.target.value })}
                  placeholder="1234"
                  className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm font-bold tracking-widest outline-none focus:ring-2 focus:ring-indigo-600 font-mono"
                />
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            {savedSuccess && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> Store preferences updated!
              </span>
            )}
            <button
              type="submit"
              className="ml-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-xs font-extrabold uppercase tracking-wider shadow-md shadow-indigo-950/20 flex items-center gap-1.5 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Settings</span>
            </button>
          </div>
        </form>

      </div>

      {/* Danger Zone: Reset Inventory */}
      <div className="bg-red-50 p-6 rounded-2xl border border-red-200">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-xs font-extrabold text-red-900 uppercase">
              RESET INVENTORY DATA
            </h4>
            <p className="text-xs text-red-700 mt-1">
              Reset store products, prices, and stock counts back to factory default demo inventory. This will wipe custom added products.
            </p>
            <button
              onClick={() => {
                if (confirm('Are you sure you want to reset all inventory products to default sample values?')) {
                  onResetInventory();
                }
              }}
              className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Inventory to Defaults</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
