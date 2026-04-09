---
page: settings_areas
---
A Service Areas Management (Quản lý Khu vực) screen for the Booking Family admin dashboard. This page allows admins to add, edit, and delete service regions.

**DESIGN SYSTEM (REQUIRED):**
- **Platform:** Web, Desktop-first
- **Palette:** Primary: #468faf, Secondary: #89c2d9, Dark: #013a63, Background: #f8fbfd, Card/Surface: #ffffff
- **Typography:** Roboto mono (Heading: 20-24px, Body: 14-16px, Table: 14px)
- **Styles:** Border radius: 12px. Clean tables, minimal heavy borders.

**Page Structure:**
**1. Sidebar:** Same as dashboard. "Cài đặt" is active (background `#468faf`, text white).
**2. Header:** Same as dashboard.

**3. Main Content:**
- Background `#f8fbfd`.
- **Top Actions:** Title "Cài đặt hệ thống". Horizontal Tabs: "Chung (General)", "Cấu hình thanh toán", "Khu vực dịch vụ (Active)", "Thông báo".
- **Section: Khu vực dịch vụ (Service Areas)**
  - Panel Title: "Quản lý Khu vực hoạt động".
  - Button "+ Thêm khu vực mới" on the right side.
- **Form Overlay / Floating Card (Simulating adding/editing a region):**
  - Card Title: "Thêm/Chỉnh sửa Khu vực"
  - Input: "Tên khu vực" (e.g. Quận 1)
  - Input: "Mã khu vực" (e.g. Q1-HCM)
  - Input: "Mô tả chi tiết" (optional)
  - Toggle: "Trạng thái hoạt động" (Active/Inactive)
  - CTA: "Lưu thay đổi" & "Hủy".
- **Areas Table:**
  - Column 1: Mã Khu vực
  - Column 2: Tên Khu vực
  - Column 3: Số lượng nhân sự khả dụng (Staff count)
  - Column 4: Trạng thái (Hoạt động / Tạm ngưng)
  - Column 5: Ngày tạo
  - Column 6: Actions (Chỉnh sửa, Xóa - red).
- Format: Clean layout, side-by-side split (Table on left, Form Card on right) OR Form as a floating element overlapping the table. Maintain Technical Atelier principles.
