'use client';

import { DocumentManagementPage } from '@/components/pages/document-management-page';
import { StatusBadge } from '@/components/ui/status-badge';
import { api } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/format';
import { loadOperationReferences } from '@/lib/reference-loaders';

export default function StockDocumentsPage() {
  return (
    <DocumentManagementPage
      eyebrow="Operations"
      title="Chứng từ kho"
      description="Quản lý phiếu nhập, xuất, chuyển, điều chỉnh và post vào ledger/inventory balance giống luồng enterprise hiện đại."
      listLoader={api.operations.listStockDocuments}
      detailLoader={api.operations.getStockDocument}
      createLoader={api.operations.createStockDocument}
      readPermission="stock-documents.read"
      writePermission="stock-documents.write"
      loadReferences={loadOperationReferences}
      searchKeys={['documentNo', 'referenceNo', 'project.name', 'supplier.name', 'type', 'status']}
      fields={[
        { key: 'type', label: 'Loại chứng từ', type: 'select', required: true, optionsKey: 'stockDocumentTypeOptions' },
        { key: 'referenceNo', label: 'Số tham chiếu' },
        { key: 'projectId', label: 'Công trình', type: 'select', optionsKey: 'projectOptions' },
        { key: 'supplierId', label: 'Nhà cung cấp', type: 'select', optionsKey: 'supplierOptions' },
        { key: 'invoiceId', label: 'Hóa đơn liên kết', type: 'select', optionsKey: 'invoiceOptions' },
        { key: 'requestId', label: 'Yêu cầu vật tư', type: 'select', optionsKey: 'requestOptions' },
        { key: 'sourceWarehouseId', label: 'Kho nguồn', type: 'select', optionsKey: 'warehouseOptions' },
        { key: 'destinationWarehouseId', label: 'Kho đích', type: 'select', optionsKey: 'warehouseOptions' },
        { key: 'documentDate', label: 'Ngày chứng từ', type: 'date' },
        { key: 'postingDate', label: 'Ngày hạch toán', type: 'date' },
        { key: 'note', label: 'Ghi chú', type: 'textarea', fullWidth: true },
      ]}
      initialValues={{ type: 'RECEIPT', referenceNo: '', projectId: '', supplierId: '', invoiceId: '', requestId: '', sourceWarehouseId: '', destinationWarehouseId: '', documentDate: '', postingDate: '', note: '', items: [{ materialId: '', qty: '0', unitCost: '0', taxRate: '10', batchNo: '', serialNo: '', note: '' }] }}
      itemFields={[
        { key: 'materialId', label: 'Vật tư', type: 'select', optionsKey: 'materialOptions' },
        { key: 'qty', label: 'Số lượng', type: 'number', step: '0.001' },
        { key: 'unitCost', label: 'Đơn giá vốn', type: 'number', step: '1' },
        { key: 'taxRate', label: 'VAT %', type: 'number', step: '0.01' },
        { key: 'batchNo', label: 'Batch/Lot' },
        { key: 'serialNo', label: 'Serial' },
        { key: 'note', label: 'Ghi chú dòng' },
      ]}
      mapSubmit={(values) => ({
        ...values,
        referenceNo: values.referenceNo || undefined,
        projectId: values.projectId || undefined,
        supplierId: values.supplierId || undefined,
        invoiceId: values.invoiceId || undefined,
        requestId: values.requestId || undefined,
        sourceWarehouseId: values.sourceWarehouseId || undefined,
        destinationWarehouseId: values.destinationWarehouseId || undefined,
        documentDate: values.documentDate || undefined,
        postingDate: values.postingDate || undefined,
        note: values.note || undefined,
        items: (values.items || []).map((item) => ({
          materialId: item.materialId,
          qty: Number(item.qty || 0),
          unitCost: Number(item.unitCost || 0),
          taxRate: Number(item.taxRate || 0),
          batchNo: item.batchNo || undefined,
          serialNo: item.serialNo || undefined,
          note: item.note || undefined,
        })),
      })}
      columns={[
        { label: 'Số CT', key: 'documentNo', render: (row) => <span className="font-semibold text-slate-900">{row.documentNo}</span> },
        { label: 'Loại', key: 'type', render: (row) => row.type },
        { label: 'Kho nguồn → đích', key: 'warehouses', render: (row) => `${row.sourceWarehouse?.name || '—'} → ${row.destinationWarehouse?.name || '—'}` },
        { label: 'Ngày chứng từ', key: 'documentDate', render: (row) => formatDate(row.documentDate) },
        { label: 'Tổng tiền', key: 'grandTotal', render: (row) => formatCurrency(row.grandTotal || 0) },
        { label: 'Trạng thái', key: 'status', render: (row) => <StatusBadge status={row.status} /> },
      ]}
      actionButtons={[
        {
          label: 'Submit',
          permission: 'stock-documents.submit',
          visible: (row) => row.status === 'DRAFT',
          variant: 'secondary',
          confirmMessage: (row) => `Gửi chứng từ ${row.documentNo} để chờ duyệt?`,
          handler: (token, row) => api.operations.submitStockDocument(token, row.id),
        },
        {
          label: 'Duyệt',
          permission: 'stock-documents.approve',
          visible: (row) => ['DRAFT', 'PENDING_APPROVAL'].includes(row.status),
          variant: 'success',
          confirmMessage: (row) => `Phê duyệt chứng từ ${row.documentNo}?`,
          handler: (token, row) => api.operations.approveStockDocument(token, row.id),
        },
        {
          label: 'Post',
          permission: 'stock-documents.post',
          visible: (row) => row.status === 'APPROVED',
          variant: 'primary',
          confirmMessage: (row) => `Post chứng từ ${row.documentNo} vào sổ kho? Thao tác này sẽ cập nhật tồn kho.`,
          handler: (token, row) => api.operations.postStockDocument(token, row.id),
        },
      ]}
      statsBuilder={(items) => [
        { icon: 'layers', tone: 'teal', label: 'Tổng chứng từ', value: items.length },
        { icon: 'alert', tone: 'amber', label: 'Chờ duyệt', value: items.filter((item) => item.status === 'PENDING_APPROVAL').length },
        { icon: 'shield', tone: 'emerald', label: 'Đã post', value: items.filter((item) => item.status === 'POSTED').length },
        { icon: 'swap', tone: 'blue', label: 'Phiếu chuyển', value: items.filter((item) => item.type === 'TRANSFER').length },
      ]}
      detailMeta={[
        { label: 'Số CT', render: (row) => row.documentNo },
        { label: 'Trạng thái', render: (row) => <StatusBadge status={row.status} /> },
        { label: 'Loại chứng từ', render: (row) => row.type },
        { label: 'Kho nguồn', render: (row) => row.sourceWarehouse?.name || '—' },
        { label: 'Kho đích', render: (row) => row.destinationWarehouse?.name || '—' },
        { label: 'Ngày hạch toán', render: (row) => formatDate(row.postingDate) },
      ]}
    />
  );
}
