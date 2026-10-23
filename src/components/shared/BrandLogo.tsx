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
    sm: 'h-8',
    md: 'h-11 md:h-12',
    lg: 'h-14 md:h-16',
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
