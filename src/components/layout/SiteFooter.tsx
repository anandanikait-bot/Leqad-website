import React from 'react';
import HalftoneWordmarkFooter from '@/components/ui/halftone-wordmark-footer';

export const SiteFooter: React.FC = () => (
  <footer className="w-full bg-[#0E2943] text-[#F5EFE7]">
    <HalftoneWordmarkFooter
      as="div"
      wordmark="leqad"
      label=""
      meta=""
      columns={[]}
      backToTop={false}
      palette={{ background: '#0E2943', ink: '#F5EFE7', warm: '#B74B21' }}
      grain={0.25}
      dotGap={7}
      height="clamp(220px, 24vw, 310px)"
      crop={0}
    />
  </footer>
);
