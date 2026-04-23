# Construction Materials Frontend

Frontend Next.js + Tailwind CSS cho hệ thống quản lý vật tư công trường, được thiết kế bám sát backend NestJS + MySQL đã dựng trước đó.

## Mục tiêu giao diện
- Dùng cho **1 công ty** trước, không có company selector ở UI.
- Hỗ trợ **nhiều kho**, **nhiều công trình**, **nhiều role**.
- Bám theo cấu trúc phần mềm doanh nghiệp lớn: dashboard, master data, nghiệp vụ, tồn kho, báo cáo, audit, RBAC.
- Màu sắc và bố cục lấy cảm hứng từ mẫu giao diện bạn gửi: sidebar tối, header sáng, nhấn teal/cyan.
- Kiến trúc đủ sạch để sau này có thể mở rộng sang multi-company hoặc domain inventory khác.

## Công nghệ
- Next.js App Router
- React
- Tailwind CSS (PostCSS plugin)
- Không dùng thư viện UI nặng, toàn bộ component nền tảng được tự viết để dễ chỉnh sửa về sau

## Tính năng đã có
- Login screen đẹp, có tài khoản demo seed sẵn
- App shell doanh nghiệp: sidebar, topbar, dashboard, thẻ metric, bảng dữ liệu, drawer/modal
- RBAC ở giao diện dựa trên permission backend trả về
- Master data:
  - Units
  - Categories
  - Materials
  - Warehouses
  - Projects
  - Suppliers
- Operations:
  - Material Requests
  - Purchase Orders
  - Supplier Invoices
  - Stock Documents
- Inventory:
  - Balances
  - Ledger
  - Low stock
  - Valuation
- Access control:
  - Users
  - Roles
  - Permissions
- Reports:
  - Project consumption
  - Movement summary
- Audit logs

## Cấu hình
Tạo `.env` từ `.env.example`:

```bash
cp .env.example .env
```

Nội dung mặc định:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_APP_NAME=WM Kalla Materials
NEXT_PUBLIC_COMPANY_NAME=WM Kalla Construction
```

## Chạy local
```bash
npm i
npm run dev
```

Mặc định frontend chạy tại:
- `http://localhost:3000` nếu chạy độc lập

Nếu backend cũng đang chạy ở `http://localhost:3000`, bạn có thể:
- đổi backend sang port khác, hoặc
- đổi frontend dev port như sau:

```bash
npm run dev -- --port 3001
```

## Kết nối với backend đã dựng trước
Backend prefix hiện tại:
- `http://localhost:3000/api`

Nếu bạn chạy frontend ở `3001`, cấu hình rất phù hợp là:
- Backend: `3000`
- Frontend: `3001`

## Tài khoản demo
- `admin@wmkalla.local` / `Admin@123`
- `warehouse@wmkalla.local` / `Warehouse@123`
- `site.manager@wmkalla.local` / `Site@123`
- `accountant@wmkalla.local` / `Accountant@123`

## Ghi chú kiến trúc
- UI hiện tại cố ý **single-company first** để tránh rối cho người dùng nội bộ.
- Tuy vậy cấu trúc module, navigation, auth context, document pages và reference loaders vẫn đủ tốt để mở rộng.
- Các page nghiệp vụ đã bám theo endpoint thật của backend, không mock.
- Nếu sau này cần sản phẩm cấp cao hơn, nên làm tiếp:
  - pagination / filters server-side
  - global search thật
  - upload file chứng từ
  - dark mode / theme manager
  - charts chuyên sâu bằng thư viện charting
  - form validation nâng cao
  - test e2e và component test

## Cấu trúc thư mục
- `app/`: routes App Router
- `components/`: UI, shell, generic pages, charts
- `lib/`: api client, constants, helpers, reference loaders

