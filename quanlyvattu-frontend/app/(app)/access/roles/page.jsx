'use client';

import { ReadOnlyListPage } from '@/components/pages/read-only-list-page';
import { api } from '@/lib/api';
import { Badge } from '@/components/ui/badge';

export default function RolesPage() {
  return (
    <ReadOnlyListPage
      eyebrow="Access Control"
      title="Vai trò hệ thống"
      description="Các role được seed sẵn theo đúng mô hình vận hành vật tư: super admin, procurement, warehouse, site, accountant, executive viewer."
      loader={api.access.roles}
      readPermission="roles.read"
      searchKeys={['name', 'code', 'description']}
      columns={[
        { label: 'Vai trò', key: 'name', render: (row) => <div><div className="font-semibold text-slate-900">{row.name}</div><div className="text-xs text-slate-500">{row.code}</div></div> },
        { label: 'Mô tả', key: 'description', render: (row) => row.description || '—' },
        { label: 'Loại', key: 'isSystem', render: (row) => <Badge tone={row.isSystem ? 'teal' : 'slate'}>{row.isSystem ? 'System role' : 'Custom role'}</Badge> },
        { label: 'Số quyền', key: 'permissions', render: (row) => row.permissions?.length || 0 },
      ]}
      statsBuilder={(items) => [
        { icon: 'shield', tone: 'teal', label: 'Tổng vai trò', value: items.length },
        { icon: 'key', tone: 'blue', label: 'Role hệ thống', value: items.filter((item) => item.isSystem).length },
      ]}
    />
  );
}
