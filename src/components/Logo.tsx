export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <svg
        viewBox="0 0 48 48"
        className="h-11 w-11 shrink-0"
        aria-hidden="true"
        fill="none"
      >
        <circle cx="24" cy="24" r="22.5" stroke="#C9A227" strokeWidth="1.4" />
        <path d="M24 8v20" stroke="#4C1D1D" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M16 16h16" stroke="#4C1D1D" strokeWidth="2.2" strokeLinecap="round" />
        <rect x="14" y="30" width="20" height="10" rx="1" stroke="#8E3B32" strokeWidth="1.6" />
        <path
          d="M18 30v10M22 30v10M26 30v10M30 30v10M14 33.3h20M14 36.6h20"
          stroke="#C9A227"
          strokeWidth="1.1"
        />
      </svg>
      <span className="flex flex-col leading-tight">
        <span className="font-serif text-lg text-wine sm:text-xl">Parafia św. Wawrzyńca</span>
        <span className="text-[0.7rem] uppercase tracking-[0.22em] text-stone">Wilchwy · Wodzisław Śląski</span>
      </span>
    </span>
  );
}
