interface SectionTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function SectionTitle({ title, subtitle, className = '', action }: SectionTitleProps) {
  return (
    <div className={`flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-white/5 pb-6 ${className}`}>
      <div>
        <h2 className="text-3xl lg:text-5xl font-bold uppercase tracking-tighter text-white leading-none">
          {title}
        </h2>
        {subtitle && (
          <p className="text-white/40 text-[10px] lg:text-[12px] uppercase tracking-[0.2em] font-bold mt-3">
            {subtitle}
          </p>
        )}
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="text-white/40 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] shrink-0 transition-colors border-b border-white/10 hover:border-white pb-1"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
