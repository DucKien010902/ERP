'use client';

import { SimpleCrudPage } from '@/components/pages/simple-crud-page';
import { api } from '@/lib/api';
import { ProjectStatusBadge } from '@/components/ui/status-badge';

export default function ProjectsPage() {
  return (
    <SimpleCrudPage
      eyebrow="Master Data"
      title="Công trình"
      description="Quản lý mã dự án, địa điểm, trạng thái triển khai và người phụ trách để liên kết xuyên suốt với yêu cầu vật tư và chứng từ kho."
      endpointLoader={api.masters.projects}
      createLoader={api.masters.createProject}
      readPermission="masters.read"
      writePermission="masters.write"
      searchKeys={['code', 'name', 'location', 'managerName', 'status']}
      initialValues={{ code: '', name: '', location: '', status: 'ACTIVE', startDate: '', endDate: '', managerName: '' }}
      fields={[
        { key: 'code', label: 'Mã công trình', required: true, placeholder: 'VD: DUAN-TA' },
        { key: 'name', label: 'Tên công trình', required: true, placeholder: 'VD: Tower A Apartment Project', fullWidth: true },
        { key: 'location', label: 'Địa điểm', placeholder: 'VD: District 7, HCMC', fullWidth: true },
        { key: 'status', label: 'Trạng thái', type: 'select', options: [
          { value: 'PLANNING', label: 'Lập kế hoạch' },
          { value: 'ACTIVE', label: 'Đang triển khai' },
          { value: 'ON_HOLD', label: 'Tạm dừng' },
          { value: 'COMPLETED', label: 'Hoàn thành' },
          { value: 'CANCELLED', label: 'Hủy' },
        ] },
        { key: 'managerName', label: 'Chỉ huy trưởng / PM', placeholder: 'Người phụ trách' },
        { key: 'startDate', label: 'Ngày bắt đầu', type: 'date' },
        { key: 'endDate', label: 'Ngày kết thúc', type: 'date' },
      ]}
      columns={[
        { label: 'Mã CT', key: 'code', render: (row) => <span className="font-semibold text-slate-900">{row.code}</span> },
        { label: 'Tên công trình', key: 'name' },
        { label: 'Trạng thái', key: 'status', render: (row) => <ProjectStatusBadge status={row.status} /> },
        { label: 'Địa điểm', key: 'location', render: (row) => row.location || '—' },
        { label: 'Quản lý', key: 'managerName', render: (row) => row.managerName || '—' },
      ]}
      statsBuilder={(items) => [
        { icon: 'building', tone: 'teal', label: 'Tổng công trình', value: items.length },
        { icon: 'chart', tone: 'emerald', label: 'Đang triển khai', value: items.filter((item) => item.status === 'ACTIVE').length },
        { icon: 'clipboard', tone: 'blue', label: 'Đã hoàn thành', value: items.filter((item) => item.status === 'COMPLETED').length },
      ]}
    />
  );
}
