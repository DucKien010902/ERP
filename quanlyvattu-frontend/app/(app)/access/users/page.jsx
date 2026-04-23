'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { useToast } from '@/components/ui/toast-provider';
import { api } from '@/lib/api';
import { loadAccessReferences } from '@/lib/reference-loaders';
import { PageHeader } from '@/components/ui/page-header';
import { MetricCard } from '@/components/ui/metric-card';
import { Card } from '@/components/ui/card';
import { DataTable } from '@/components/ui/table';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FieldRenderer } from '@/components/pages/field-renderer';
import { LoadingBlock } from '@/components/ui/loading';
import { Badge } from '@/components/ui/badge';
import { matchesSearch } from '@/lib/helpers';
import { hasPermission } from '@/lib/permissions';

export default function UsersPage() {
  const { token, permissions } = useAuth();
  const toast = useToast();
  const canRead = hasPermission(permissions, 'users.read');
  const canWrite = hasPermission(permissions, 'users.write');

  const [users, setUsers] = useState([]);
  const [references, setReferences] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [formValues, setFormValues] = useState({ fullName: '', email: '', phone: '', password: '', roleIds: [] });

  const loadData = useCallback(async () => {
    if (!token || !canRead) return;
    setLoading(true);
    try {
      const [userData, accessRefs] = await Promise.all([api.users.list(token), loadAccessReferences(token)]);
      setUsers(userData || []);
      setReferences(accessRefs || {});
    } catch (error) {
      toast.error('Không tải được người dùng', error.message);
    } finally {
      setLoading(false);
    }
  }, [token, canRead, toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filtered = useMemo(
    () => users.filter((user) => matchesSearch(user, search, ['fullName', 'email', 'phone', 'roles.0.name'])),
    [users, search],
  );

  async function handleCreate(event) {
    event.preventDefault();
    setSaving(true);
    try {
      await api.users.create(token, formValues);
      toast.success('Đã tạo người dùng', 'Tài khoản mới đã được thêm vào hệ thống.');
      setFormValues({ fullName: '', email: '', phone: '', password: '', roleIds: [] });
      setDialogOpen(false);
      await loadData();
    } catch (error) {
      toast.error('Tạo người dùng thất bại', error.message);
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(user) {
    const confirmed = window.confirm(`Bạn có chắc muốn ${user.isActive ? 'khóa' : 'mở'} tài khoản ${user.fullName}?`);
    if (!confirmed) return;
    try {
      await api.users.toggleActive(token, user.id);
      toast.success('Cập nhật thành công', 'Trạng thái người dùng đã thay đổi.');
      await loadData();
    } catch (error) {
      toast.error('Không thể cập nhật', error.message);
    }
  }

  if (!canRead) {
    return <Card><div className="text-sm text-slate-500">Bạn chưa có quyền xem module người dùng.</div></Card>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Access Control"
        title="Người dùng & phân quyền"
        description="RBAC theo vai trò, đủ cho quản lý kho, kế toán, chỉ huy công trình và ban điều hành."
        actions={canWrite ? <Button onClick={() => { setFormValues({ fullName: '', email: '', phone: '', password: '', roleIds: [] }); setDialogOpen(true); }}>Tạo tài khoản</Button> : null}
      />

      <div className="flex flex-wrap gap-3">
        <MetricCard icon="users" tone="teal" label="Tổng người dùng" value={users.length} />
        <MetricCard icon="shield" tone="blue" label="Đang hoạt động" value={users.filter((user) => user.isActive).length} />
        <MetricCard icon="key" tone="amber" label="Vai trò hệ thống" value={references.roles?.length || 0} />
        <MetricCard icon="shield" tone="violet" label="Quyền hành động" value={references.permissions?.length || 0} />
      </div>

      <Card>
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <input
            className="h-11 w-full max-w-md rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-teal-300"
            placeholder="Tìm theo tên, email hoặc vai trò..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <Button variant="secondary" onClick={loadData}>Tải lại</Button>
        </div>
        {loading ? (
          <LoadingBlock label="Đang tải danh sách người dùng..." />
        ) : (
          <DataTable
            columns={[
              { label: 'Họ tên', key: 'fullName', render: (row) => <div><div className="font-semibold text-slate-900">{row.fullName}</div><div className="mt-1 text-xs text-slate-500">{row.email}</div></div> },
              { label: 'Vai trò', key: 'roles', render: (row) => <div className="flex flex-wrap gap-2">{(row.roles || []).map((role) => <Badge key={role.id} tone="blue">{role.name}</Badge>)}</div> },
              { label: 'Liên hệ', key: 'phone', render: (row) => row.phone || '—' },
              { label: 'Trạng thái', key: 'isActive', render: (row) => <Badge tone={row.isActive ? 'emerald' : 'rose'}>{row.isActive ? 'Hoạt động' : 'Đã khóa'}</Badge> },
              { label: 'Đăng nhập cuối', key: 'lastLoginAt', render: (row) => row.lastLoginAt ? new Date(row.lastLoginAt).toLocaleString('vi-VN') : '—' },
              {
                label: 'Tác vụ',
                key: 'actions',
                render: (row) => canWrite ? <Button variant="secondary" className="h-8 px-3 text-xs" onClick={() => toggleActive(row)}>{row.isActive ? 'Khóa' : 'Mở khóa'}</Button> : '—',
              },
            ]}
            rows={filtered}
          />
        )}
      </Card>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title="Tạo tài khoản người dùng"
        description="Phân bổ đúng vai trò để giới hạn quyền xem, tạo, duyệt và hạch toán theo backend hiện tại."
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setDialogOpen(false)}>Đóng</Button>
            <Button type="submit" form="create-user-form" loading={saving}>Lưu người dùng</Button>
          </div>
        }
      >
        <form id="create-user-form" className="grid gap-4 md:grid-cols-2" onSubmit={handleCreate}>
          {[
            { key: 'fullName', label: 'Họ tên', required: true },
            { key: 'email', label: 'Email', type: 'email', required: true },
            { key: 'phone', label: 'Số điện thoại' },
            { key: 'password', label: 'Mật khẩu', type: 'password', required: true },
            { key: 'roleIds', label: 'Vai trò', type: 'multiselect', optionsKey: 'roleOptions', required: true, fullWidth: true },
          ].map((field) => (
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
