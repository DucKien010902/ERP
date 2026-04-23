const toneMap = {
  slate: 'border-slate-200 bg-slate-100 text-slate-700',
  blue: 'border-sky-200 bg-sky-50 text-sky-700',
  emerald: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  amber: 'border-amber-200 bg-amber-50 text-amber-700',
  rose: 'border-rose-200 bg-rose-50 text-rose-700',
  teal: 'border-teal-200 bg-teal-50 text-teal-700',
  violet: 'border-violet-200 bg-violet-50 text-violet-700',
};

export function Badge({ children, tone = 'slate', className = '' }) {
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${toneMap[tone] || toneMap.slate} ${className}`}>{children}</span>;
}
