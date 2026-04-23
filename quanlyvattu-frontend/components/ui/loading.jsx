export function LoadingBlock({ label = 'Đang tải dữ liệu...' }) {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center gap-4 rounded-3xl border border-slate-200 bg-white">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-teal-100 border-t-teal-500" />
      <div className="text-sm text-slate-500">{label}</div>
    </div>
  );
}
