'use client';

import { SimpleCrudPage } from '@/components/pages/simple-crud-page';
import { api } from '@/lib/api';

export default function UnitsPage() {
  return (
    <SimpleCrudPage
      eyebrow="Master Data"
      title="Đơn vị tính"
      description="Quản lý đơn vị chuẩn cho vật tư, giúp đồng bộ nhập liệu giữa kho, công trường và bộ phận mua hàng."
      endpointLoader={api.masters.units}
      createLoader={api.masters.createUnit}
      readPermission="masters.read"
      writePermission="masters.write"
      searchKeys={['code', 'name', 'symbol']}
      initialValues={{ code: '', name: '', symbol: '' }}
      fields={[
        { key: 'code', label: 'Mã đơn vị', required: true, placeholder: 'VD: PCS' },
        { key: 'name', label: 'Tên đơn vị', required: true, placeholder: 'VD: Piece' },
        { key: 'symbol', label: 'Ký hiệu', placeholder: 'VD: pcs' },
      ]}
      columns={[
        { label: 'Mã', key: 'code', render: (row) => <span className="font-semibold text-slate-900">{row.code}</span> },
        { label: 'Tên đơn vị', key: 'name' },
        { label: 'Ký hiệu', key: 'symbol', render: (row) => row.symbol || '—' },
        { label: 'Ngày tạo', key: 'createdAt', render: (row) => new Date(row.createdAt).toLocaleDateString('vi-VN') },
      ]}
      statsBuilder={(items) => [
        { icon: 'scale', tone: 'teal', label: 'Tổng đơn vị', value: items.length },
        { icon: 'box', tone: 'blue', label: 'Chuẩn hóa nhập liệu', value: items.filter((item) => item.symbol).length, helper: 'Đơn vị có ký hiệu đầy đủ' },
      ]}
    />
  );
}
