# Tài liệu Tích hợp Socket.IO (Dành cho Frontend Team)

Tài liệu này tổng hợp toàn bộ các sự kiện (events) từ Socket Server mà team Frontend cần đăng ký lắng nghe (`socket.on`) để xử lý UI, trạng thái real-time và hiển thị thông báo (Notification/Toast).

> [!IMPORTANT]
> Để nhận được các sự kiện cá nhân (Bắn riêng cho từng User/Staff), Frontend cần đảm bảo khi kết nối Socket, user đã được map đúng với ID của họ trên Server (thường được xử lý lúc login/connect).

---

## 1. Nhóm trạng thái hoạt động (Global)

| Tên sự kiện (Event Name) | Payload nhận được | Ý nghĩa & Hành động FE cần làm | Đối tượng nhận |
| :--- | :--- | :--- | :--- |
| **`online-users`** | `string[]` <br>*(Mảng các userId đang online)* | Server bắn ra mỗi khi có người connect/disconnect. FE lưu vào Store để hiển thị trạng thái "đang online" (chấm xanh) của nhân viên hoặc khách hàng. | Tất cả mọi người |

---

## 2. Nhóm điều phối và Phân công công việc (Assignment)

| Tên sự kiện (Event Name) | Payload nhận được | Ý nghĩa & Hành động FE cần làm | Đối tượng nhận |
| :--- | :--- | :--- | :--- |
| **`new_booking_request`** | `Object` (Thông tin đơn đặt lịch mới) | Hệ thống vừa tự động điều phối (dispatch) một đơn mới. FE hiển thị popup hoặc chuông thông báo cho nhân viên nhận việc. | Chỉ Nhân viên (Staff) |
| **`new-assignment-job`** | `Object` (Thông tin bản ghi phân công) | Quản trị viên/Hệ thống vừa phân công việc. FE (Staff) hiển thị việc mới. FE (Customer) hiển thị thông báo "Đã có nhân viên nhận đơn của bạn". | Nhân viên & Khách hàng |
| **`update-assignment-job`** | `Object` (Trạng thái phân công mới: accepted, rejected...) | Trạng thái công việc thay đổi. FE cần cập nhật lại màu sắc/trạng thái của thẻ công việc mà không cần reload trang. | Nhân viên & Khách hàng |

---

## 3. Nhóm thực hiện công việc (Tiến độ)

| Tên sự kiện (Event Name) | Payload nhận được | Ý nghĩa & Hành động FE cần làm | Đối tượng nhận |
| :--- | :--- | :--- | :--- |
| **`update-progress`** | `Object` (Thông tin bước vừa hoàn thành, hình ảnh minh chứng...) | Nhân viên vừa bấm hoàn thành 1 bước công việc. FE của Khách hàng hiển thị thông báo hoặc thay đổi thanh tiến độ (Progress bar). | Nhân viên & Khách hàng |

---

## 4. Nhóm Thanh toán (Payment)

| Tên sự kiện (Event Name) | Payload nhận được | Ý nghĩa & Hành động FE cần làm | Đối tượng nhận |
| :--- | :--- | :--- | :--- |
| **`payment-success`** | `Object` (Thông tin đơn và trạng thái thành công) | Khách hàng vừa thanh toán VNPAY thành công (nhận qua Webhook). FE hiển thị màn hình chúc mừng / Toast success và cập nhật trạng thái đơn. | Chỉ Khách hàng |
| **`payment-failed`** | `Object` (Lý do thất bại) | Giao dịch VNPAY bị lỗi hoặc khách hàng huỷ thanh toán. FE hiển thị popup lỗi và hướng dẫn thanh toán lại. | Chỉ Khách hàng |

---

### Mẫu code tham khảo cho Frontend

```typescript
import { useEffect } from 'react';
import { socket } from './socketInstance'; 

// Trong Component hoặc Custom Hook (ví dụ ở cấp độ Layout/App)
useEffect(() => {
  // 1. Nhóm phân công
  socket.on('new-assignment-job', (data) => {
    toast.info("Có công việc / Cập nhật mới!");
    // dispatch update store...
  });

  // 2. Nhóm thanh toán
  socket.on('payment-success', (data) => {
    toast.success("Thanh toán thành công!");
    // redirect đến trang chi tiết / cảm ơn...
  });

  socket.on('payment-failed', (error) => {
    toast.error("Thanh toán thất bại, vui lòng thử lại.");
  });

  return () => {
    // Cleanup để tránh bị duplicate event listener
    socket.off('new-assignment-job');
    socket.off('payment-success');
    socket.off('payment-failed');
  };
}, []);
```
