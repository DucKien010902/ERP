import { Icon } from './icons';

export function EmptyState({ title = 'Chưa có dữ liệu', description = 'Hãy thêm dữ liệu đầu tiên hoặc kiểm tra lại bộ lọc.' }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-500 shadow-sm">
        <Icon name="database" />
      </div>
      <div className="mt-4 text-lg font-semibold text-slate-900">{title}</div>
      <div className="mt-2 max-w-md text-sm text-slate-500">{description}</div>
    </div>
  );
}
