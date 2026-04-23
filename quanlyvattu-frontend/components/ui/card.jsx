export function Card({ title, description, action, className = '', children }) {
  return (
    <div className={`rounded-2xl border border-slate-200/80 bg-white shadow-[0_14px_36px_-24px_rgba(15,23,42,0.22)] ${className}`}>
      {(title || description || action) ? (
        <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-3 md:flex-row md:items-center md:justify-between">
          <div>
            {title ? <h3 className="text-sm font-semibold text-slate-900">{title}</h3> : null}
            {description ? <p className="mt-1 text-xs text-slate-500">{description}</p> : null}
          </div>
          {action ? <div className="flex items-center gap-2">{action}</div> : null}
        </div>
      ) : null}
      <div className="p-4">{children}</div>
    </div>
  );
}
