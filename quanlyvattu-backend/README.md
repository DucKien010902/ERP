# Construction Materials Backend

NestJS + MySQL backend cho quản lý vật tư công trường, được thiết kế theo hướng có thể tái sử dụng cho các mô hình inventory khác.

## Công nghệ
- NestJS 10
- MySQL 8
- TypeORM
- JWT Auth
- Swagger

## Tính năng chính
- Xác thực JWT
- RBAC: roles + permissions
- Master data: units, categories, materials, warehouses, projects, suppliers
- Material Requests
- Purchase Orders
- Supplier Invoices
- Stock Documents: receipt / issue / transfer / adjustment / returns
- Inventory ledger & balances
- Dashboard reports
- Audit logs
- Seed demo data tự động

## Chạy nhanh nhất

### Cách 1: Có Docker
```bash
cp .env.example .env
npm i
npm run dev:stack
```

### Cách 2: Có sẵn MySQL local
1. Tạo database `wm_kalla_materials`
2. Sửa file `.env`
3. Chạy:
```bash
cp .env.example .env
npm i
npm run start:dev
```

> Với `DB_SYNCHRONIZE=true` và `AUTO_SEED=true`, app sẽ tự tạo bảng và tự seed dữ liệu demo ở lần chạy đầu.

## Swagger
- URL: `http://localhost:3000/docs`

## API prefix
- Tất cả endpoint nằm dưới: `http://localhost:3000/api`

## Tài khoản demo
- Super Admin: `admin@wmkalla.local` / `Admin@123`
- Company Admin: `company.admin@wmkalla.local` / `Admin@123`
- Procurement: `procurement@wmkalla.local` / `Procurement@123`
- Warehouse: `warehouse@wmkalla.local` / `Warehouse@123`
- Site Manager: `site.manager@wmkalla.local` / `Site@123`
- Site Staff: `site.staff@wmkalla.local` / `Site@123`
- Accountant: `accountant@wmkalla.local` / `Accountant@123`
- Director: `director@wmkalla.local` / `Director@123`

## Endpoint tiêu biểu

### Auth
- `POST /api/auth/login`
- `GET /api/auth/me`

### Access
- `GET /api/access/roles`
- `GET /api/access/permissions`

### Users
- `GET /api/users`
- `POST /api/users`
- `PATCH /api/users/:id/toggle-active`

### Master data
- `GET|POST /api/masters/units`
- `GET|POST /api/masters/categories`
- `GET|POST /api/masters/materials`
- `GET|POST /api/masters/warehouses`
- `GET|POST /api/masters/projects`
- `GET|POST /api/masters/suppliers`

### Operations
- `GET|POST /api/operations/material-requests`
- `PATCH /api/operations/material-requests/:id/submit`
- `PATCH /api/operations/material-requests/:id/approve`
- `GET|POST /api/operations/purchase-orders`
- `PATCH /api/operations/purchase-orders/:id/approve`
- `GET|POST /api/operations/supplier-invoices`
- `PATCH /api/operations/supplier-invoices/:id/approve`
- `GET|POST /api/operations/stock-documents`
- `PATCH /api/operations/stock-documents/:id/submit`
- `PATCH /api/operations/stock-documents/:id/approve`
- `PATCH /api/operations/stock-documents/:id/post`

### Inventory
- `GET /api/inventory/balances`
- `GET /api/inventory/ledger`
- `GET /api/inventory/low-stock`
- `GET /api/inventory/valuation`

### Reports
- `GET /api/reports/dashboard`
- `GET /api/reports/project-consumption`
- `GET /api/reports/movement-summary`

### Audit
- `GET /api/audit/logs`

## Ví dụ login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@wmkalla.local",
    "password": "Admin@123"
  }'
```

## Ghi chú triển khai thực tế
- Hiện tại project dùng `synchronize=true` để chạy demo nhanh.
- Khi đưa production nên chuyển sang migration.
- Nên thêm refresh token, file storage thật, pagination/filtering, e2e tests, approval nhiều cấp.

## Tài liệu phân tích
- `docs/solution-analysis.md`: phân tích nghiệp vụ, quyền, luồng và roadmap.
- `docs/api-samples.md`: sample payload cho login, request, PO, invoice, receipt, issue.
