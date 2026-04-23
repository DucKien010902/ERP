'use client';

import { ReadOnlyListPage } from '@/components/pages/read-only-list-page';
import { api } from '@/lib/api';
import { AuditActionBadge } from '@/components/ui/status-badge';

export default function AuditLogsPage() {
  return (
    <ReadOnlyListPage
      eyebrow="Audit"
      title="Nhật ký thao tác"
      description="Theo dõi create, update, submit, approve, post và login để tăng độ tin cậy khi vận hành nội bộ."
      loader={api.audit.logs}
      readPermission="audits.read"
      searchKeys={['module', 'action', 'user.fullName', 'entityId']}
      columns={[
        { label: 'Thời gian', key: 'createdAt', render: (row) => new Date(row.createdAt).toLocaleString('vi-VN') },
        { label: 'Người thao tác', key: 'user', render: (row) => row.user?.fullName || 'Hệ thống' },
        { label: 'Module', key: 'module' },
        { label: 'Hành động', key: 'action', render: (row) => <AuditActionBadge status={row.action} /> },
        { label: 'Entity ID', key: 'entityId', render: (row) => row.entityId || '—' },
        { label: 'IP', key: 'ip', render: (row) => row.ip || '—' },
      ]}
      statsBuilder={(items) => [
        { icon: 'shield', tone: 'teal', label: 'Log gần nhất', value: items.length },
        { icon: 'users', tone: 'blue', label: 'Người dùng phát sinh', value: new Set(items.map((item) => item.userId).filter(Boolean)).size },
        { icon: 'folder', tone: 'amber', label: 'Module có hoạt động', value: new Set(items.map((item) => item.module)).size },
      ]}
    />
  );
}
