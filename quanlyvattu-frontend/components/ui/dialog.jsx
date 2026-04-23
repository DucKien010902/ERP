'use client';

import { useEffect } from 'react';
import { Button } from './button';

export function Dialog({
  open,
  onClose,
  title,
  description,
  side = 'center',
  width = 'max-w-2xl',
  footer,
  children,
}) {
  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [open, onClose]);

  if (!open) return null;

  const isRight = side === 'right';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm">
      <button className="absolute inset-0 h-full w-full cursor-default" onClick={onClose} aria-label="Đóng" />

      {isRight ? (
        <div className="relative flex h-full justify-end">
          <div className="relative h-full w-full max-w-2xl overflow-hidden border-l border-slate-200 bg-white shadow-2xl md:rounded-l-[2rem]">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
              <div className="min-w-0">
                {title ? <h3 className="text-base font-semibold text-slate-900">{title}</h3> : null}
                {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>Đóng</Button>
            </div>
            <div className="h-[calc(100%-132px)] overflow-y-auto px-5 py-4">
              {children}
            </div>
            <div className="border-t border-slate-100 px-5 py-4">{footer}</div>
          </div>
        </div>
      ) : (
        <div className="relative flex min-h-full items-center justify-center p-4 md:p-6">
          <div className={`relative w-full ${width}`}>
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
                <div className="min-w-0">
                  {title ? <h3 className="text-base font-semibold text-slate-900">{title}</h3> : null}
                  {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
                </div>
                <Button variant="ghost" size="sm" onClick={onClose}>Đóng</Button>
              </div>
              <div className="max-h-[calc(100vh-220px)] overflow-y-auto px-5 py-4">
                {children}
              </div>
              <div className="border-t border-slate-100 px-5 py-4">{footer}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
