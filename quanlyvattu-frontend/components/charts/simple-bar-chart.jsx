import { formatCurrency, formatNumber } from '@/lib/format';

export function SimpleBarChart({ data = [], valueLabel = 'Giá trị', mode = 'number', compact = false }) {
  const max = Math.max(...data.map((item) => Number(item.value || 0)), 1);

  return (
    <div className="space-y-3">
      {data.map((item) => {
        const percentage = Math.max(6, (Number(item.value || 0) / max) * 100);
        return (
          <div key={item.label} className="space-y-1.5">
            <div className="flex items-center justify-between gap-3 text-sm">
              <div className="truncate text-sm font-medium text-slate-700">{item.label}</div>
              <div className="shrink-0 text-[11px] text-slate-500">
                {mode === 'currency' ? formatCurrency(item.value) : formatNumber(item.value, compact ? 0 : 2)}
              </div>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-teal-500 via-cyan-500 to-sky-500"
                style={{ width: `${percentage}%` }}
                aria-label={`${item.label}: ${valueLabel} ${item.value}`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
