import React, { useState } from 'react';
import { X, Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { RealFoxLogo } from './RealFoxLogo';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: 'Order Inquiry', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
        
        {/* Header matching brand color */}
        <div className="bg-indigo-600 p-6 text-white flex items-center justify-between">
          <div>
            <RealFoxLogo variant="light" size="sm" />
            <h3 className="text-lg font-black uppercase mt-2 tracking-wide">GET IN TOUCH</h3>
          </div>
          <button onClick={onClose} className="p-2 text-white/80 hover:text-white rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto" />
            <h4 className="text-xl font-black text-slate-900">MESSAGE SENT!</h4>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              Our support team will get back to your email within 24 hours.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="mt-4 px-6 py-2.5 bg-indigo-600 text-white rounded-md text-xs font-bold uppercase tracking-wider hover:bg-indigo-700 transition-colors"
            >
              CLOSE
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full px-3 py-2 border border-slate-200 rounded-md text-xs outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="john@example.com"
                  className="w-full px-3 py-2 border border-slate-200 rounded-md text-xs outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Topic</label>
              <select
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-md text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-600"
              >
                <option value="Order Inquiry">Order Inquiry / Tracking</option>
                <option value="Size Exchange">Size Exchange & Returns</option>
                <option value="Wholesale">Wholesale & Brand Collaboration</option>
                <option value="Press">Press & Media</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Message</label>
              <textarea
                rows={4}
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="How can we help you?"
                className="w-full px-3 py-2 border border-slate-200 rounded-md text-xs outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            {/* Direct Contacts */}
            <div className="pt-2 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-[10px] text-slate-500">
              <div className="flex items-center justify-center gap-1">
                <Mail className="w-3 h-3 text-indigo-600" />
                <span>support@realfox.com</span>
              </div>
              <div className="flex items-center justify-center gap-1">
                <Phone className="w-3 h-3 text-indigo-600" />
                <span>+1 (800) 555-FOX</span>
              </div>
              <div className="flex items-center justify-center gap-1">
                <MapPin className="w-3 h-3 text-indigo-600" />
                <span>LA Flagship Store</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-md shadow-indigo-950/20"
            >
              <Send className="w-4 h-4" />
              <span>SEND MESSAGE</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
