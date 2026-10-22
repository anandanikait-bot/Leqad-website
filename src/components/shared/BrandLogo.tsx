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
    sm: { symbol: 'w-6 h-6', text: 'text-lg' },
    md: { symbol: 'w-8 h-8', text: 'text-xl' },
    lg: { symbol: 'w-10 h-10', text: 'text-2xl' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Precision CAD Drafting Emblem */}
      <div
        className={`${currentSize.symbol} relative flex-shrink-0 rounded-full overflow-hidden flex items-center justify-center`}
        title="Leqad — In-Workflow CAD Education"
      >
        <img
          src="/assets/brand/leqad-approved.png"
          alt="Leqad logo"
          className="w-full h-full object-contain"
          width="1254"
          height="1254"
        />
      </div>

      {!symbolOnly && (
        <div className="flex items-baseline gap-1.5">
          <span className={`font-semibold tracking-tight text-[#0E2943] ${currentSize.text} leading-none`}>
            Leqad
          </span>

        </div>
      )}
    </div>
  );
};
