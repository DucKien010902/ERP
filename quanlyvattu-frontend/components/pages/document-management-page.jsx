'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { useToast } from '@/components/ui/toast-provider';
import { hasAnyPermission, hasPermission } from '@/lib/permissions';
import { matchesSearch } from '@/lib/helpers';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DataTable } from '@/components/ui/table';
import { Dialog } from '@/components/ui/dialog';
import { LoadingBlock } from '@/components/ui/loading';
import { EmptyState } from '@/components/ui/empty-state';
import { MetricCard } from '@/components/ui/metric-card';
import { FieldRenderer } from './field-renderer';
import { LineItemsEditor } from './line-items-editor';
import { formatCurrency, formatDate, formatNumber } from '@/lib/format';

export function DocumentManagementPage({
  title,
  description,
  eyebrow,
  listLoader,
  createLoader,
  detailLoader,
  readPermission,
  writePermission,
  searchKeys = [],
  columns,
  fields,
  initialValues,
  itemFields,
  loadReferences,
  mapSubmit,
  actionButtons = [],
  statsBuilder,
  detailMeta,
  detailTitle = 'Chi tiết chứng từ',
}) {
  const { token, permissions } = useAuth();
  const toast = useToast();

  const canRead = hasPermission(permissions, readPermission);
  const canWrite = hasPermission(permissions, writePermission);

  const [items, setItems] = useState([]);
  const [references, setReferences] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [formValues, setFormValues] = useState(initialValues);

  const loadData = useCallback(async () => {
    if (!token || !canRead) return;
    setLoading(true);
    try {
      const [list, refs] = await Promise.all([
        listLoader(token),
        loadReferences ? loadReferences(token) : Promise.resolve({}),
      ]);
      setItems(Array.isArray(list) ? list : []);
      setReferences(refs || {});
    } catch (error) {
      toast.error('Không tải được dữ liệu', error.message);
    } finally {
      setLoading(false);
    }
  }, [token, canRead, listLoader, loadReferences, toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filtered = useMemo(() => items.filter((item) => matchesSearch(item, search, searchKeys)), [items, search, searchKeys]);
  const stats = useMemo(() => (statsBuilder ? statsBuilder(items) : []), [items, statsBuilder]);
  const formId = `form-${title}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  async function handleCreate(event) {
    event.preventDefault();
    if (!token) return;
    setSaving(true);
    try {
      const payload = mapSubmit ? mapSubmit(formValues, references) : formValues;
      await createLoader(token, payload);
      toast.success('Đã lưu chứng từ', 'Dữ liệu mới đã được ghi nhận.');
      setDialogOpen(false);
      setFormValues(initialValues);
      await loadData();
    } catch (error) {
      toast.error('Không thể lưu', error.message);
    } finally {
      setSaving(false);
    }
  }

  async function openDetail(id) {
    if (!token) return;
    try {
      const detail = detailLoader ? await detailLoader(token, id) : items.find((item) => item.id === id);
      setSelected(detail);
      setDetailOpen(true);
    } catch (error) {
      toast.error('Không tải được chi tiết', error.message);
    }
  }

  async function runAction(action, row) {
    if (!token) return;
    const confirmed = action.confirmMessage ? window.confirm(action.confirmMessage(row)) : true;
    if (!confirmed) return;
    try {
      await action.handler(token, row);
      toast.success(action.successTitle || 'Thành công', action.successDescription || 'Trạng thái đã được cập nhật.');
      await loadData();
      if (selected?.id === row.id) {
        const refreshed = detailLoader ? await detailLoader(token, row.id) : row;
        setSelected(refreshed);
      }
    } catch (error) {
      toast.error('Không thể thực hiện thao tác', error.message);
    }
  }

  if (!canRead) {
    return <EmptyState title="Bạn chưa có quyền truy cập" description="Tài khoản hiện tại không có quyền xem module này." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader eyebrow={eyebrow} title={title} description={description} actions={canWrite ? <Button onClick={() => { setFormValues(initialValues); setDialogOpen(true); }}>Tạo chứng từ</Button> : null} />
      {stats.length ? (
        <div className="flex flex-wrap gap-3">
          {stats.map((stat) => <MetricCard key={stat.label} {...stat} />)}
        </div>
      ) : null}
      <Card>
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <input
            className="h-11 w-full max-w-md rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-teal-300"
            placeholder="Tìm theo mã, công trình, NCC hoặc trạng thái..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <Button variant="secondary" onClick={loadData}>Tải lại</Button>
        </div>
        {loading ? (
          <LoadingBlock label="Đang tải chứng từ..." />
        ) : (
          <DataTable
            columns={[
              ...columns,
              {
                label: 'Tác vụ',
                key: 'actions',
                render: (row) => (
                  <div className="flex flex-wrap items-center gap-2">
                    <Button variant="ghost" className="h-8 px-3 text-xs" onClick={() => openDetail(row.id)}>Xem</Button>
                    {actionButtons
                      .filter((action) => hasPermission(permissions, action.permission) && action.visible(row))
                      .map((action) => (
                        <Button
                          key={action.label}
                          variant={action.variant || 'secondary'}
                          className="h-8 px-3 text-xs"
                          onClick={() => runAction(action, row)}
                        >
                          {action.label}
                        </Button>
                      ))}
                  </div>
                ),
              },
            ]}
            rows={filtered}
            emptyMessage="Chưa có chứng từ nào."
          />
        )}
      </Card>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={`Tạo mới · ${title}`}
        description="Biểu mẫu đồng bộ với backend NestJS hiện có."
        width="max-w-5xl"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setDialogOpen(false)}>Đóng</Button>
            <Button type="submit" form={formId} loading={saving}>Lưu chứng từ</Button>
          </div>
        }
      >
        <form id={formId} className="space-y-6" onSubmit={handleCreate}>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {fields.map((field) => (
              <div key={field.key} className={field.fullWidth ? 'xl:col-span-3 md:col-span-2' : ''}>
                <FieldRenderer
                  field={field}
                  references={references}
                  value={formValues[field.key]}
                  onChange={(value) => setFormValues((current) => ({ ...current, [field.key]: value }))}
                />
              </div>
            ))}
          </div>
          <LineItemsEditor
            title="Danh sách vật tư"
            description="Số lượng, đơn giá và ghi chú được gửi đúng format mà backend yêu cầu."
            fields={itemFields}
            rows={formValues.items}
            references={references}
            onChange={(itemsValue) => setFormValues((current) => ({ ...current, items: itemsValue }))}
          />
          {formValues.items?.length ? (
            <div className="rounded-3xl border border-teal-100 bg-teal-50 px-4 py-4 text-sm text-teal-900">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>Tổng dòng: <span className="font-semibold">{formatNumber(formValues.items.length)}</span></div>
                <div>
                  Giá trị tạm tính:{' '}
                  <span className="font-semibold">
                    {formatCurrency(
                      (formValues.items || []).reduce(
                        (sum, item) => sum + Number(item.qty || item.requestedQty || 0) * Number(item.unitPrice || item.unitCost || 0),
                        0,
                      ),
                    )}
                  </span>
                </div>
              </div>
            </div>
          ) : null}
        </form>
      </Dialog>

      <Dialog
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        title={selected?.documentNo || selected?.requestNo || selected?.poNo || selected?.invoiceNo || detailTitle}
        description="Chi tiết và dòng hàng liên kết"
        side="right"
        footer={
          selected ? (
            <div className="flex flex-wrap justify-end gap-3">
              <Button variant="secondary" onClick={() => setDetailOpen(false)}>Đóng</Button>
              {actionButtons
                .filter((action) => hasPermission(permissions, action.permission) && action.visible(selected))
                .map((action) => (
                  <Button key={action.label} variant={action.variant || 'secondary'} onClick={() => runAction(action, selected)}>
                    {action.label}
                  </Button>
                ))}
            </div>
          ) : null
        }
      >
        {selected ? (
          <div className="space-y-6">
            <div className="grid gap-3 md:grid-cols-2">
              {detailMeta.map((meta) => (
                <div key={meta.label} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{meta.label}</div>
                  <div className="mt-2 text-sm font-medium text-slate-900">{meta.render(selected)}</div>
                </div>
              ))}
            </div>
            <Card title="Dòng vật tư" description="Danh sách chi tiết đã gửi/được phê duyệt cho chứng từ này.">
              <DataTable
                columns={[
                  { label: 'Vật tư', key: 'material', render: (row) => row.material?.name || '—' },
                  { label: 'Số lượng', key: 'qty', render: (row) => formatNumber(row.qty || row.requestedQty || 0, 3) },
                  { label: 'Đơn giá/Cost', key: 'price', render: (row) => formatCurrency(row.unitPrice || row.unitCost || 0) },
                  { label: 'Ghi chú', key: 'note', render: (row) => row.note || '—' },
                ]}
                rows={selected.items || []}
              />
            </Card>
            {selected.note ? (
              <Card title="Ghi chú nội bộ">
                <div className="whitespace-pre-wrap text-sm leading-6 text-slate-600">{selected.note}</div>
              </Card>
            ) : null}
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500">Tổng số dòng<br /><span className="text-lg font-semibold text-slate-900">{selected.items?.length || 0}</span></div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500">Tổng trị giá<br /><span className="text-lg font-semibold text-slate-900">{formatCurrency(selected.grandTotal || 0)}</span></div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500">Ngày chứng từ<br /><span className="text-lg font-semibold text-slate-900">{formatDate(selected.documentDate || selected.orderDate || selected.invoiceDate || selected.neededDate)}</span></div>
            </div>
          </div>
        ) : null}
      </Dialog>
    </div>
  );
}
