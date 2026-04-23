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

export default function InventoryValuationPage() {
  const { token } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [valuation, setValuation] = useState(null);
  const [balances, setBalances] = useState([]);

  const loadData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [valuationData, balanceData] = await Promise.all([api.inventory.valuation(token), api.inventory.balances(token)]);
      setValuation(valuationData);
      setBalances(balanceData || []);
    } catch (error) {
      toast.error('Không tải được giá trị tồn kho', error.message);
    } finally {
      setLoading(false);
    }
  }, [token, toast]);

  useEffect(() => { loadData(); }, [loadData]);

  const topMaterials = useMemo(() => {
    return balances
      .map((row) => ({
        label: row.material?.name || row.materialId,
        value: Number(row.onHandQty || 0) * Number(row.averageCost || 0),
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [balances]);

  if (loading) return <LoadingBlock label="Đang tải valuation..." />;

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Inventory" title="Giá trị tồn kho" description="Phân tích tổng trị giá tồn kho, quy mô SKU và nhóm vật tư đang nắm nhiều vốn nhất." />

      <div className="flex flex-wrap gap-3">
        <MetricCard icon="chart" tone="violet" label="Tổng giá trị tồn" value={formatCurrency(valuation?.totalValue || 0)} />
        <MetricCard icon="box" tone="teal" label="Tổng lượng tồn" value={formatNumber(valuation?.totalQty || 0, 3)} />
        <MetricCard icon="database" tone="blue" label="SKU có tồn" value={formatNumber(valuation?.skuCount || 0)} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card title="Top vật tư theo giá trị vốn" description="Những mã đang chiếm tỷ trọng vốn hàng tồn cao nhất.">
          <SimpleBarChart data={topMaterials} mode="currency" />
        </Card>
        <Card title="Snapshot tiêu biểu" description="Top 10 dòng tồn theo giá trị để hỗ trợ quyết định điều chuyển hoặc mua hàng.">
          <DataTable
            columns={[
              { label: 'Vật tư', key: 'material', render: (row) => row.material?.name || '—' },
              { label: 'Kho', key: 'warehouse', render: (row) => row.warehouse?.name || '—' },
              { label: 'SL tồn', key: 'onHandQty', render: (row) => formatNumber(row.onHandQty, 3) },
              { label: 'Giá vốn', key: 'averageCost', render: (row) => formatCurrency(row.averageCost) },
              { label: 'Giá trị', key: 'value', render: (row) => formatCurrency(Number(row.onHandQty || 0) * Number(row.averageCost || 0)) },
            ]}
            rows={balances
              .slice()
              .sort((a, b) => (Number(b.onHandQty || 0) * Number(b.averageCost || 0)) - (Number(a.onHandQty || 0) * Number(a.averageCost || 0)))
              .slice(0, 10)}
          />
        </Card>
      </div>
    </div>
  );
}
