import { Badge } from './badge';
import { Icon } from './icons';

export function MetricCard({ icon, label, value, helper, tone = 'slate', badge }) {
  const toneClass = {
    slate: 'border-slate-200 bg-slate-50 text-slate-700',
    teal: 'border-teal-200 bg-teal-50 text-teal-700',
    blue: 'border-sky-200 bg-sky-50 text-sky-700',
    emerald: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    amber: 'border-amber-200 bg-amber-50 text-amber-700',
    rose: 'border-rose-200 bg-rose-50 text-rose-700',
    violet: 'border-violet-200 bg-violet-50 text-violet-700',
  };

  return (
    <div className="flex h-[60px] w-[220px] shrink-0 items-center justify-between gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-[0_12px_28px_-24px_rgba(15,23,42,0.3)]">
      <div className="flex min-w-0 items-center gap-3">
        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${toneClass[tone] || toneClass.slate}`}>
          <Icon name={icon} className="h-3.5 w-3.5" />
        </div>
        <div className="min-w-0">
          <div className="truncate text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</div>
          <div className="mt-0.5 flex items-baseline gap-1.5">
            <div className="truncate text-base font-bold text-slate-950">{value}</div>
            {helper ? <div className="truncate text-[11px] text-slate-500">{helper}</div> : null}
          </div>
        </div>
      </div>
      {badge ? <Badge tone={tone} className="shrink-0">{badge}</Badge> : null}
    </div>
  );
}
