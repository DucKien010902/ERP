export function FieldLabel({ label, required, hint }) {
  return (
    <div className="mb-2 flex items-center justify-between gap-2">
      <label className="text-sm font-medium text-slate-700">
        {label}
        {required ? <span className="text-rose-500"> *</span> : null}
      </label>
      {hint ? <span className="text-xs text-slate-400">{hint}</span> : null}
    </div>
  );
}

const inputBase = 'w-full rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-400 focus:ring-4 focus:ring-teal-100';

export function Input({ label, hint, required, className = '', ...props }) {
  return (
    <div>
      {label ? <FieldLabel label={label} required={required} hint={hint} /> : null}
      <input className={`${inputBase} ${className}`} {...props} />
    </div>
  );
}

export function Select({ label, hint, required, children, className = '', ...props }) {
  return (
    <div>
      {label ? <FieldLabel label={label} required={required} hint={hint} /> : null}
      <select className={`${inputBase} ${className}`} {...props}>
        {children}
      </select>
    </div>
  );
}

export function Textarea({ label, hint, required, className = '', ...props }) {
  return (
    <div>
      {label ? <FieldLabel label={label} required={required} hint={hint} /> : null}
      <textarea className={`${inputBase} min-h-[108px] resize-y ${className}`} {...props} />
    </div>
  );
}

export function Checkbox({ label, description, checked, onChange, className = '' }) {
  return (
    <label className={`flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-3 ${className}`}>
      <input type="checkbox" className="mt-1 h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500" checked={checked} onChange={(event) => onChange?.(event.target.checked)} />
      <div>
        <div className="text-sm font-medium text-slate-700">{label}</div>
        {description ? <div className="mt-1 text-xs text-slate-500">{description}</div> : null}
      </div>
    </label>
  );
}
