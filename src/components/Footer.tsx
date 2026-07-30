import React from 'react';
import { RealFoxLogo } from './RealFoxLogo';
import { Instagram, Twitter, Facebook, Youtube, ShieldCheck, Truck, RefreshCw, CreditCard } from 'lucide-react';
import { StoreSettings } from '../types';

interface FooterProps {
  onOpenContact: () => void;
  onOpenAuth: () => void;
  settings?: StoreSettings;
}

export const Footer: React.FC<FooterProps> = ({ onOpenContact, onOpenAuth, settings }) => {
  return (
    <footer className="bg-slate-950 text-white pt-16 pb-12 border-t border-slate-900">
      
      {/* Brand Perks Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 p-6 bg-slate-900/60 rounded-xl border border-slate-800">
          <div className="flex items-center gap-3">
            <Truck className="w-6 h-6 text-indigo-400" />
            <div>
              <h5 className="text-xs font-black uppercase">FREE SHIPPING</h5>
              <p className="text-[11px] text-slate-400">On all orders over $100</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <RefreshCw className="w-6 h-6 text-indigo-400" />
            <div>
              <h5 className="text-xs font-black uppercase">EASY RETURNS</h5>
              <p className="text-[11px] text-slate-400">30-day exchange window</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-indigo-400" />
            <div>
              <h5 className="text-xs font-black uppercase">AUTHENTIC GUARANTEE</h5>
              <p className="text-[11px] text-slate-400">450+ GSM French Terry</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CreditCard className="w-6 h-6 text-indigo-400" />
            <div>
              <h5 className="text-xs font-black uppercase">SECURE PAYMENT</h5>
              <p className="text-[11px] text-slate-400">Encrypted checkout</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-900">
          
          {/* Logo & Info */}
          <div className="space-y-4 md:col-span-1">
            <RealFoxLogo logoUrl={settings?.logoUrl} storeName={settings?.storeName} variant="light" size="md" />
            <p className="text-xs text-slate-400 leading-relaxed">
              Real Fox Street Wear is an independent urban fashion house producing heavy-duty minimalist streetwear for everyday movement.
            </p>
            <div className="flex space-x-3 pt-2">
              <a href="#instagram" className="p-2 bg-slate-900 hover:bg-indigo-600 text-slate-400 hover:text-white rounded-full transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#twitter" className="p-2 bg-slate-900 hover:bg-indigo-600 text-slate-400 hover:text-white rounded-full transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#facebook" className="p-2 bg-slate-900 hover:bg-indigo-600 text-slate-400 hover:text-white rounded-full transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#youtube" className="p-2 bg-slate-900 hover:bg-indigo-600 text-slate-400 hover:text-white rounded-full transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider mb-4 text-white">SHOP CATALOG</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#product-gallery-section" className="hover:text-white transition-colors">Hoodies & Sweatshirts</a></li>
              <li><a href="#product-gallery-section" className="hover:text-white transition-colors">Bomber Jackets & Outerwear</a></li>
              <li><a href="#product-gallery-section" className="hover:text-white transition-colors">Caps & Snapbacks</a></li>
              <li><a href="#product-gallery-section" className="hover:text-white transition-colors">Heavyweight Graphic Tees</a></li>
              <li><a href="#product-gallery-section" className="hover:text-white transition-colors">Tactical Cargo Pants</a></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider mb-4 text-white">CUSTOMER CARE</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><button onClick={onOpenContact} className="hover:text-white transition-colors">Order Tracking</button></li>
              <li><button onClick={onOpenContact} className="hover:text-white transition-colors">Size Guide & Fit</button></li>
              <li><button onClick={onOpenContact} className="hover:text-white transition-colors">Shipping & Returns Policy</button></li>
              <li><button onClick={onOpenAuth} className="hover:text-white transition-colors">Account Login</button></li>
              <li><button onClick={onOpenContact} className="hover:text-white transition-colors">Contact Support</button></li>
            </ul>
          </div>

          {/* VIP Newsletter */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider mb-4 text-white">REAL FOX INSIDERS</h4>
            <p className="text-xs text-slate-400 mb-3">
              Subscribe for exclusive drop access, secret promo codes, and limited colorway releases.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed to Real Fox Insider Drops!'); }} className="space-y-2">
              <input
                type="email"
                required
                placeholder="Enter your email"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-md text-xs text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-600"
              />
              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-xs font-extrabold uppercase tracking-wider transition-colors"
              >
                JOIN THE DROP LIST
              </button>
            </form>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
          <p>© 2026 REAL FOX STREET WEAR. All rights reserved.</p>
          <div className="flex space-x-4">
            <a href="#privacy" className="hover:text-slate-300">Privacy Policy</a>
            <a href="#terms" className="hover:text-slate-300">Terms of Service</a>
            <a href="#cookies" className="hover:text-slate-300">Cookie Preferences</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
