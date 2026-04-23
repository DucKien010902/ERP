'use client';

import { SimpleCrudPage } from '@/components/pages/simple-crud-page';
import { api } from '@/lib/api';
import { WarehouseTypeBadge } from '@/components/ui/status-badge';

export default function WarehousesPage() {
  return (
    <SimpleCrudPage
      eyebrow="Master Data"
      title="Kho vật tư"
      description="Khai báo kho trung tâm, kho công trường và kho trung chuyển để quản lý nguồn - đích của mọi chứng từ kho."
      endpointLoader={api.masters.warehouses}
      createLoader={api.masters.createWarehouse}
      readPermission="masters.read"
      writePermission="masters.write"
      searchKeys={['code', 'name', 'type', 'address', 'managerName']}
      initialValues={{ code: '', name: '', type: 'MAIN', address: '', managerName: '' }}
      fields={[
        { key: 'code', label: 'Mã kho', required: true, placeholder: 'VD: KHO-TT' },
        { key: 'name', label: 'Tên kho', required: true, placeholder: 'VD: Central Warehouse' },
        { key: 'type', label: 'Loại kho', type: 'select', required: true, options: [
          { value: 'MAIN', label: 'Kho trung tâm' },
          { value: 'SITE', label: 'Kho công trường' },
          { value: 'TRANSIT', label: 'Kho trung chuyển' },
        ] },
        { key: 'managerName', label: 'Người phụ trách', placeholder: 'VD: Phạm Hoàng Hải' },
        { key: 'address', label: 'Địa chỉ', fullWidth: true, placeholder: 'Địa điểm kho' },
      ]}
      columns={[
        { label: 'Mã kho', key: 'code', render: (row) => <span className="font-semibold text-slate-900">{row.code}</span> },
        { label: 'Tên kho', key: 'name' },
        { label: 'Loại', key: 'type', render: (row) => <WarehouseTypeBadge status={row.type} /> },
        { label: 'Người phụ trách', key: 'managerName', render: (row) => row.managerName || '—' },
        { label: 'Địa chỉ', key: 'address', render: (row) => row.address || '—' },
      ]}
      statsBuilder={(items) => [
        { icon: 'warehouse', tone: 'blue', label: 'Tổng kho', value: items.length },
        { icon: 'warehouse', tone: 'teal', label: 'Kho trung tâm', value: items.filter((item) => item.type === 'MAIN').length },
        { icon: 'building', tone: 'emerald', label: 'Kho công trường', value: items.filter((item) => item.type === 'SITE').length },
      ]}
    />
  );
}
