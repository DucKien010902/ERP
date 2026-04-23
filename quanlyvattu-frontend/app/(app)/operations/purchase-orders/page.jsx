'use client';

import { DocumentManagementPage } from '@/components/pages/document-management-page';
import { StatusBadge } from '@/components/ui/status-badge';
import { api } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/format';
import { loadMasterReferences } from '@/lib/reference-loaders';

export default function PurchaseOrdersPage() {
  return (
    <DocumentManagementPage
      eyebrow="Operations"
      title="Đơn mua hàng"
      description="Quản lý mua hàng đầu vào cho kho/công trình, làm căn cứ cho nhận hàng, hóa đơn NCC và đối soát nhập kho."
      listLoader={api.operations.listPurchaseOrders}
      detailLoader={api.operations.getPurchaseOrder}
      createLoader={api.operations.createPurchaseOrder}
      readPermission="purchase-orders.read"
      writePermission="purchase-orders.write"
      loadReferences={loadMasterReferences}
      searchKeys={['poNo', 'supplier.name', 'project.name', 'warehouse.name', 'status']}
      fields={[
        { key: 'supplierId', label: 'Nhà cung cấp', type: 'select', required: true, optionsKey: 'supplierOptions' },
        { key: 'projectId', label: 'Công trình', type: 'select', optionsKey: 'projectOptions' },
        { key: 'warehouseId', label: 'Kho nhận hàng', type: 'select', optionsKey: 'warehouseOptions' },
        { key: 'orderDate', label: 'Ngày đặt hàng', type: 'date' },
        { key: 'expectedDeliveryDate', label: 'Ngày dự kiến giao', type: 'date' },
        { key: 'note', label: 'Ghi chú', type: 'textarea', fullWidth: true },
      ]}
      initialValues={{ supplierId: '', projectId: '', warehouseId: '', orderDate: '', expectedDeliveryDate: '', note: '', items: [{ materialId: '', qty: '0', unitPrice: '0', taxRate: '10' }] }}
      itemFields={[
        { key: 'materialId', label: 'Vật tư', type: 'select', optionsKey: 'materialOptions' },
        { key: 'qty', label: 'Số lượng', type: 'number', step: '0.001' },
        { key: 'unitPrice', label: 'Đơn giá', type: 'number', step: '1' },
        { key: 'taxRate', label: 'VAT %', type: 'number', step: '0.01' },
      ]}
      mapSubmit={(values) => ({
        ...values,
        projectId: values.projectId || undefined,
        warehouseId: values.warehouseId || undefined,
        orderDate: values.orderDate || undefined,
        expectedDeliveryDate: values.expectedDeliveryDate || undefined,
        note: values.note || undefined,
        items: (values.items || []).map((item) => ({
          materialId: item.materialId,
          qty: Number(item.qty || 0),
          unitPrice: Number(item.unitPrice || 0),
          taxRate: Number(item.taxRate || 0),
        })),
      })}
      columns={[
        { label: 'Số PO', key: 'poNo', render: (row) => <span className="font-semibold text-slate-900">{row.poNo}</span> },
        { label: 'Nhà cung cấp', key: 'supplier', render: (row) => row.supplier?.name || '—' },
        { label: 'Kho / Công trình', key: 'target', render: (row) => row.warehouse?.name || row.project?.name || '—' },
        { label: 'Ngày đặt', key: 'orderDate', render: (row) => formatDate(row.orderDate) },
        { label: 'Tổng tiền', key: 'grandTotal', render: (row) => formatCurrency(row.grandTotal || 0) },
        { label: 'Trạng thái', key: 'status', render: (row) => <StatusBadge status={row.status} /> },
      ]}
      actionButtons={[
        {
          label: 'Duyệt',
          permission: 'purchase-orders.approve',
          visible: (row) => ['DRAFT', 'SUBMITTED'].includes(row.status),
          variant: 'success',
          confirmMessage: (row) => `Duyệt PO ${row.poNo}?`,
          handler: (token, row) => api.operations.approvePurchaseOrder(token, row.id),
        },
      ]}
      statsBuilder={(items) => [
        { icon: 'receipt', tone: 'teal', label: 'Tổng PO', value: items.length },
        { icon: 'chart', tone: 'emerald', label: 'Đã duyệt', value: items.filter((item) => item.status === 'APPROVED').length },
        { icon: 'alert', tone: 'amber', label: 'Nháp / chờ duyệt', value: items.filter((item) => ['DRAFT', 'SUBMITTED'].includes(item.status)).length },
        { icon: 'truck', tone: 'blue', label: 'Đã nhận xong', value: items.filter((item) => item.status === 'RECEIVED').length },
      ]}
      detailMeta={[
        { label: 'Số PO', render: (row) => row.poNo },
        { label: 'Trạng thái', render: (row) => <StatusBadge status={row.status} /> },
        { label: 'Nhà cung cấp', render: (row) => row.supplier?.name || '—' },
        { label: 'Kho nhận', render: (row) => row.warehouse?.name || '—' },
        { label: 'Công trình', render: (row) => row.project?.name || '—' },
        { label: 'Ngày giao dự kiến', render: (row) => formatDate(row.expectedDeliveryDate) },
      ]}
    />
  );
}
