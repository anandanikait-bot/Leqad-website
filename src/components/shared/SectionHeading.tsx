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
        <div className="inline-flex items-center gap-3">
          <span className="h-px w-7 bg-[#793327]" aria-hidden="true" />
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[#62281F]">
            {eyebrow}
          </span>
        </div>
      )}
      <h2 className="text-[clamp(1.7rem,3vw,2.7rem)] font-semibold leading-[1.13] tracking-[-0.04em] text-[#0E2943]">
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
