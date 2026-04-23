# Phân tích giải pháp backend quản lý vật tư công trường

## 1) Mục tiêu sản phẩm

Backend này được thiết kế theo hướng:
- **Giải quyết nhu cầu hiện tại** cho 1 công ty quản lý vật tư công trường.
- **Kiến trúc generic** để sau này tái sử dụng cho các mô hình quản lý vật tư khác như nhà máy, kho phân phối, bảo trì thiết bị, thương mại vật tư.
- **Chuẩn enterprise starter**: phân quyền rõ, chứng từ hóa, luồng phê duyệt, sổ kho, tồn kho, hóa đơn, báo cáo và audit log.

## 2) Nguyên tắc thiết kế

1. **Domain first**: lõi xoay quanh Vật tư – Kho – Công trình – Chứng từ – Sổ kho – Báo cáo.
2. **Multi-tenant ready**: dù hiện tại dùng cho 1 công ty, schema đã có `organization_id` để mở rộng nhiều công ty sau này.
3. **Document driven inventory**: mọi nhập/xuất/chuyển/điều chỉnh đều đi qua chứng từ và được ghi vào ledger.
4. **Approval & audit friendly**: chứng từ có trạng thái; hành động quan trọng được log.
5. **Generic enough for reuse**: chuyển công trường thành chi nhánh/site/location là dùng lại được cho ngành khác.

## 3) Nhóm người dùng / quyền đề xuất

### Super Admin
- Toàn quyền hệ thống.
- Quản trị người dùng, role, permission, dữ liệu gốc, phê duyệt, posting, audit.

### Company Admin
- Vận hành hệ thống ở cấp công ty.
- Quản trị gần như toàn bộ nghiệp vụ nhưng không mang tính hạ tầng toàn cục như Super Admin.

### Procurement Manager
- Tập trung vào mua hàng.
- Tạo/duyệt Purchase Order.
- Tạo/duyệt hóa đơn nhà cung cấp.
- Theo dõi nhà cung cấp, giá trị mua, tiến độ cung ứng.

### Warehouse Manager
- Trung tâm vận hành kho.
- Tạo/duyệt/post phiếu nhập, xuất, chuyển kho.
- Theo dõi tồn kho, cảnh báo thiếu, điều chỉnh tồn.

### Site Manager
- Quản lý công trường.
- Tạo/yêu cầu cấp vật tư, theo dõi vật tư theo công trình.
- Theo dõi lượng đã cấp, tiến độ hoàn tất request.

### Site Staff
- Nhân viên hiện trường / thủ kho công trình.
- Tạo request, theo dõi vật tư, xem tồn.
- Thường không có quyền approve/post.

### Accountant
- Theo dõi hóa đơn, đối chiếu phiếu nhập, giá trị hàng tồn, báo cáo tài chính vật tư.

### Executive Viewer
- Chỉ xem báo cáo, dashboard, tồn kho, chứng từ.

## 4) Danh sách chức năng cần có ở một phần mềm “xịn”

### 4.1. Quản trị truy cập
- Đăng nhập JWT.
- Role & Permission theo hành động cụ thể.
- Bật/tắt user.
- Theo dõi lần đăng nhập cuối.
- Mở rộng 2FA / refresh token / SSO ở giai đoạn sau.

### 4.2. Master data
- Đơn vị tính.
- Danh mục vật tư.
- Vật tư (SKU/code, min-max stock, unit, category, thông số kỹ thuật, brand).
- Kho (main/site/transit).
- Công trình.
- Nhà cung cấp.
- Mở rộng sau: định mức vật tư, cost center, asset/equipment, batch/lot, serial.

### 4.3. Nghiệp vụ mua hàng
- Purchase Order.
- Theo dõi expected delivery date.
- Theo dõi receivedQty cho từng dòng.
- Mở rộng sau: quotation comparison, vendor contract, purchase request.

### 4.4. Yêu cầu vật tư từ công trường
- Material Request theo công trình.
- Trạng thái: Draft → Submitted → Approved → Partial/Fulfilled.
- Theo dõi requestedQty, approvedQty, issuedQty.
- Liên kết sang phiếu xuất kho.

### 4.5. Hóa đơn nhà cung cấp
- Lưu invoice number, supplier, PO, due date, payment status.
- Lưu chi tiết dòng hàng và link file đính kèm.
- Mở rộng sau: công nợ, đối soát thanh toán, matching 3 chiều PO–GRN–Invoice.

### 4.6. Chứng từ kho
- **Receipt**: nhập từ nhà cung cấp / hoàn nhập.
- **Issue**: xuất cho công trình / bộ phận.
- **Transfer**: chuyển kho.
- **Adjustment**: điều chỉnh chênh lệch kiểm kê.
- **Return to Supplier**: trả NCC.
- **Return from Site**: hoàn về kho.

### 4.7. Sổ kho / tồn kho
- Ledger chi tiết từng phát sinh.
- Balance theo vật tư + kho.
- Giá trị tồn theo average cost.
- Cảnh báo low stock.
- Mở rộng sau: reservation, batch cost, FIFO, serial tracking.

