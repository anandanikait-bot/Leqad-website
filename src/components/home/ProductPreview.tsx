import React from 'react';
import { DemoWorkbench } from '../demo/DemoWorkbench';
import { PageRoute } from '../../types';
import { Maximize2 } from 'lucide-react';

interface ProductPreviewProps {
  onNavigate: (page: PageRoute) => void;
}

export const ProductPreview: React.FC<ProductPreviewProps> = ({ onNavigate }) => {
  return (
    <section id="product-preview" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 scroll-mt-20">
      <div className="bg-white rounded-2xl border border-[#D9DDD9] shadow-sm p-3 sm:p-5">
        {/* Workspace Window Chrome Bar */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#D9DDD9] text-xs">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#D9DDD9]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#D9DDD9]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#D9DDD9]" />
            </div>
            <div className="h-4 w-[1px] bg-[#D9DDD9] mx-1" />
            <span className="font-mono text-[#0E2943] font-semibold text-[11px] truncate">
              Simulated CAD Environment — Step 03: Start sketch
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('demo')}
              className="bg-[#0E2943] text-white hover:bg-[#163859] px-3 py-1.5 rounded-md font-mono text-[11px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs whitespace-nowrap"
            >
              <span>Explore Full Demo</span>
              <Maximize2 className="w-3.5 h-3.5 text-[#B74B21]" />
            </button>
          </div>
        </div>

        {/* Interactive Workbench preview (keyboard shortcuts disabled on homepage per Fix #10) */}
        <DemoWorkbench
          initialStepIndex={2}
          isHeroPreview={true}
          enableKeyboardShortcuts={false}
        />
      </div>
    </section>
  );
};
