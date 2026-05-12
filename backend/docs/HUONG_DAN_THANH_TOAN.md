# Hướng dẫn Chi tiết: Tích hợp Thanh toán (Tạo đơn, Gửi QR, Kiểm tra trạng thái)

Tài liệu này giải thích chi tiết luồng nghiệp vụ thanh toán (áp dụng chuẩn cho VNPay, MoMo, ZaloPay), từ bước khởi tạo đến bước xác nhận trạng thái cuối cùng.

---

## 1. Quy trình tạo đơn thanh toán và Mã QR (Payment URL)

Khi nói đến "Mã QR thanh toán" của các cổng (VNPay/MoMo), thực chất đó là một **Đường dẫn thanh toán (Payment URL)**. 
- Khi mở đường dẫn này trên trình duyệt PC, màn hình sẽ hiển thị mã QR để khách dùng điện thoại quét.
- Khi mở đường dẫn này trên điện thoại, hệ thống sẽ tự động chuyển hướng (deep-link) mở app ngân hàng hoặc app MoMo.

### Các bước ở Backend (Service):
1. **Nhận Request:** Frontend gửi yêu cầu tạo thanh toán kèm `bookingId` và `method` (VNPay/MoMo).
2. **Kiểm tra DB:** Backend kiểm tra xem `bookingId` có tồn tại và trạng thái hiện tại đã thanh toán hay chưa. Nếu hợp lệ, lấy ra `totalAmount`.
3. **Tạo record Payment:** Thêm 1 dòng vào bảng `Payment` với status là `PENDING`.
4. **Build URL:** Sử dụng `crypto` (có sẵn trong Node.js) cùng với `SECRET_KEY`, `TMN_CODE` (của VNPay) để hash các tham số (số tiền, mã đơn hàng, thời gian tạo) thành một chuỗi URL hợp lệ.
5. **Trả về cho FE:** API trả về chuỗi `paymentUrl` này cho Frontend.

---

## 2. Làm sao gửi mã QR / Link thanh toán cho khách hàng?

Có 2 kịch bản (Scenario) phổ biến tùy thuộc vào luồng nghiệp vụ của ứng dụng:

### Kịch bản A: Khách hàng đang thao tác trực tiếp trên Website (Luồng phổ biến nhất)
*   **Thực hiện:** Khách hàng đang ở trang "Chi tiết Booking" và nhấn nút **"Thanh toán ngay"**.
*   **Xử lý:**
    1.  Frontend gọi API `POST /api/payments/create-url`.
    2.  Nhận được `paymentUrl` từ Backend.
    3.  Frontend lập tức dùng lệnh `window.location.href = paymentUrl;` để chuyển hướng trình duyệt của khách sang thẳng trang của VNPay/MoMo.
    4.  Khách hàng sẽ tự thấy mã QR trên màn hình PC hoặc tự mở app trên điện thoại.

### Kịch bản B: Gửi qua Email/SMS (Luồng thanh toán sau)
*   **Thực hiện:** Khách hàng đặt lịch xong, chọn thanh toán sau. Hệ thống cần nhắc nhở khách thanh toán.
*   **Xử lý:**
    1.  Backend chạy một Job ngầm, gọi hàm tạo `paymentUrl` cho các Booking chưa thanh toán.
    2.  Backend dùng **Nodemailer** hoặc **Resend** (bạn đã cài sẵn trong package.json) để gửi một email cho khách hàng.
    3.  **Trong Email:** Có một nút bấm "Thanh toán ngay" gắn link chính là `paymentUrl`, hoặc nếu bạn muốn đẹp, bạn có thể dùng một thư viện Node.js như `qrcode` để biến `paymentUrl` thành file ảnh mã QR đính kèm vào email.

---

## 3. Cách kiểm tra trạng thái của đơn hàng (IPN / Webhook)

Làm sao Backend biết khách đã quét mã QR và trả tiền thành công để cập nhật Database? Chắc chắn **KHÔNG THỂ** tin tưởng Frontend báo về (vì Frontend dễ bị hack).

Chúng ta dùng **IPN (Instant Payment Notification)**.

