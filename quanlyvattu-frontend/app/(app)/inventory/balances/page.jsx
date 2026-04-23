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
import { matchesSearch } from '@/lib/helpers';
import { formatCurrency, formatNumber } from '@/lib/format';
import { SimpleBarChart } from '@/components/charts/simple-bar-chart';

export default function InventoryBalancesPage() {
  const { token } = useAuth();
  const toast = useToast();
  const [balances, setBalances] = useState([]);
  const [valuation, setValuation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [balanceData, valuationData] = await Promise.all([api.inventory.balances(token), api.inventory.valuation(token)]);
      setBalances(balanceData || []);
      setValuation(valuationData || null);
    } catch (error) {
      toast.error('Không tải được tồn kho', error.message);
    } finally {
      setLoading(false);
    }
  }, [token, toast]);

  useEffect(() => { loadData(); }, [loadData]);

  const filtered = useMemo(() => balances.filter((item) => matchesSearch(item, search, ['material.code', 'material.name', 'warehouse.name', 'material.category.name'])), [balances, search]);

  const warehouseValueData = useMemo(() => {
    const grouped = balances.reduce((map, row) => {
      const value = Number(row.onHandQty || 0) * Number(row.averageCost || 0);
      const key = row.warehouse?.name || 'Không xác định';
      map.set(key, (map.get(key) || 0) + value);
      return map;
    }, new Map());
    return Array.from(grouped.entries()).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
  }, [balances]);

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Inventory" title="Tồn kho hiện tại" description="Snapshot on-hand, available, average cost theo từng vật tư và kho. Đây là dữ liệu tối ưu cho giao diện và dashboard." actions={null} />

      <div className="flex flex-wrap gap-3">
        <MetricCard icon="database" tone="teal" label="Dòng tồn kho" value={balances.length} />
        <MetricCard icon="chart" tone="blue" label="Tổng số lượng" value={formatNumber(valuation?.totalQty || 0, 3)} />
        <MetricCard icon="receipt" tone="violet" label="Giá trị tồn" value={formatCurrency(valuation?.totalValue || 0)} />
        <MetricCard icon="box" tone="amber" label="SKU có tồn" value={formatNumber(valuation?.skuCount || 0)} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        <Card>
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <input className="h-11 w-full max-w-md rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-teal-300" placeholder="Tìm theo mã vật tư, tên vật tư, kho..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <button className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700" onClick={loadData}>Tải lại</button>
          </div>
          {loading ? <LoadingBlock label="Đang tải snapshot tồn kho..." /> : (
            <DataTable
              columns={[
                { label: 'Vật tư', key: 'material', render: (row) => <div><div className="font-semibold text-slate-900">{row.material?.name}</div><div className="text-xs text-slate-500">{row.material?.code}</div></div> },
                { label: 'Kho', key: 'warehouse', render: (row) => row.warehouse?.name || '—' },
                { label: 'Tồn thực tế', key: 'onHandQty', render: (row) => formatNumber(row.onHandQty, 3) },
                { label: 'Khả dụng', key: 'availableQty', render: (row) => formatNumber(row.availableQty, 3) },
                { label: 'Giá vốn TB', key: 'averageCost', render: (row) => formatCurrency(row.averageCost) },
                { label: 'Giá trị', key: 'value', render: (row) => formatCurrency(Number(row.onHandQty || 0) * Number(row.averageCost || 0)) },
              ]}
              rows={filtered}
              emptyMessage="Chưa có tồn kho nào được post."
            />
          )}
        </Card>

        <Card title="Giá trị tồn theo kho" description="Giúp bạn nhanh chóng thấy kho nào đang nắm giữ nhiều giá trị hàng tồn nhất.">
          <SimpleBarChart data={warehouseValueData} mode="currency" />
        </Card>
      </div>
    </div>
  );
}
