'use client';

import { createContext, useContext, useMemo, useState } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  function pushToast(type, title, description) {
    const id = crypto.randomUUID();
    setToasts((current) => [...current, { id, type, title, description }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 4200);
  }

  const value = useMemo(
    () => ({
      success: (title, description) => pushToast('success', title, description),
      error: (title, description) => pushToast('error', title, description),
      info: (title, description) => pushToast('info', title, description),
    }),
    [],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-5 top-5 z-[100] flex w-full max-w-sm flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-2xl border px-4 py-3 shadow-2xl backdrop-blur ${
              toast.type === 'success'
                ? 'border-emerald-200 bg-white/95'
                : toast.type === 'error'
                  ? 'border-rose-200 bg-white/95'
                  : 'border-sky-200 bg-white/95'
            }`}
          >
            <div className="text-sm font-semibold text-slate-900">{toast.title}</div>
            {toast.description ? <div className="mt-1 text-sm text-slate-600">{toast.description}</div> : null}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used inside ToastProvider');
  }
  return context;
}
