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
import { DonutChart } from '@/components/charts/donut-chart';
import { formatCurrency, formatNumber } from '@/lib/format';
import { StatusBadge } from '@/components/ui/status-badge';

export default function DashboardPage() {
  const { token } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);
  const [valuation, setValuation] = useState(null);
  const [movementSummary, setMovementSummary] = useState([]);
  const [projectConsumption, setProjectConsumption] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  const loadData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [dashboardData, valuationData, movementData, projectData, lowStockData, auditData] = await Promise.all([
        api.reports.dashboard(token),
        api.inventory.valuation(token),
        api.reports.movementSummary(token),
        api.reports.projectConsumption(token),
        api.inventory.lowStock(token),
        api.audit.logs(token),
      ]);
      setDashboard(dashboardData);
      setValuation(valuationData);
      setMovementSummary(movementData || []);
      setProjectConsumption(projectData || []);
      setLowStock(lowStockData || []);
      setAuditLogs(auditData || []);
    } catch (error) {
      toast.error('Không tải được dashboard', error.message);
    } finally {
      setLoading(false);
    }
  }, [token, toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const projectChartData = useMemo(() => {
    const grouped = projectConsumption.reduce((map, row) => {
      const current = map.get(row.projectName) || 0;
      map.set(row.projectName, current + Number(row.consumedValue || 0));
      return map;
    }, new Map());
    return Array.from(grouped.entries())
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [projectConsumption]);

  const movementChartData = movementSummary.map((item) => ({
    label: item.movementType,
    value: Number(item.totalValue || 0),
  }));

  const lowStockColumns = [
    { label: 'Vật tư', key: 'material', render: (row) => row.material?.name || row.material },
    { label: 'Kho', key: 'warehouse', render: (row) => row.warehouse?.name || row.warehouseId || '—' },
    { label: 'Tồn hiện tại', key: 'onHandQty', render: (row) => formatNumber(row.onHandQty, 3) },
    { label: 'Mức tối thiểu', key: 'minStock', render: (row) => formatNumber(row.material?.minStock ?? row.minStock, 3) },
  ];

  const auditColumns = [
    { label: 'Thời gian', key: 'createdAt', render: (row) => new Date(row.createdAt).toLocaleString('vi-VN') },
    { label: 'Người thao tác', key: 'user', render: (row) => row.user?.fullName || 'Hệ thống' },
    { label: 'Module', key: 'module' },
    { label: 'Hành động', key: 'action', render: (row) => <StatusBadge status={row.action} map={{ [row.action]: { label: row.action, tone: 'teal' } }} /> },
  ];

  if (loading) {
    return <LoadingBlock label="Đang dựng dashboard..." />;
  }

  return (
    <div className="space-y-5">
      <PageHeader eyebrow="Dashboard" title="Điều hành vật tư" description="Tồn kho, biến động và cảnh báo." />

      <div className="flex flex-wrap gap-3">
        <MetricCard icon="box" tone="teal" label="Vật tư" value={formatNumber(dashboard?.materials)} helper="SKU đang hoạt động" />
        <MetricCard icon="warehouse" tone="blue" label="Kho" value={formatNumber(dashboard?.warehouses)} helper={`${formatNumber(dashboard?.activeProjects)} công trình`} />
        <MetricCard icon="layers" tone="violet" label="Chứng từ" value={formatNumber(dashboard?.stockDocuments)} helper={`${formatNumber(dashboard?.invoices)} hóa đơn`} />
        <MetricCard icon="alert" tone="amber" label="Cảnh báo" value={formatNumber(dashboard?.lowStockCount)} helper="Dưới mức tồn tối thiểu" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
        <Card title="Giá trị tồn kho" description="Tổng hợp hiện tại">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-xs text-slate-500">Tổng giá trị</div>
              <div className="mt-2 text-2xl font-bold text-slate-950">{formatCurrency(valuation?.totalValue || dashboard?.stockValue || 0)}</div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-xs text-slate-500">Tổng số lượng</div>
              <div className="mt-2 text-2xl font-bold text-slate-950">{formatNumber(valuation?.totalQty || 0, 3)}</div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-xs text-slate-500">SKU có tồn</div>
              <div className="mt-2 text-2xl font-bold text-slate-950">{formatNumber(valuation?.skuCount || 0)}</div>
            </div>
          </div>
          <div className="mt-4">
            <DonutChart
              segments={movementSummary.map((item) => ({
                label: item.movementType,
                value: Number(item.totalValue || 0),
              }))}
            />
          </div>
        </Card>

        <Card title="Ưu tiên xử lý" description="Việc cần theo dõi">
          <div className="space-y-3">
            {[
              ['Low stock', `${formatNumber(dashboard?.lowStockCount || 0)} mã vật tư cần kiểm tra`],
              ['Chứng từ kho', `${formatNumber(dashboard?.stockDocuments || 0)} chứng từ đang quản lý`],
              ['Hóa đơn / PO', `${formatNumber(dashboard?.invoices || 0)} hồ sơ cần đối soát`],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-slate-200 px-3.5 py-3">
                <div className="text-sm font-semibold text-slate-900">{label}</div>
                <div className="mt-1 text-xs text-slate-500">{value}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Card title="Biến động nhập xuất" description="Theo loại chứng từ">
          <SimpleBarChart data={movementChartData} mode="currency" />
        </Card>
        <Card title="Tiêu hao theo công trình" description="Top công trình phát sinh">
          <SimpleBarChart data={projectChartData} mode="currency" />
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <Card title="Low stock" description="Danh sách cần theo dõi">
          <DataTable columns={lowStockColumns} rows={lowStock.slice(0, 10)} emptyMessage="Không có vật tư nào dưới min stock." />
        </Card>
        <Card title="Nhật ký thao tác" description="Gần đây">
          <DataTable columns={auditColumns} rows={auditLogs.slice(0, 10)} emptyMessage="Chưa có audit log." />
        </Card>
      </div>
    </div>
  );
}
