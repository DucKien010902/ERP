'use client';

import { useCallback, useEffect, useState } from 'react';
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

export default function MovementSummaryPage() {
  const { token } = useAuth();
  const toast = useToast();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await api.reports.movementSummary(token);
      setRows(data || []);
    } catch (error) {
      toast.error('Không tải được báo cáo biến động', error.message);
    } finally {
      setLoading(false);
    }
  }, [token, toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="space-y-5">
      <PageHeader eyebrow="Reports" title="Tổng hợp nhập xuất" description="Tóm tắt nhanh theo loại biến động kho." />

      <div className="flex flex-wrap gap-3">
        <MetricCard icon="layers" tone="teal" label="Loại biến động" value={rows.length} />
        <MetricCard icon="chart" tone="blue" label="Tổng giá trị" value={formatCurrency(rows.reduce((sum, row) => sum + Number(row.totalValue || 0), 0))} />
        <MetricCard icon="swap" tone="amber" label="Tổng xuất" value={formatNumber(rows.reduce((sum, row) => sum + Number(row.totalOut || 0), 0), 3)} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <Card title="Giá trị theo loại" description="So sánh nhanh theo movement">
          {loading ? <LoadingBlock label="Đang tải biểu đồ..." /> : <SimpleBarChart data={rows.map((row) => ({ label: row.movementType, value: Number(row.totalValue || 0) }))} mode="currency" />}
        </Card>
        <Card title="Bảng tổng hợp" description="Số liệu tổng theo movement">
          {loading ? <LoadingBlock label="Đang tải bảng..." /> : (
            <DataTable
              columns={[
                { label: 'Loại movement', key: 'movementType' },
                { label: 'Tổng nhập', key: 'totalIn', render: (row) => formatNumber(row.totalIn, 3) },
                { label: 'Tổng xuất', key: 'totalOut', render: (row) => formatNumber(row.totalOut, 3) },
                { label: 'Giá trị', key: 'totalValue', render: (row) => formatCurrency(row.totalValue || 0) },
              ]}
              rows={rows}
            />
          )}
        </Card>
      </div>
    </div>
  );
}
