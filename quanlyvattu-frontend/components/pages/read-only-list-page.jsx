'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { matchesSearch } from '@/lib/helpers';
import { hasPermission } from '@/lib/permissions';
import { useAuth } from '@/components/auth/auth-provider';
import { useToast } from '@/components/ui/toast-provider';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DataTable } from '@/components/ui/table';
import { LoadingBlock } from '@/components/ui/loading';
import { MetricCard } from '@/components/ui/metric-card';
import { EmptyState } from '@/components/ui/empty-state';

export function ReadOnlyListPage({
  title,
  description,
  eyebrow,
  loader,
  columns,
  searchKeys = [],
  readPermission,
  statsBuilder,
  emptyDescription,
}) {
  const { token, permissions } = useAuth();
  const toast = useToast();
  const canRead = hasPermission(permissions, readPermission);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadData = useCallback(async () => {
    if (!token || !canRead) return;
    setLoading(true);
    try {
      const result = await loader(token);
      setItems(Array.isArray(result) ? result : []);
    } catch (error) {
      toast.error('Không tải được dữ liệu', error.message);
    } finally {
      setLoading(false);
    }
  }, [token, canRead, loader, toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filtered = useMemo(() => items.filter((item) => matchesSearch(item, search, searchKeys)), [items, search, searchKeys]);
  const stats = useMemo(() => (statsBuilder ? statsBuilder(items) : []), [items, statsBuilder]);

  if (!canRead) {
    return <EmptyState title="Bạn chưa có quyền truy cập" description="Tài khoản hiện tại không có quyền xem module này." />;
  }

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        actions={
          <Button variant="secondary" size="sm" onClick={loadData}>
            Tải lại
          </Button>
        }
      />

      {stats.length ? (
        <div className="flex flex-wrap gap-3">
          {stats.map((stat) => <MetricCard key={stat.label} {...stat} />)}
        </div>
      ) : null}

      <Card>
        <div className="mb-4 flex items-center gap-3">
          <input
            className="h-9 w-full max-w-md rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-teal-300"
            placeholder="Tìm kiếm..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        {loading ? <LoadingBlock label="Đang tải dữ liệu..." /> : <DataTable columns={columns} rows={filtered} emptyMessage={emptyDescription || 'Chưa có dữ liệu.'} />}
      </Card>
    </div>
  );
}
