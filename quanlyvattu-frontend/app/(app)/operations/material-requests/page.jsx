'use client';

import { DocumentManagementPage } from '@/components/pages/document-management-page';
import { StatusBadge } from '@/components/ui/status-badge';
import { api } from '@/lib/api';
import { formatDate, formatNumber } from '@/lib/format';
import { loadMasterReferences } from '@/lib/reference-loaders';

export default function MaterialRequestsPage() {
  return (
    <DocumentManagementPage
      eyebrow="Operations"
      title="Yêu cầu vật tư"
      description="Luồng xin cấp vật tư từ công trường: tạo yêu cầu, submit, phê duyệt và theo dõi mức fulfilled thông qua phiếu xuất kho."
      listLoader={api.operations.listMaterialRequests}
      detailLoader={api.operations.getMaterialRequest}
      createLoader={api.operations.createMaterialRequest}
      readPermission="requests.read"
      writePermission="requests.write"
      loadReferences={loadMasterReferences}
      searchKeys={['requestNo', 'project.name', 'warehouse.name', 'status', 'requester.fullName']}
      fields={[
        { key: 'projectId', label: 'Công trình', type: 'select', required: true, optionsKey: 'projectOptions' },
        { key: 'warehouseId', label: 'Kho nguồn đề nghị', type: 'select', optionsKey: 'warehouseOptions' },
        { key: 'neededDate', label: 'Ngày cần vật tư', type: 'date' },
        { key: 'purpose', label: 'Mục đích sử dụng', type: 'textarea', fullWidth: true },
      ]}
      initialValues={{ projectId: '', warehouseId: '', neededDate: '', purpose: '', items: [{ materialId: '', requestedQty: '0', note: '' }] }}
      itemFields={[
        { key: 'materialId', label: 'Vật tư', type: 'select', optionsKey: 'materialOptions' },
        { key: 'requestedQty', label: 'Số lượng yêu cầu', type: 'number', step: '0.001' },
        { key: 'note', label: 'Ghi chú' },
      ]}
      mapSubmit={(values) => ({
        ...values,
        warehouseId: values.warehouseId || undefined,
        neededDate: values.neededDate || undefined,
        purpose: values.purpose || undefined,
        items: (values.items || []).map((item) => ({
          materialId: item.materialId,
          requestedQty: Number(item.requestedQty || 0),
          note: item.note || undefined,
        })),
      })}
      columns={[
        { label: 'Mã yêu cầu', key: 'requestNo', render: (row) => <span className="font-semibold text-slate-900">{row.requestNo}</span> },
        { label: 'Công trình', key: 'project', render: (row) => row.project?.name || '—' },
        { label: 'Kho đề nghị', key: 'warehouse', render: (row) => row.warehouse?.name || '—' },
        { label: 'Ngày cần', key: 'neededDate', render: (row) => formatDate(row.neededDate) },
        { label: 'Trạng thái', key: 'status', render: (row) => <StatusBadge status={row.status} /> },
        { label: 'Số dòng', key: 'items', render: (row) => row.items?.length || 0 },
      ]}
      actionButtons={[
        {
          label: 'Submit',
          permission: 'requests.submit',
          visible: (row) => row.status === 'DRAFT',
          variant: 'secondary',
          confirmMessage: (row) => `Gửi yêu cầu ${row.requestNo} để chờ duyệt?`,
          handler: (token, row) => api.operations.submitMaterialRequest(token, row.id),
        },
        {
          label: 'Duyệt',
          permission: 'requests.approve',
          visible: (row) => ['SUBMITTED', 'PARTIAL'].includes(row.status),
          variant: 'success',
          confirmMessage: (row) => `Phê duyệt yêu cầu ${row.requestNo}?`,
          handler: (token, row) => api.operations.approveMaterialRequest(token, row.id),
        },
      ]}
      statsBuilder={(items) => [
        { icon: 'clipboard', tone: 'teal', label: 'Tổng yêu cầu', value: items.length },
        { icon: 'alert', tone: 'amber', label: 'Chờ duyệt', value: items.filter((item) => item.status === 'SUBMITTED').length },
        { icon: 'chart', tone: 'emerald', label: 'Hoàn tất', value: items.filter((item) => item.status === 'FULFILLED').length },
        { icon: 'layers', tone: 'blue', label: 'Đã phê duyệt', value: items.filter((item) => item.status === 'APPROVED').length },
      ]}
      detailMeta={[
        { label: 'Mã yêu cầu', render: (row) => row.requestNo },
        { label: 'Trạng thái', render: (row) => <StatusBadge status={row.status} /> },
        { label: 'Công trình', render: (row) => row.project?.name || '—' },
        { label: 'Kho đề nghị', render: (row) => row.warehouse?.name || '—' },
        { label: 'Ngày cần', render: (row) => formatDate(row.neededDate) },
        { label: 'Người tạo', render: (row) => row.requester?.fullName || '—' },
      ]}
    />
  );
}
