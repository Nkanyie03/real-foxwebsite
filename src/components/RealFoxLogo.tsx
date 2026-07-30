import React from 'react';

interface RealFoxLogoProps {
  className?: string;
  variant?: 'full' | 'icon-only' | 'text-only' | 'light';
  size?: 'sm' | 'md' | 'lg';
}

export const RealFoxLogo: React.FC<RealFoxLogoProps> = ({
  className = '',
  variant = 'full',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'scale-90',
    md: 'scale-100',
    lg: 'scale-125',
  };

  return (
    <div className={`flex items-center gap-3 select-none ${sizeClasses[size]} ${className}`}>
      {variant !== 'text-only' && (
        <div className="relative flex items-center justify-center">
          {/* Geometric Fox SVG outline matching image */}
          <svg
            width="38"
            height="38"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-slate-900 group-hover:text-blue-600 transition-colors"
          >
            {/* Outer Ear outlines */}
            <polygon
              points="50,92 12,38 30,12 50,38"
              stroke="currentColor"
              strokeWidth="5"
              strokeLinejoin="round"
            />
            <polygon
              points="50,92 88,38 70,12 50,38"
              stroke="currentColor"
              strokeWidth="5"
              strokeLinejoin="round"
            />
            {/* Inner Ear detail */}
            <polygon
              points="30,12 40,28 32,32"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <polygon
              points="70,12 60,28 68,32"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            {/* Nose bridge & eyes line */}
            <polyline
              points="32,38 50,56 68,38"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            {/* Center snout line */}
            <line
              x1="50"
              y1="38"
              x2="50"
              y2="92"
              stroke="currentColor"
              strokeWidth="4"
            />
          </svg>
        </div>
      )}

      {variant !== 'icon-only' && (
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1 font-sans">
            <span
              className={`text-2xl font-black tracking-tight leading-none ${
                variant === 'light' ? 'text-white' : 'text-indigo-600'
              }`}
              style={{
                fontFamily: 'ui-rounded, system-ui, sans-serif',
                letterSpacing: '-0.04em',
              }}
            >
              real fox
            </span>
          </div>
          <span
            className={`text-[9px] font-bold tracking-[0.22em] uppercase leading-none mt-1 ${
              variant === 'light' ? 'text-slate-300' : 'text-slate-800'
            }`}
          >
            STREET WEAR
          </span>
        </div>
      )}
    </div>
  );
};
