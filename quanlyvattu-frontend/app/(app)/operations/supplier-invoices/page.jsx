'use client';

import { DocumentManagementPage } from '@/components/pages/document-management-page';
import { StatusBadge } from '@/components/ui/status-badge';
import { api } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/format';
import { loadOperationReferences } from '@/lib/reference-loaders';

export default function SupplierInvoicesPage() {
  return (
    <DocumentManagementPage
      eyebrow="Operations"
      title="Hóa đơn nhà cung cấp"
      description="Theo dõi hóa đơn đầu vào, liên kết với PO, phục vụ nhận hàng và đối chiếu chi phí vật tư."
      listLoader={api.operations.listSupplierInvoices}
      detailLoader={api.operations.getSupplierInvoice}
      createLoader={api.operations.createSupplierInvoice}
      readPermission="invoices.read"
      writePermission="invoices.write"
      loadReferences={loadOperationReferences}
      searchKeys={['invoiceNo', 'supplier.name', 'purchaseOrder.poNo', 'status']}
      fields={[
        { key: 'invoiceNo', label: 'Số hóa đơn', required: true },
        { key: 'supplierId', label: 'Nhà cung cấp', type: 'select', required: true, optionsKey: 'supplierOptions' },
        { key: 'purchaseOrderId', label: 'Liên kết PO', type: 'select', optionsKey: 'purchaseOrderOptions' },
        { key: 'invoiceDate', label: 'Ngày hóa đơn', type: 'date' },
        { key: 'dueDate', label: 'Hạn thanh toán', type: 'date' },
        { key: 'attachmentUrl', label: 'Link file đính kèm', fullWidth: true, placeholder: 'https://...' },
        { key: 'note', label: 'Ghi chú', type: 'textarea', fullWidth: true },
      ]}
      initialValues={{ invoiceNo: '', supplierId: '', purchaseOrderId: '', invoiceDate: '', dueDate: '', attachmentUrl: '', note: '', items: [{ materialId: '', qty: '0', unitPrice: '0', taxRate: '10' }] }}
      itemFields={[
        { key: 'materialId', label: 'Vật tư', type: 'select', optionsKey: 'materialOptions' },
        { key: 'qty', label: 'Số lượng', type: 'number', step: '0.001' },
        { key: 'unitPrice', label: 'Đơn giá', type: 'number', step: '1' },
        { key: 'taxRate', label: 'VAT %', type: 'number', step: '0.01' },
      ]}
      mapSubmit={(values) => ({
        ...values,
        purchaseOrderId: values.purchaseOrderId || undefined,
        invoiceDate: values.invoiceDate || undefined,
        dueDate: values.dueDate || undefined,
        attachmentUrl: values.attachmentUrl || undefined,
        note: values.note || undefined,
        items: (values.items || []).map((item) => ({
          materialId: item.materialId,
          qty: Number(item.qty || 0),
          unitPrice: Number(item.unitPrice || 0),
          taxRate: Number(item.taxRate || 0),
        })),
      })}
      columns={[
        { label: 'Số hóa đơn', key: 'invoiceNo', render: (row) => <span className="font-semibold text-slate-900">{row.invoiceNo}</span> },
        { label: 'Nhà cung cấp', key: 'supplier', render: (row) => row.supplier?.name || '—' },
        { label: 'PO liên kết', key: 'purchaseOrder', render: (row) => row.purchaseOrder?.poNo || '—' },
        { label: 'Ngày hóa đơn', key: 'invoiceDate', render: (row) => formatDate(row.invoiceDate) },
        { label: 'Tổng tiền', key: 'grandTotal', render: (row) => formatCurrency(row.grandTotal || 0) },
        { label: 'Trạng thái', key: 'status', render: (row) => <StatusBadge status={row.status} /> },
      ]}
      actionButtons={[
        {
          label: 'Duyệt',
          permission: 'invoices.approve',
          visible: (row) => ['DRAFT', 'SUBMITTED'].includes(row.status),
          variant: 'success',
          confirmMessage: (row) => `Duyệt hóa đơn ${row.invoiceNo}?`,
          handler: (token, row) => api.operations.approveSupplierInvoice(token, row.id),
        },
      ]}
      statsBuilder={(items) => [
        { icon: 'invoice', tone: 'teal', label: 'Tổng hóa đơn', value: items.length },
        { icon: 'chart', tone: 'emerald', label: 'Đã duyệt', value: items.filter((item) => item.status === 'APPROVED').length },
        { icon: 'alert', tone: 'amber', label: 'Nháp / chờ duyệt', value: items.filter((item) => ['DRAFT', 'SUBMITTED'].includes(item.status)).length },
        { icon: 'receipt', tone: 'blue', label: 'Có PO liên kết', value: items.filter((item) => item.purchaseOrderId).length },
      ]}
      detailMeta={[
        { label: 'Số hóa đơn', render: (row) => row.invoiceNo },
        { label: 'Trạng thái', render: (row) => <StatusBadge status={row.status} /> },
        { label: 'Nhà cung cấp', render: (row) => row.supplier?.name || '—' },
        { label: 'PO liên kết', render: (row) => row.purchaseOrder?.poNo || '—' },
        { label: 'Ngày hóa đơn', render: (row) => formatDate(row.invoiceDate) },
        { label: 'Hạn thanh toán', render: (row) => formatDate(row.dueDate) },
      ]}
    />
  );
}
