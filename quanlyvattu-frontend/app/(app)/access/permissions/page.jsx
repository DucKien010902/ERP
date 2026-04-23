'use client';

import { ReadOnlyListPage } from '@/components/pages/read-only-list-page';
import { api } from '@/lib/api';
import { Badge } from '@/components/ui/badge';

export default function PermissionsPage() {
  return (
    <ReadOnlyListPage
      eyebrow="Access Control"
      title="Danh sách quyền"
      description="Quyền hành động cấp backend để ẩn/hiện tính năng trên giao diện và kiểm soát thao tác."
      loader={api.access.permissions}
      readPermission="roles.read"
      searchKeys={['code', 'name', 'group']}
      columns={[
        { label: 'Code', key: 'code', render: (row) => <span className="font-mono text-xs text-slate-700">{row.code}</span> },
        { label: 'Tên quyền', key: 'name' },
        { label: 'Nhóm', key: 'group', render: (row) => <Badge tone="blue">{row.group}</Badge> },
      ]}
      statsBuilder={(items) => [
        { icon: 'key', tone: 'teal', label: 'Tổng quyền', value: items.length },
        { icon: 'folder', tone: 'blue', label: 'Nhóm module', value: new Set(items.map((item) => item.group)).size },
      ]}
    />
  );
}
