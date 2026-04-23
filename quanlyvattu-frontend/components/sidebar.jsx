'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_SECTIONS, APP_NAME } from '@/lib/constants';
import { hasAnyPermission } from '@/lib/permissions';
import { Icon } from './ui/icons';

export function Sidebar({ permissions = [] }) {
  const pathname = usePathname();

  return (
    <aside className="hidden h-screen w-[250px] shrink-0 border-r border-slate-800 bg-[var(--color-sidebar)] text-slate-200 xl:flex xl:flex-col">
      <div className="border-b border-white/10 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/20">
            WM
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-teal-200/80">Materials</div>
            <div className="mt-1 text-sm font-semibold text-white">{APP_NAME}</div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-5">
          {NAV_SECTIONS.map((section) => {
            const items = section.items.filter((item) => hasAnyPermission(permissions, item.permissions));
            if (!items.length) return null;
            return (
              <div key={section.label}>
                <div className="px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">{section.label}</div>
                <div className="mt-2 space-y-1">
                  {items.map((item) => {
                    const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] transition ${
                          active
                            ? 'bg-gradient-to-r from-teal-500/18 to-cyan-500/8 text-white shadow-inner ring-1 ring-teal-400/20'
                            : 'text-slate-300 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <span className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${active ? 'bg-teal-400/20 text-teal-200' : 'bg-white/5 text-slate-300 group-hover:bg-white/10'}`}>
                          <Icon name={item.icon} className="h-4 w-4" />
                        </span>
                        <span className="truncate">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      
    </aside>
  );
}
