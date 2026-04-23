'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from './sidebar';
import { Topbar } from './topbar';
import { useAuth } from './auth/auth-provider';
import { LoadingBlock } from './ui/loading';

export function AppShell({ children }) {
  const router = useRouter();
  const { loading, session, user, permissions, logout } = useAuth();

  useEffect(() => {
    if (!loading && !session) {
      router.replace('/login');
    }
  }, [loading, session, router]);

  if (loading || !session) {
    return (
      <div className="min-h-screen bg-[var(--color-surface)] p-6">
        <LoadingBlock label="Đang tải phiên làm việc..." />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-surface)] text-slate-800">
      <Sidebar permissions={permissions} />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Topbar
          user={user}
          onLogout={() => {
            logout();
            router.replace('/login');
          }}
        />
        <main className="flex-1 overflow-y-auto px-3 py-4 md:px-5 xl:px-6">
          <div className="mx-auto max-w-[1600px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
