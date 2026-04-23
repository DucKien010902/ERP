'use client';

import { useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { COMPANY_NAME, NAV_SECTIONS } from '@/lib/constants';
import { initials } from '@/lib/format';
import { Button } from './ui/button';

function findLabel(pathname) {
  for (const section of NAV_SECTIONS) {
    for (const item of section.items) {
      if (pathname === item.href || pathname.startsWith(`${item.href}/`)) {
        return item.label;
      }
    }
  }
  return 'Dashboard';
}

export function Topbar({ user, onLogout }) {
  const pathname = usePathname();
  const router = useRouter();
  const pageLabel = useMemo(() => findLabel(pathname), [pathname]);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-[var(--color-surface)]/92 backdrop-blur-xl">
      <div className="flex flex-col gap-3 px-3 py-3 md:px-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0">
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-teal-700/80">{COMPANY_NAME}</div>
          <h2 className="mt-1 truncate text-base font-semibold text-slate-950">{pageLabel}</h2>
        </div>

        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <div className="relative min-w-[220px] max-w-[340px] flex-1">
            <input
              className="h-9 w-full rounded-xl border border-slate-200 bg-white/90 px-3 text-sm text-slate-700 outline-none ring-0 placeholder:text-slate-400 focus:border-teal-300"
              placeholder="Tìm nhanh..."
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => router.refresh()}>
              Làm mới
            </Button>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-2 shadow-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 text-xs font-bold text-white">
                {initials(user?.fullName || 'WM')}
              </div>
              <div className="min-w-0 max-w-[180px]">
                <div className="truncate text-sm font-semibold text-slate-900">{user?.fullName}</div>
                <div className="truncate text-[11px] text-slate-500">{user?.email}</div>
              </div>
              <Button variant="ghost" size="sm" onClick={onLogout}>
                Đăng xuất
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
