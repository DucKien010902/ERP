'use client';

export function PageHeader({ eyebrow, title, description, actions, children }) {
  return (
    <div className="space-y-3">
      {actions ? <div className="flex justify-end">{actions}</div> : null}
      {children}
    </div>
  );
}
