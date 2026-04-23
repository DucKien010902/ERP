'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { useToast } from '@/components/ui/toast-provider';
import { api } from '@/lib/api';
import { PageHeader } from '@/components/ui/page-header';
import { MetricCard } from '@/components/ui/metric-card';
import { Card } from '@/components/ui/card';
import { DataTable } from '@/components/ui/table';
import { LoadingBlock } from '@/components/ui/loading';
import { SimpleBarChart } from '@/components/charts/simple-bar-chart';
import { formatCurrency, formatNumber } from '@/lib/format';
import { matchesSearch } from '@/lib/helpers';

export default function ProjectConsumptionPage() {
  const { token } = useAuth();
  const toast = useToast();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await api.reports.projectConsumption(token);
      setRows(data || []);
    } catch (error) {
      toast.error('Không tải được báo cáo', error.message);
    } finally {
      setLoading(false);
    }
  }, [token, toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filtered = useMemo(() => rows.filter((item) => matchesSearch(item, search, ['projectName', 'materialName'])), [rows, search]);
  const projectTotals = useMemo(() => {
    const grouped = rows.reduce((map, row) => {
      const current = map.get(row.projectName) || 0;
      map.set(row.projectName, current + Number(row.consumedValue || 0));
      return map;
    }, new Map());
    return Array.from(grouped.entries()).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
  }, [rows]);

  return (
    <div className="space-y-5">
      <PageHeader eyebrow="Reports" title="Tiêu hao theo công trình" description="Theo dõi vật tư đã xuất dùng theo công trình." />

      <div className="flex flex-wrap gap-3">
        <MetricCard icon="building" tone="teal" label="Công trình" value={new Set(rows.map((row) => row.projectId)).size} />
        <MetricCard icon="box" tone="blue" label="Vật tư" value={new Set(rows.map((row) => row.materialId)).size} />
        <MetricCard icon="chart" tone="violet" label="Giá trị tiêu hao" value={formatCurrency(rows.reduce((sum, row) => sum + Number(row.consumedValue || 0), 0))} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <Card title="Top công trình" description="Theo giá trị xuất dùng">
          {loading ? <LoadingBlock label="Đang tải biểu đồ..." /> : <SimpleBarChart data={projectTotals.slice(0, 8)} mode="currency" />}
        </Card>
        <Card title="Danh sách" description="Tra cứu nhanh theo công trình hoặc vật tư">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <input
              className="h-9 w-full max-w-md rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-teal-300"
              placeholder="Tìm theo công trình hoặc vật tư..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700" onClick={loadData}>Tải lại</button>
          </div>
          {loading ? <LoadingBlock label="Đang tải dữ liệu..." /> : (
            <DataTable
              columns={[
                { label: 'Công trình', key: 'projectName' },
                { label: 'Vật tư', key: 'materialName' },
                { label: 'SL tiêu hao', key: 'consumedQty', render: (row) => formatNumber(row.consumedQty, 3) },
                { label: 'Giá trị', key: 'consumedValue', render: (row) => formatCurrency(row.consumedValue || 0) },
              ]}
              rows={filtered}
            />
          )}
        </Card>
      </div>
    </div>
  );
}
