import React from 'react';

interface BrandLogoProps {
  className?: string;
  symbolOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  /** Background for this logo: default is the website's light navbar. */
  surface?: 'light' | 'dark';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  symbolOnly = false,
  size = 'md',
  surface = 'light',
}) => {
  const height = {
    // Render the untouched vector slightly larger so fine emblem details
    // occupy more real pixels, without scaling it beyond the layout bounds.
    sm: 'h-14 sm:h-[60px] lg:h-16',
    md: 'h-14',
    lg: 'h-16 md:h-[68px]',
  }[size];
  const asset = symbolOnly ? 'symbol' : 'horizontal';
  // Always render the approved lockup as ONE image: no duplicate text label,
  // anti-aliased raster scaling, blending filter, or background frame.
  const src = `/assets/brand/leqad-official-${asset}-${surface}-v1.svg`;
  return (
    <img
      src={src}
      alt="Leqad logo"
      width={symbolOnly ? 476 : 1625}
      height={470}
      draggable={false}
      className={`block w-auto max-w-full ${height} object-contain select-none ${className}`}
    />
  );
};
