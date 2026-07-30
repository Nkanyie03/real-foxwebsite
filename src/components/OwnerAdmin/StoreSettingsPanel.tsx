import React, { useState } from 'react';
import { Settings, ShieldCheck, Lock, RotateCcw, Save, DollarSign, Percent, AlertTriangle } from 'lucide-react';
import { StoreSettings } from '../../types';

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
