import React from 'react';

interface BrandLogoProps {
  className?: string;
  symbolOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  symbolOnly = false,
  size = 'md',
}) => {
  const sizeMap = {
    sm: { symbol: 'w-6 h-6', text: 'text-lg', badge: 'text-[9px]' },
    md: { symbol: 'w-8 h-8', text: 'text-xl', badge: 'text-[10px]' },
    lg: { symbol: 'w-10 h-10', text: 'text-2xl', badge: 'text-[11px]' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Precision CAD Drafting Emblem */}
      <div
        className={`${currentSize.symbol} relative flex-shrink-0 rounded-md overflow-hidden border border-[#0E2943]/15 flex items-center justify-center shadow-xs`}
        title="Leqad — In-Workflow CAD Education"
      >
        <svg
          viewBox="0 0 278 278"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full rounded-sm"
          role="img"
          aria-labelledby="leqad-logo-title"
        >
          <title id="leqad-logo-title">Leqad</title>
          <rect width="278" height="278" fill="#F5EFE7" />
          <path d="M0 0H268L204.45 64.45H64.45V203.55L0 268Z" fill="#0E2943" />
          <path d="M278 10V278H10L74.45 213.55H213.55V74.45Z" fill="#0E2943" />
          <path d="M89.31 89.31H188.69V188.69H89.31Z" fill="#B74B21" />
        </svg>
      </div>

      {!symbolOnly && (
        <div className="flex items-baseline gap-1.5">
          <span className={`font-semibold tracking-tight text-[#0E2943] ${currentSize.text} leading-none`}>
            Leqad
          </span>
          <span className={`font-mono text-[#55616B] font-medium tracking-wider uppercase ${currentSize.badge}`}>
            CAD
          </span>
        </div>
      )}
    </div>
  );
};
