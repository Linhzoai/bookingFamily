import { Router } from "express";
import BookingController from "./booking.controller.js";
import validate from "../../middlewares/validate.middleware.js";
import { createBookingValidation, getBookingValidation, getBookingByIdValidation, updateBookingValidation } from "./booking.validation.js";
const router = Router();

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: Quản lý API Đơn đặt lịch dịch vụ
 */

/**
 * @swagger
 * /bookings:
 *   post:
 *     summary: Tạo một đơn đặt lịch mới
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerId
 *               - areaId
 *               - address
 *               - scheduledTime
 *               - serviceId
 *             properties:
 *               customerId:
 *                 type: string
 *                 description: Mã tài khoản yêu cầu
 *               areaId:
 *                 type: integer
 *                 description: Cụm khu vực mã hoá
 *               address:
 *                 type: string
 *                 description: Địa chỉ nhà chi tiết
 *               scheduledTime:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-05-15T08:30:00.000Z
 *                 description: Thời gian mong muốn
 *               discountCodeId:
 *                 type: string
 *                 description: Mã giảm giá
 *               status:
 *                 type: string
 *                 enum: [pending, accepted, in_progress, completed, cancelled]
 *                 default: pending
 *               note:
 *                 type: string
 *                 description: Lời chú thích
 *               serviceId:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Mã các dịch vụ yêu cầu
 *     responses:
 *       201:
 *         description: Tạo đặt lịch thành công
 *       400:
 *         description: Error Validate Input
 */
router.post("/", validate(createBookingValidation), BookingController.createBooking);

/**
 * @swagger
 * /bookings:
 *   get:
 *     summary: Lấy danh sách Bookings (Hỗ trợ Lọc & Phân trang)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: customerId
 *         schema:
 *           type: string
 *       - in: query
 *         name: serviceId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: areaId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: scheduledTime
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: assign
 *         schema:
 *           type: boolean
 *         description: Lọc theo trạng thái phân công (true nếu chưa có ai nhận việc chính thức)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Danh sách bookings được trả về thành công
 */
router.get("/", validate(getBookingValidation, 'query'), BookingController.getBooking);

/**
 * @swagger
 * /bookings/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết một Order Booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dữ liệu Booking thành công
 *       404:
 *         description: Mã Id không tồn tại
 */
router.get("/:id", validate(getBookingByIdValidation), BookingController.getBookingById);

/**
 * @swagger
 * /bookings/{id}:
 *   put:
 *     summary: Cập nhật thông tin cho booking (Tự động thay đổi details)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, accepted, in_progress, completed, cancelled]
 *               address:
 *                 type: string
 *               areaId:
 *                 type: integer
 *               scheduledTime:
 *                 type: string
 *                 format: date-time
 *               serviceId:
 *                 type: array
 *                 items:
 *                   type: integer
 *               note:
 *                 type: string
 *     responses:
 *       200:
 *         description: Update Successfully
 *       400:
 *         description: Logic error (Example trying to cancel a processing order)
 */
router.put("/:id", validate(updateBookingValidation), BookingController.updateBooking);

/**
 * @swagger
 * /bookings/{id}:
 *   delete:
 *     summary: Xóa một Order Booking khỏi hệ thống
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa booking hoàn tất
 *       400:
 *         description: Booking đã được tiếp nhận không thể bị xóa
 */
router.delete("/:id", validate(getBookingByIdValidation, 'params'), BookingController.deleteBooking);


router.get("/:id/progress", validate(getBookingByIdValidation, 'params'), BookingController.getProgressNow);
export default router;