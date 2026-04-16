# Cấu trúc dự án Frontend - BookingFamily

Tài liệu này mô tả chi tiết cấu trúc thư mục và công dụng của từng thành phần trong module `frontend` của dự án.

## 📂 Tổng quan cấu trúc thư mục

```text
frontend/
├── public/              # Chứa các tài nguyên tĩnh không qua xử lý (favicon, v.v.)
├── src/                 # Thư mục chứa mã nguồn chính (Source code)
│   ├── assets/          # Tài nguyên tĩnh (Hình ảnh, Icons, Global Styles)
│   ├── components/      # Các thành phần giao diện (UI Components) dùng chung
│   ├── hooks/           # Các React Hook tùy chỉnh (Custom Hooks)
│   ├── libs/            # Cấu hình thư viện bên thứ 3 (Axios, v.v.)
│   ├── pages/           # Các trang (views) chính của ứng dụng
│   ├── routes/          # Cấu hình các luồng điều hướng (Routing)
│   ├── services/        # Logic gọi API backend
│   ├── stores/          # Quản lý trạng thái toàn cục (State Management)
│   ├── types/           # Định nghĩa các kiểu dữ liệu TypeScript (Interfaces/Types)
│   ├── utils/           # Các hàm tiện ích (Helper functions)
│   ├── App.tsx          # Component gốc của ứng dụng
│   └── main.tsx         # Điểm khởi đầu (Entry point) của ứng dụng
├── .env                 # File cấu hình biến môi trường
├── package.json         # Danh sách dependencies và các scripts của dự án
├── tsconfig.json        # Cấu hình TypeScript
└── vite.config.ts       # Cấu hình công cụ đóng gói Vite
```

---

## 🛠️ Chi tiết công dụng các thư mục trong `src/`

### 🎨 1. `assets/`
Dùng để chứa các file ảnh (png, jpg, svg), fonts, hoặc các file scss dùng chung toàn dự án (như biến màu sắc, căn chỉnh cơ bản).

### 🧩 2. `components/`
Chứa các thành phần UI có khả năng tái sử dụng nhiều lần. 
- *Ví dụ:* `Button/`, `Header/`, `Navbar/`, `ProtectedRouter/`.
- Mỗi component thường được đặt trong thư mục riêng kèm với file style riêng (`.module.scss`) để tránh xung đột CSS.

### 🪝 3. `hooks/`
Nơi định nghĩa các React Hook tùy chỉnh để tách biệt logic xử lý khỏi giao diện, giúp code gọn gàng và dễ bảo trì hơn.

### 📚 4. `libs/`
Chứa mã nguồn cấu hình các thư viện bên thứ 3. 
- *Ví dụ:* Cấu hình `axios` với các interceptors để tự động đính kèm Token khi gọi API.

### 📄 5. `pages/`
Chứa logic của từng trang cụ thể trong ứng dụng.
- *Ví dụ:* `Dashboard`, `Auth` (Login/Register).
- Một **Page** thường là sự tập hợp của nhiều **Components** khác nhau.

### 🗺️ 6. `routes/`
Định nghĩa danh sách các đường dẫn (URLs) và quy định trang nào sẽ được hiển thị khi người dùng truy cập vào đường dẫn đó.

### 🌐 7. `services/`
Tập trung toàn bộ logic tương tác với API backend. 
- *Ví dụ:* `authService.ts` chứa các hàm `login`, `register`, `logout`. Cách tiếp cận này giúp bạn dễ dàng quản lý việc sửa đổi API ở một nơi duy nhất.

### 📦 8. `stores/`
Quản lý trạng thái (state) toàn cục của ứng dụng (dùng Redux hoặc Zustand). Ví dụ: Thông tin người dùng đang đăng nhập cần được sử dụng ở nhiều nơi.

### 🏷️ 9. `types/`
Chứa các khai báo kiểu dữ liệu TypeScript. Nó giúp code có gợi ý tốt hơn và tránh các lỗi sai kiểu dữ liệu trong quá trình phát triển.

### 🔧 10. `utils/`
Chứa các hàm xử lý dữ liệu nhỏ lẻ dùng chung.
- *Ví dụ:* Hàm format tiền tệ (VND), hàm định dạng ngày tháng, hàm kiểm tra độ mạnh của mật khẩu.

---

## 🚀 Các tệp tin quan trọng khác
- **`App.tsx`**: Nơi khởi tạo các Providers (Redux, Router, Theme) và bao bọc toàn bộ ứng dụng.
- **`main.tsx`**: Thực hiện render ứng dụng React vào DOM của HTML.
- **`vite.config.ts`**: Nơi bạn có thể cấu hình các alias thư mục (ví dụ dùng `@` thay cho `../src`) hoặc cài đặt proxy.
- **`.env`**: Lưu trữ các thông tin nhạy cảm hoặc thay đổi theo môi trường (như `VITE_API_URL`).
