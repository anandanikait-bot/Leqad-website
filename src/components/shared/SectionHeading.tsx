import React from 'react';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  description,
  align = 'left',
  className = '',
}) => {
  return (
    <div className={`space-y-3 ${align === 'center' ? 'text-center mx-auto max-w-3xl' : 'max-w-2xl'} ${className}`}>
      {eyebrow && (
        <div className="inline-flex items-center gap-2">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#B74B21] bg-[#B74B21]/10 px-2.5 py-0.5 rounded-xs border border-[#B74B21]/20">
            {eyebrow}
          </span>
        </div>
      )}
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-[#0E2943] leading-tight">
        {title}
      </h2>
      {description && (
        <p className="text-base sm:text-lg text-[#55616B] leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
};
