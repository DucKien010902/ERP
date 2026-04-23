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
import { Dialog } from '@/components/ui/dialog';
import { FieldRenderer } from './field-renderer';
import { LoadingBlock } from '@/components/ui/loading';
import { MetricCard } from '@/components/ui/metric-card';
import { EmptyState } from '@/components/ui/empty-state';

export function SimpleCrudPage({
  title,
  description,
  eyebrow,
  endpointLoader,
  createLoader,
  columns,
  fields = [],
  initialValues = {},
  searchKeys = [],
  readPermission,
  writePermission,
  loadReferences,
  statsBuilder,
  mapSubmit,
  emptyTitle,
  emptyDescription,
}) {
  const { token, permissions } = useAuth();
  const toast = useToast();
  const canRead = hasPermission(permissions, readPermission);
  const canWrite = !writePermission || hasPermission(permissions, writePermission);

  const [items, setItems] = useState([]);
  const [references, setReferences] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formValues, setFormValues] = useState(initialValues);

  const loadData = useCallback(async () => {
    if (!token || !canRead) return;
    setLoading(true);
    try {
      const [list, refs] = await Promise.all([
        endpointLoader(token),
        loadReferences ? loadReferences(token) : Promise.resolve({}),
      ]);
      setItems(Array.isArray(list) ? list : []);
      setReferences(refs || {});
    } catch (error) {
      toast.error('Không tải được dữ liệu', error.message);
    } finally {
      setLoading(false);
    }
  }, [token, canRead, endpointLoader, loadReferences, toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filtered = useMemo(
    () => items.filter((item) => matchesSearch(item, search, searchKeys)),
    [items, search, searchKeys],
  );

  const stats = useMemo(() => (statsBuilder ? statsBuilder(items, references) : []), [items, references, statsBuilder]);
  const formId = `form-${title}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  async function handleSubmit(event) {
    event.preventDefault();
    if (!token) return;
    setSaving(true);
    try {
      const payload = mapSubmit ? mapSubmit(formValues, references) : formValues;
      await createLoader(token, payload);
      toast.success('Lưu thành công', 'Dữ liệu đã được cập nhật vào hệ thống.');
      setDialogOpen(false);
      setFormValues(initialValues);
      await loadData();
    } catch (error) {
      toast.error('Lưu thất bại', error.message);
    } finally {
      setSaving(false);
    }
  }

  if (!canRead) {
    return <EmptyState title="Bạn chưa có quyền truy cập" description="Tài khoản hiện tại không có quyền xem module này." />;
  }

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        actions={canWrite ? <Button size="sm" onClick={() => { setFormValues(initialValues); setDialogOpen(true); }}>Tạo mới</Button> : null}
      />

      {stats.length ? (
        <div className="flex flex-wrap gap-3">
          {stats.map((stat) => (
            <MetricCard key={stat.label} {...stat} />
          ))}
        </div>
      ) : null}

      <Card>
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="w-full max-w-md">
            <input
              className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-teal-300"
              placeholder="Tìm kiếm..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <Button variant="secondary" size="sm" onClick={loadData}>Tải lại</Button>
        </div>

        {loading ? <LoadingBlock label="Đang tải danh sách..." /> : (
          <DataTable
            columns={columns}
            rows={filtered}
            emptyMessage={emptyDescription || 'Chưa có bản ghi nào.'}
          />
        )}
      </Card>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={`Tạo mới · ${title}`}
        description="Biểu mẫu nhập liệu gọn."
        footer={(
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setDialogOpen(false)}>Đóng</Button>
            <Button type="submit" form={formId} loading={saving}>Lưu dữ liệu</Button>
          </div>
        )}
      >
        <form id={formId} className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          {fields.map((field) => (
            <div key={field.key} className={field.fullWidth ? 'md:col-span-2' : ''}>
              <FieldRenderer
                field={field}
                references={references}
                value={formValues[field.key]}
                onChange={(value) => setFormValues((current) => ({ ...current, [field.key]: value }))}
              />
            </div>
          ))}
        </form>
      </Dialog>
    </div>
  );
}
