export function Button({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  loading = false,
  type = 'button',
  ...props
}) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60';
  const variants = {
    primary: 'bg-[var(--color-accent)] text-white shadow-lg shadow-teal-500/20 hover:bg-[var(--color-accent-strong)]',
    secondary: 'border border-slate-200 bg-white text-slate-700 hover:border-teal-200 hover:text-teal-700',
    ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
    danger: 'bg-rose-600 text-white shadow-lg shadow-rose-500/20 hover:bg-rose-700',
    success: 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-700',
  };
  const sizes = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-9 px-3.5 text-sm',
    lg: 'h-10 px-4 text-sm',
  };

  return (
    <button type={type} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} disabled={loading || props.disabled} {...props}>
      {loading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : null}
      {children}
    </button>
  );
}
