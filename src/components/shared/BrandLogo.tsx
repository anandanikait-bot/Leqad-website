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
    sm: { symbol: 'w-7 h-7', text: 'text-lg' },
    md: { symbol: 'w-11 h-11 md:w-12 md:h-12', text: 'text-xl' },
    lg: { symbol: 'w-12 h-12', text: 'text-2xl' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Approved Leqad emblem, presented without an extra border or frame. */}
      <div
        className={`${currentSize.symbol} shrink-0 flex items-center justify-center`}
        title="Leqad — In-Workflow CAD Education"
      >
        <img
          src="/assets/brand/leqad-approved.png"
          alt="Leqad logo"
          className="block w-full h-full object-contain mix-blend-multiply"
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
