import React from 'react';
import { DemoWorkbench } from '../demo/DemoWorkbench';
import { PageRoute } from '../../types';
import { ArrowRight, Maximize2 } from 'lucide-react';

interface ProductPreviewProps {
  onNavigate: (page: PageRoute) => void;
}

export const ProductPreview: React.FC<ProductPreviewProps> = ({ onNavigate }) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
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
            <span className="font-mono text-[#0E2943] font-semibold text-[11px]">
              Onshape CAD Session — Document: First_Mounting_Plate
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('demo')}
              className="text-[#B74B21] hover:text-[#9C3F1B] font-mono text-[11px] font-medium flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>Open full interactive demo</span>
              <Maximize2 className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Live Interactive Workbench showing Step 3: Create a rectangle */}
        <DemoWorkbench initialStepIndex={2} isHeroPreview={true} />
      </div>
    </section>
  );
};
