'use client';

import { SimpleCrudPage } from '@/components/pages/simple-crud-page';
import { api } from '@/lib/api';
import { loadMasterReferences } from '@/lib/reference-loaders';

export default function CategoriesPage() {
  return (
    <SimpleCrudPage
      eyebrow="Master Data"
      title="Nhóm vật tư"
      description="Tổ chức cây danh mục vật tư theo logic ngành xây dựng để phục vụ tìm kiếm, báo cáo và kiểm soát tồn kho."
      endpointLoader={api.masters.categories}
      createLoader={api.masters.createCategory}
      readPermission="masters.read"
      writePermission="masters.write"
      searchKeys={['code', 'name', 'parent.name']}
      loadReferences={loadMasterReferences}
      initialValues={{ code: '', name: '', parentId: '' }}
      fields={[
        { key: 'code', label: 'Mã nhóm', required: true, placeholder: 'VD: STEEL' },
        { key: 'name', label: 'Tên nhóm', required: true, placeholder: 'VD: Steel' },
        { key: 'parentId', label: 'Nhóm cha', type: 'select', optionsKey: 'categoryOptions', placeholder: 'Không chọn nếu là nhóm gốc' },
      ]}
      columns={[
        { label: 'Mã', key: 'code', render: (row) => <span className="font-semibold text-slate-900">{row.code}</span> },
        { label: 'Tên nhóm', key: 'name' },
        { label: 'Nhóm cha', key: 'parent', render: (row) => row.parent?.name || '—' },
        { label: 'Ngày tạo', key: 'createdAt', render: (row) => new Date(row.createdAt).toLocaleDateString('vi-VN') },
      ]}
      statsBuilder={(items) => [
        { icon: 'folder', tone: 'teal', label: 'Tổng nhóm vật tư', value: items.length },
        { icon: 'folder', tone: 'amber', label: 'Nhóm con', value: items.filter((item) => item.parentId).length },
      ]}
    />
  );
}
