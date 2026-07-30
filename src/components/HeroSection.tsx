import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import heroImg from '../assets/images/hero_streetwear_banner_1785432645947.jpg';

interface HeroSectionProps {
  onShopClick: () => void;
  onNewArrivalsClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onShopClick,
  onNewArrivalsClick,
}) => {
  return (
    <section className="relative w-full overflow-hidden bg-slate-900 text-white min-h-[520px] lg:min-h-[580px] flex items-center">
      {/* Background Streetwear Model Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImg}
          alt="Real Fox Streetwear Banner Model"
          className="w-full h-full object-cover object-center lg:object-right filter brightness-90 contrast-105"
          referrerPolicy="no-referrer"
        />
        {/* Dark overlay gradients matching image contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent w-full lg:w-3/4" />
        <div className="absolute inset-0 bg-slate-950/20" />
      </div>

      {/* Hero Content Overlay */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 w-full">
        <div className="max-w-xl space-y-6">
          
          {/* Badge matching Professional Polish pill style */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900/50 border border-indigo-400/30 text-indigo-200 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
            <span>NEW 2026 URBAN COLLECTION</span>
          </div>

          {/* Main Title matching typography */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none text-white uppercase drop-shadow-sm">
            REAL FOX <br />
            <span className="text-indigo-400">STREET WEAR</span>
          </h1>

          {/* Subtitle Paragraph */}
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed font-normal max-w-md drop-shadow-xs">
            Authentic urban apparel designed for everyday movement. Heavyweight French terry cotton, engineered seams, and raw minimalist aesthetic.
          </p>

          {/* CTAs matching Professional Polish design */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            {/* Primary Indigo Button */}
            <button
              id="hero-shop-it-now"
              onClick={onShopClick}
              className="px-8 py-3.5 rounded-md text-xs font-extrabold tracking-wider uppercase text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-950/40 flex items-center gap-2 group"
            >
              <span>SHOP IT NOW</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Secondary Button */}
            <button
              id="hero-shop-now"
              onClick={onNewArrivalsClick}
              className="px-8 py-3.5 rounded-md text-xs font-extrabold tracking-wider uppercase text-slate-100 bg-white/10 hover:bg-white hover:text-slate-900 border border-white/20 active:scale-95 transition-all backdrop-blur-xs"
            >
              OUR PROCESS
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