### 4.8. Báo cáo
- Dashboard tổng quan.
- Giá trị tồn kho.
- Danh sách thiếu hàng.
- Tổng hợp xuất dùng theo công trình.
- Tổng hợp biến động nhập/xuất/chuyển.
- Mở rộng sau: aging inventory, dead stock, ABC analysis, consumption trend.

### 4.9. Audit / compliance
- Log hành động create/submit/approve/post/login.
- Lưu old/new values.
- Có thể mở rộng thêm IP, device, module-based audit, immutable event store.

## 5) Luồng nghiệp vụ chuẩn cho công trường

### Luồng A: Công trường xin vật tư
1. Site Manager tạo **Material Request**.
2. Request được submit.
3. Người có thẩm quyền approve.
4. Warehouse Manager tạo **Issue Document** từ request.
5. Khi post issue document:
   - giảm tồn kho nguồn,
   - ghi ledger,
   - cập nhật `issuedQty` cho request,
   - request chuyển sang `PARTIAL` hoặc `FULFILLED`.

### Luồng B: Mua hàng và nhập kho
1. Procurement tạo **Purchase Order**.
2. Approve PO.
3. Supplier giao hàng.
4. Kế toán / mua hàng tạo **Supplier Invoice**.
5. Kho tạo **Receipt Document**.
6. Khi post receipt:
   - tăng tồn kho,
   - cập nhật average cost,
   - ghi ledger.

### Luồng C: Chuyển kho
1. Kho tạo **Transfer Document**.
2. Approve.
3. Post.
4. Hệ thống tự giảm kho nguồn và tăng kho đích, đồng thời ghi 2 bút toán ledger.

### Luồng D: Kiểm kê / điều chỉnh
1. Kho phát hiện chênh lệch.
2. Tạo **Adjustment Document**.
3. Approve.
4. Post để cộng/trừ tồn kho tương ứng.

## 6) Các trạng thái quan trọng

### Material Request
- DRAFT
- SUBMITTED
- APPROVED
- REJECTED
- PARTIAL
- FULFILLED
- CANCELLED

### Purchase Order
- DRAFT
- SUBMITTED
- APPROVED
- REJECTED
- PARTIALLY_RECEIVED
- RECEIVED
- CANCELLED

### Supplier Invoice
- DRAFT
- SUBMITTED
- APPROVED
- REJECTED
- CANCELLED

### Stock Document
- DRAFT
- PENDING_APPROVAL
- APPROVED
- REJECTED
- POSTED
- CANCELLED

## 7) Những bảng dữ liệu lõi

- organizations
- permissions
- roles
- users
- units
- material_categories
- materials
- warehouses
- projects
- suppliers
- material_requests
- material_request_items
- purchase_orders
- purchase_order_items
- supplier_invoices
- supplier_invoice_items
- stock_documents
- stock_document_items
- stock_ledger
- inventory_balances
- attachments
- audit_logs

## 8) Vì sao mô hình này dễ mở rộng

- Có `organization_id` cho multi-tenant tương lai.
- Chứng từ kho được chuẩn hóa theo `type` thay vì tách logic rời rạc.
- Ledger là nguồn sự thật cho báo cáo biến động.
- Inventory balance là snapshot tối ưu hiệu năng cho UI/report.
- Request, PO, Invoice, Stock Document có thể nối thành chuỗi đầy đủ của supply chain.

## 9) Những tính năng đã có trong starter này

- Auth JWT.
- RBAC role/permission.
- CRUD cơ bản cho master data.
- Material Request create/list/detail/submit/approve.
- Purchase Order create/list/detail/approve.
- Supplier Invoice create/list/detail/approve.
- Stock Document create/list/detail/submit/approve/post.
- Inventory balance / ledger / low stock / valuation.
- Dashboard & project consumption report.
- Audit log cơ bản.
- Seed demo data tự động.

## 10) Những phần nên làm tiếp để đạt cấp “SaaS/ERP mạnh”

1. Refresh token + logout + session revoke.
2. File upload thật (S3/Cloudinary/MinIO) cho hóa đơn/chứng từ.
3. Pagination/filter/sort chuẩn trên mọi endpoint.
4. Soft delete + business validation mạnh hơn.
5. Approval workflow nhiều cấp.
6. Reservation / allocation theo request.
7. Tính giá xuất kho FIFO / moving average nâng cao.
8. Stock count / cycle count chuyên biệt.
9. Notification (email/Zalo/Telegram).
10. OpenAPI contract test + e2e test + migration thay cho synchronize.
11. 3-way matching PO–GRN–Invoice.
12. Multi-branch & inter-company transfer.

## 11) Kết luận

Với nhu cầu hiện tại, bộ backend này đủ tốt để làm nền tảng MVP/prod-internal serious. Nó không chỉ giải bài toán “nhập xuất tồn” cơ bản mà đã có khung của một hệ thống quản lý vật tư hiện đại: chứng từ hóa, phê duyệt, sổ kho, báo cáo, và audit. Đồng thời thiết kế vẫn đủ generic để tái sử dụng cho các ngành quản lý vật tư khác trong tương lai.
