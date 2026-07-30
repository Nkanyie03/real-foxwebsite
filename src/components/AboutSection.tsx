import React from 'react';
import { ShieldCheck, Flame, Compass, Layers } from 'lucide-react';
import { RealFoxLogo } from './RealFoxLogo';
import streetModelImg from '../assets/images/real_fox_street_model_1785432688731.jpg';

export const AboutSection: React.FC = () => {
  return (
    <section id="about-brand-section" className="py-20 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Image Column */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-slate-900 border border-slate-800">
            <img
              src={streetModelImg}
              alt="Real Fox Culture"
              className="w-full h-full object-cover max-h-[560px]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent p-8 flex flex-col justify-end">
              <span className="text-indigo-400 text-xs font-black uppercase tracking-widest">
                AUTHENTIC URBAN CRAFT
              </span>
              <h3 className="text-2xl font-black text-white mt-1">
                BORN ON THE STREETS. ENGINEERED FOR MOTION.
              </h3>
            </div>
          </div>

          {/* Text & Philosophy Column */}
          <div className="space-y-6">
            <div>
              <RealFoxLogo variant="full" size="lg" />
            </div>

            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              RAW MINIMALISM. UNCOMPROMISING FABRICS.
            </h2>

            <p className="text-slate-600 text-sm leading-relaxed">
              Founded with a mission to eliminate low-grade synthetic fast fashion, <strong className="text-slate-900">REAL FOX STREET WEAR</strong> crafts premium heavyweight apparel built to endure everyday urban movement. Every silhouette is meticulously cut, pre-shrunk, and custom-finished.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                <Flame className="w-5 h-5 text-indigo-600 mb-2" />
                <h4 className="text-xs font-black text-slate-900 uppercase">450+ GSM French Terry</h4>
                <p className="text-[11px] text-slate-500 mt-1">
                  Ultra-dense natural cotton weave providing thick structure and thermal insulation.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                <ShieldCheck className="w-5 h-5 text-indigo-600 mb-2" />
                <h4 className="text-xs font-black text-slate-900 uppercase">Pre-Shrunk Guarantee</h4>
                <p className="text-[11px] text-slate-500 mt-1">
                  Enzyme garment washing ensures your fit remains consistent wear after wear.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                <Layers className="w-5 h-5 text-indigo-600 mb-2" />
                <h4 className="text-xs font-black text-slate-900 uppercase">Precision Stitching</h4>
                <p className="text-[11px] text-slate-500 mt-1">
                  Double-needle flatlock seams engineered for heavy wear and elasticity.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                <Compass className="w-5 h-5 text-indigo-600 mb-2" />
                <h4 className="text-xs font-black text-slate-900 uppercase">Global Street Culture</h4>
                <p className="text-[11px] text-slate-500 mt-1">
                  Designed in collaboration with local urban artists, skaters, and musicians.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
