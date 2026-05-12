import express from "express";
import paymentController from "./payment.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import validateMiddleware from "../../middlewares/validate.middleware.js";
import { createPaymentSessionSchema } from "./payment.validation.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Quản lý thanh toán
 */

/**
 * @swagger
 * /payments/create-url:
 *   post:
 *     summary: Tạo URL thanh toán VNPay
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookingId
 *               - method
 *             properties:
 *               bookingId:
 *                 type: string
 *                 description: ID của đơn đặt phòng
 *               method:
 *                 type: string
 *                 enum: [VNPAY, MOMO, CASH]
 *                 description: Phương thức thanh toán
 *               status:
 *                 type: string
 *                 enum: [PENDING, SUCCESS, FAILED, REFUNDED]
 *                 default: PENDING
 *     responses:
 *       200:
 *         description: Tạo URL thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Tạo URL thanh toán VNPay thành công
 *                 data:
 *                   type: object
 *                   properties:
 *                     paymentUrl:
 *                       type: string
 *                       example: https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?...
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc đơn hàng đã thanh toán
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền thanh toán đơn này
 */
router.post( "/create-url", authMiddleware, validateMiddleware(createPaymentSessionSchema), paymentController.createPaymentUrl );

/**
 * @swagger
 * /payments/vnpay-ipn:
 *   get:
 *     summary: Webhook nhận kết quả từ VNPay (IPN)
 *     tags: [Payments]
 *     description: Máy chủ VNPay tự động gọi API này (Server-to-Server) để báo cáo kết quả trừ tiền. KHÔNG dùng cho Frontend.
 *     responses:
 *       200:
 *         description: Trả về mã code theo chuẩn cấu trúc của VNPay
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 RspCode:
 *                   type: string
 *                   example: "00"
 *                 Message:
 *                   type: string
 *                   example: "Confirm Success"
 */
router.get("/vnpay-ipn", paymentController.vnpayIPN);

/**
 * @swagger
 * /payments/vnpay-return:
 *   get:
 *     summary: URL Return chuyển hướng từ VNPay
 *     tags: [Payments]
 *     description: Trình duyệt của khách hàng sẽ được VNPay đẩy về route này sau khi thanh toán xong.
 *     responses:
 *       200:
 *         description: Trả về trạng thái giao dịch để hiển thị giao diện Frontend.
 *       400:
 *         description: Sai chữ ký bảo mật (Invalid Checksum)
 */
router.get("/vnpay-return", paymentController.vnpayReturn);

export default router;