### Cơ chế hoạt động của IPN:
1. Lúc tạo `paymentUrl`, bạn truyền cho VNPay/MoMo một tham số tên là `vnp_IpAddr` và cấu hình 1 URL `vnp_IpnUrl` (ví dụ: `https://api.bookingfamily.com/api/payments/vnpay-ipn`).
2. Ngay khi khách quét QR trả tiền thành công trên điện thoại, máy chủ của VNPay sẽ lập tức (trong vòng 1-2 giây) bắn một request `GET` ẩn dưới background gọi trực tiếp vào `vnp_IpnUrl` của bạn.
3. **Backend xử lý API IPN:**
    *   Lấy các tham số VNPay gửi sang (`vnp_ResponseCode`, `vnp_TxnRef`, v.v.).
    *   **BẮT BUỘC:** Tính toán lại chữ ký bảo mật (checksum) để đối chiếu với chữ ký VNPay gửi nhằm xác minh request này đúng là do VNPay gọi.
    *   Nếu chữ ký khớp và `vnp_ResponseCode == '00'` (Thành công):
        *   Cập nhật bảng `Payment`: `status = 'SUCCESS'`, `paidAt = now()`, `transactionId = vnp_TransactionNo`, `gatewayResponse = toàn_bộ_dữ_liệu_vnpay_gửi`.
        *   Cập nhật bảng `Booking`: `paymentStatus = 'PAID'`.
    *   Trả về mã HTTP `200` và chuỗi `{"RspCode":"00","Message":"Confirm Success"}` cho VNPay biết là server mình đã nhận.

### Khách hàng nhận biết thế nào?
1. Trên màn hình thanh toán VNPay, sau khi trả tiền, VNPay sẽ tự redirect khách hàng về **Return URL** của Frontend (ví dụ `http://localhost:5173/payment-result?vnp_ResponseCode=00`).
2. Frontend thấy param `vnp_ResponseCode=00` thì hiện UI: "Thanh toán thành công. Đang cập nhật hệ thống...".
3. Lúc này, Frontend có thể gọi một API `GET /api/bookings/{id}` của Backend để kiểm tra xem `paymentStatus` trong Database đã cập nhật thành `PAID` (nhờ Webhook) chưa. Nếu đã thành `PAID`, cho bay tung tóe pháo hoa 🎉.

---

## 4. Code tham khảo cấu trúc Controller & Service (Tham khảo)

Dưới đây là tư duy logic cho các file bạn vừa tạo:

### `payment.route.js`
```javascript
import express from "express";
import paymentController from "./payment.controller.js";
import { authMiddleware } from "../../middlewares/auth.js";

const router = express.Router();

// 1. Khách hàng bấm nút thanh toán để lấy link (Có bảo mật)
router.post("/create-url", authMiddleware, paymentController.createPaymentUrl);

// 2. VNPay gọi ẩn dưới Server để báo kết quả (KHÔNG CÓ bảo mật auth, vì máy chủ VNPay gọi)
router.get("/vnpay-ipn", paymentController.vnpayIPN);

export default router;
```

### `payment.controller.js`
```javascript
import paymentService from "./payment.service.js";

class PaymentController {
    async createPaymentUrl(req, res, next) {
        try {
            const userId = req.user.id;
            const data = req.body; // chứa bookingId, method
            // Gọi service tạo URL
            const url = await paymentService.buildPaymentUrl(userId, data, req.ip);
            return res.status(200).json({ success: true, paymentUrl: url });
        } catch (error) {
            next(error);
        }
    }

    async vnpayIPN(req, res, next) {
        try {
            const vnpayParams = req.query;
            const result = await paymentService.verifyAndProcessIPN(vnpayParams);
            
            // Bắt buộc phải trả về đúng chuẩn JSON này cho VNPay
            if (result.isSuccess) {
                 return res.status(200).json({ RspCode: '00', Message: 'Confirm Success' });
            } else {
                 return res.status(200).json({ RspCode: '97', Message: 'Fail Checksum' });
            }
        } catch (error) {
            return res.status(200).json({ RspCode: '99', Message: 'Unknown error' });
        }
    }
}
export default new PaymentController();
```
