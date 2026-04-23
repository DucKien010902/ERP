export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'WM Kalla Materials';
export const COMPANY_NAME = process.env.NEXT_PUBLIC_COMPANY_NAME || 'WM Kalla Construction';

export const NAV_SECTIONS = [
  {
    label: 'Tổng quan',
    items: [
      {
        href: '/dashboard',
        label: 'Dashboard',
        icon: 'dashboard',
        permissions: ['reports.read', 'inventory.read'],
      },
    ],
  },
  {
    label: 'Danh mục',
    items: [
      { href: '/masters/materials', label: 'Vật tư', icon: 'box', permissions: ['masters.read'] },
      { href: '/masters/categories', label: 'Nhóm vật tư', icon: 'folder', permissions: ['masters.read'] },
      { href: '/masters/units', label: 'Đơn vị tính', icon: 'scale', permissions: ['masters.read'] },
      { href: '/masters/warehouses', label: 'Kho', icon: 'warehouse', permissions: ['masters.read'] },
      { href: '/masters/projects', label: 'Công trình', icon: 'building', permissions: ['masters.read'] },
      { href: '/masters/suppliers', label: 'Nhà cung cấp', icon: 'truck', permissions: ['masters.read'] },
    ],
  },
  {
    label: 'Nghiệp vụ',
    items: [
      { href: '/operations/material-requests', label: 'Yêu cầu vật tư', icon: 'clipboard', permissions: ['requests.read'] },
      { href: '/operations/purchase-orders', label: 'Đơn mua hàng', icon: 'receipt', permissions: ['purchase-orders.read'] },
      { href: '/operations/supplier-invoices', label: 'Hóa đơn NCC', icon: 'invoice', permissions: ['invoices.read'] },
      { href: '/operations/stock-documents', label: 'Chứng từ kho', icon: 'layers', permissions: ['stock-documents.read'] },
    ],
  },
  {
    label: 'Tồn kho',
    items: [
      { href: '/inventory/balances', label: 'Tồn kho hiện tại', icon: 'database', permissions: ['inventory.read'] },
      { href: '/inventory/ledger', label: 'Sổ kho', icon: 'history', permissions: ['inventory.read'] },
      { href: '/inventory/low-stock', label: 'Cảnh báo thiếu hàng', icon: 'alert', permissions: ['inventory.read'] },
      { href: '/inventory/valuation', label: 'Giá trị tồn kho', icon: 'chart', permissions: ['inventory.read'] },
    ],
  },
  {
    label: 'Báo cáo',
    items: [
      { href: '/reports/project-consumption', label: 'Tiêu hao theo công trình', icon: 'chart', permissions: ['reports.read'] },
      { href: '/reports/movement-summary', label: 'Tổng hợp nhập xuất', icon: 'swap', permissions: ['reports.read'] },
      { href: '/audit/logs', label: 'Nhật ký thao tác', icon: 'shield', permissions: ['audits.read'] },
    ],
  },
  {
    label: 'Quản trị',
    items: [
      { href: '/access/users', label: 'Người dùng', icon: 'users', permissions: ['users.read'] },
      { href: '/access/roles', label: 'Vai trò', icon: 'shield', permissions: ['roles.read'] },
      { href: '/access/permissions', label: 'Quyền', icon: 'key', permissions: ['roles.read'] },
    ],
  },
];

export const STATUS_META = {
  DRAFT: { label: 'Nháp', tone: 'slate' },
  SUBMITTED: { label: 'Đã gửi', tone: 'blue' },
  APPROVED: { label: 'Đã duyệt', tone: 'emerald' },
  REJECTED: { label: 'Từ chối', tone: 'rose' },
  PARTIAL: { label: 'Cấp một phần', tone: 'amber' },
  FULFILLED: { label: 'Hoàn tất', tone: 'teal' },
  CANCELLED: { label: 'Hủy', tone: 'slate' },
  PARTIALLY_RECEIVED: { label: 'Nhận một phần', tone: 'amber' },
  RECEIVED: { label: 'Đã nhận', tone: 'teal' },
  PENDING_APPROVAL: { label: 'Chờ duyệt', tone: 'amber' },
  POSTED: { label: 'Đã hạch toán', tone: 'violet' },
  UNPAID: { label: 'Chưa thanh toán', tone: 'rose' },
  PAID: { label: 'Đã thanh toán', tone: 'emerald' },
};

export const PROJECT_STATUS_META = {
  PLANNING: { label: 'Lập kế hoạch', tone: 'slate' },
  ACTIVE: { label: 'Đang triển khai', tone: 'emerald' },
  ON_HOLD: { label: 'Tạm dừng', tone: 'amber' },
  COMPLETED: { label: 'Hoàn thành', tone: 'teal' },
  CANCELLED: { label: 'Hủy', tone: 'rose' },
};

export const WAREHOUSE_TYPE_META = {
  MAIN: { label: 'Kho trung tâm', tone: 'blue' },
  SITE: { label: 'Kho công trường', tone: 'emerald' },
  TRANSIT: { label: 'Kho trung chuyển', tone: 'amber' },
};

export const STOCK_DOCUMENT_TYPES = [
  { value: 'RECEIPT', label: 'Phiếu nhập' },
  { value: 'ISSUE', label: 'Phiếu xuất' },
  { value: 'TRANSFER', label: 'Phiếu chuyển kho' },
  { value: 'ADJUSTMENT', label: 'Phiếu điều chỉnh' },
  { value: 'RETURN_TO_SUPPLIER', label: 'Trả nhà cung cấp' },
  { value: 'RETURN_FROM_SITE', label: 'Hoàn từ công trường' },
];

export const AUDIT_ACTION_META = {
  CREATE: { label: 'Tạo mới', tone: 'blue' },
  UPDATE: { label: 'Cập nhật', tone: 'amber' },
  DELETE: { label: 'Xóa', tone: 'rose' },
  LOGIN: { label: 'Đăng nhập', tone: 'teal' },
  SUBMIT: { label: 'Gửi duyệt', tone: 'blue' },
  APPROVE: { label: 'Phê duyệt', tone: 'emerald' },
  REJECT: { label: 'Từ chối', tone: 'rose' },
  POST: { label: 'Hạch toán', tone: 'violet' },
};

export const DEMO_ACCOUNTS = [
  ['Super Admin', 'admin@wmkalla.local', 'Admin@123'],
  ['Warehouse', 'warehouse@wmkalla.local', 'Warehouse@123'],
  ['Site Manager', 'site.manager@wmkalla.local', 'Site@123'],
  ['Accountant', 'accountant@wmkalla.local', 'Accountant@123'],
];
