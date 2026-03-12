import { memo } from 'react';

const SectionHeading = memo(function SectionHeading({ title, subtitle, gradient = true, align = 'center' }) {
  const alignment = align === 'center' ? 'text-center' : 'text-left';
  return (
    <div className={`mb-12 ${alignment}`}>
      <h2 className={`text-3xl font-extrabold sm:text-4xl lg:text-5xl ${gradient ? 'text-gradient' : 'text-white'}`}>
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 max-w-2xl text-lg text-cerve-muted mx-auto">{subtitle}</p>
      )}
    </div>
  );
});

export default SectionHeading;
