import { formatNumber } from '@/lib/format';

const palette = ['#14b8a6', '#0ea5e9', '#6366f1', '#f59e0b', '#ef4444', '#8b5cf6'];

export function DonutChart({ segments = [] }) {
  const total = segments.reduce((sum, segment) => sum + Number(segment.value || 0), 0);
  let cursor = 0;
  const stops = segments.map((segment, index) => {
    const start = cursor;
    const slice = total ? (Number(segment.value || 0) / total) * 100 : 0;
    cursor += slice;
    return `${palette[index % palette.length]} ${start}% ${cursor}%`;
  });

  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-center">
      <div className="relative mx-auto h-44 w-44 shrink-0">
        <div
          className="h-full w-full rounded-full"
          style={{ background: `conic-gradient(${stops.join(', ') || '#e2e8f0 0 100%'})` }}
        />
        <div className="absolute inset-5 flex flex-col items-center justify-center rounded-full bg-white shadow-inner">
          <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Tổng</div>
          <div className="mt-2 text-2xl font-bold text-slate-950">{formatNumber(total)}</div>
        </div>
      </div>
      <div className="grid flex-1 gap-3">
        {segments.map((segment, index) => (
          <div key={segment.label} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full" style={{ background: palette[index % palette.length] }} />
              <span className="text-sm font-medium text-slate-700">{segment.label}</span>
            </div>
            <div className="text-sm text-slate-500">{formatNumber(segment.value)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
