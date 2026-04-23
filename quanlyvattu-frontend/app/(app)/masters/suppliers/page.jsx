'use client';

import { SimpleCrudPage } from '@/components/pages/simple-crud-page';
import { api } from '@/lib/api';

export default function SuppliersPage() {
  return (
    <SimpleCrudPage
      eyebrow="Master Data"
      title="Nhà cung cấp"
      description="Lưu thông tin NCC, mã số thuế, đầu mối liên hệ và điều khoản thanh toán để phục vụ PO, hóa đơn và đối soát mua hàng."
      endpointLoader={api.masters.suppliers}
      createLoader={api.masters.createSupplier}
      readPermission="masters.read"
      writePermission="masters.write"
      searchKeys={['code', 'name', 'taxCode', 'contactName', 'email', 'phone']}
      initialValues={{ code: '', name: '', taxCode: '', address: '', contactName: '', phone: '', email: '', paymentTerms: '' }}
      fields={[
        { key: 'code', label: 'Mã NCC', required: true, placeholder: 'VD: NCC-STEEL-01' },
        { key: 'name', label: 'Tên nhà cung cấp', required: true, placeholder: 'VD: Hòa Phát Materials', fullWidth: true },
        { key: 'taxCode', label: 'Mã số thuế' },
        { key: 'contactName', label: 'Đầu mối liên hệ' },
        { key: 'phone', label: 'Số điện thoại' },
        { key: 'email', label: 'Email', type: 'email' },
        { key: 'paymentTerms', label: 'Điều khoản thanh toán', placeholder: 'VD: 30 ngày', fullWidth: true },
        { key: 'address', label: 'Địa chỉ', fullWidth: true },
      ]}
      columns={[
        { label: 'Mã NCC', key: 'code', render: (row) => <span className="font-semibold text-slate-900">{row.code}</span> },
        { label: 'Tên nhà cung cấp', key: 'name' },
        { label: 'MST', key: 'taxCode', render: (row) => row.taxCode || '—' },
        { label: 'Liên hệ', key: 'contactName', render: (row) => row.contactName || '—' },
        { label: 'Email / SĐT', key: 'email', render: (row) => row.email || row.phone || '—' },
      ]}
      statsBuilder={(items) => [
        { icon: 'truck', tone: 'teal', label: 'Tổng NCC', value: items.length },
        { icon: 'truck', tone: 'blue', label: 'Có email', value: items.filter((item) => item.email).length },
        { icon: 'receipt', tone: 'amber', label: 'Có điều khoản TT', value: items.filter((item) => item.paymentTerms).length },
      ]}
    />
  );
}
