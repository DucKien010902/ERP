'use client';

import { SimpleCrudPage } from '@/components/pages/simple-crud-page';
import { api } from '@/lib/api';
import { loadMasterReferences } from '@/lib/reference-loaders';
import { formatNumber } from '@/lib/format';

export default function MaterialsPage() {
  return (
    <SimpleCrudPage
      eyebrow="Master Data"
      title="Danh mục vật tư"
      description="Quản lý mã vật tư, SKU, thương hiệu, quy cách và mức tồn min/max để làm nền cho mọi giao dịch nhập xuất tồn."
      endpointLoader={api.masters.materials}
      createLoader={api.masters.createMaterial}
      readPermission="masters.read"
      writePermission="masters.write"
      loadReferences={loadMasterReferences}
      searchKeys={['code', 'sku', 'name', 'brand', 'category.name', 'unit.name']}
      initialValues={{
        code: '',
        sku: '',
        name: '',
        categoryId: '',
        unitId: '',
        description: '',
        brand: '',
        specification: '',
        minStock: '0',
        maxStock: '0',
        trackBatch: false,
        trackSerial: false,
      }}
      fields={[
        { key: 'code', label: 'Mã vật tư', required: true, placeholder: 'VD: VT-STEEL-001' },
        { key: 'sku', label: 'SKU', required: true, placeholder: 'VD: REBAR-D16' },
        { key: 'name', label: 'Tên vật tư', required: true, placeholder: 'VD: Rebar D16', fullWidth: true },
        { key: 'categoryId', label: 'Nhóm vật tư', type: 'select', required: true, optionsKey: 'categoryOptions' },
        { key: 'unitId', label: 'Đơn vị tính', type: 'select', required: true, optionsKey: 'unitOptions' },
        { key: 'brand', label: 'Thương hiệu', placeholder: 'VD: Hoa Phat' },
        { key: 'specification', label: 'Quy cách', placeholder: 'VD: D16 / 50kg', fullWidth: true },
        { key: 'description', label: 'Mô tả', type: 'textarea', fullWidth: true },
        { key: 'minStock', label: 'Tồn tối thiểu', type: 'number', step: '0.001' },
        { key: 'maxStock', label: 'Tồn tối đa', type: 'number', step: '0.001' },
        { key: 'trackBatch', label: 'Theo dõi batch', type: 'checkbox', description: 'Dùng cho xi măng, lô hàng, vật tư có batch.' },
        { key: 'trackSerial', label: 'Theo dõi serial', type: 'checkbox', description: 'Dùng cho thiết bị, tài sản có serial riêng.' },
      ]}
      mapSubmit={(values) => ({
        ...values,
        minStock: Number(values.minStock || 0),
        maxStock: Number(values.maxStock || 0),
      })}
      columns={[
        { label: 'Mã', key: 'code', render: (row) => <span className="font-semibold text-slate-900">{row.code}</span> },
        { label: 'SKU', key: 'sku', render: (row) => <span className="text-xs uppercase tracking-wide text-slate-500">{row.sku}</span> },
        { label: 'Tên vật tư', key: 'name' },
        { label: 'Nhóm', key: 'category', render: (row) => row.category?.name || '—' },
        { label: 'Đơn vị', key: 'unit', render: (row) => row.unit?.symbol || row.unit?.name || '—' },
        { label: 'Min / Max', key: 'minStock', render: (row) => `${formatNumber(row.minStock, 0)} / ${formatNumber(row.maxStock, 0)}` },
      ]}
      statsBuilder={(items) => [
        { icon: 'box', tone: 'teal', label: 'Tổng vật tư', value: items.length },
        { icon: 'alert', tone: 'amber', label: 'Theo dõi batch', value: items.filter((item) => item.trackBatch).length },
        { icon: 'shield', tone: 'blue', label: 'Theo dõi serial', value: items.filter((item) => item.trackSerial).length },
        { icon: 'chart', tone: 'violet', label: 'Có định mức min/max', value: items.filter((item) => Number(item.maxStock || 0) > 0).length },
      ]}
    />
  );
}
