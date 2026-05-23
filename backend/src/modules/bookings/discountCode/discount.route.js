import express from "express";
import validateMiddleware from "#middleware/validate.middleware.js";
import { createSchema, updateSchema,getAllSchema } from "./discout.validation.js";
import discountController from "./discount.controller.js";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Discounts
 *   description: Quản lý API Mã giảm giá (DiscountCode)
 */

/**
 * @swagger
 * /discounts:
 *   post:
 *     summary: Tạo một mã giảm giá mới
 *     tags: [Discounts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - discountType
 *               - discountValue
 *               - startDate
 *             properties:
 *               code:
 *                 type: string
 *                 description: "Mã giảm giá (VD: SUMMER2026)"
 *               description:
 *                 type: string
 *                 description: Mô tả chi tiết mã giảm giá
 *               discountType:
 *                 type: string
 *                 enum: [percentage, fixed]
 *                 description: Loại giảm giá (phần trăm hoặc cố định)
 *               discountValue:
 *                 type: number
 *                 description: Giá trị giảm (số tiền hoặc phần trăm)
 *               minOrderAmount:
 *                 type: number
 *                 description: Giá trị đơn hàng tối thiểu để áp dụng
 *               maxDiscountAmount:
 *                 type: number
 *                 description: Số tiền giảm tối đa (dùng cho loại percentage)
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 description: Thời gian bắt đầu có hiệu lực
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 description: Thời gian hết hạn
 *               usageLimit:
 *                 type: integer
 *                 description: Giới hạn số lần sử dụng của mã
 *               usedCount:
 *                 type: integer
 *                 description: Số lần đã sử dụng (thường khởi tạo bằng 0)
 *               isActive:
 *                 type: boolean
 *                 description: Trạng thái kích hoạt mã
 *     responses:
 *       201:
 *         description: Tạo mã giảm giá thành công
 *       400:
 *         description: Lỗi dữ liệu đầu vào hoặc mã đã tồn tại
 */
router.post("/", validateMiddleware(createSchema, "body"), discountController.createDiscount);

/**
 * @swagger
 * /discounts/{id}:
 *   put:
 *     summary: Cập nhật thông tin mã giảm giá
 *     tags: [Discounts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của mã giảm giá
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *               description:
 *                 type: string
 *               discountType:
 *                 type: string
 *                 enum: [percentage, fixed]
 *               discountValue:
 *                 type: number
 *               minOrderAmount:
 *                 type: number
 *               maxDiscountAmount:
 *                 type: number
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               usageLimit:
 *                 type: integer
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       400:
 *         description: Lỗi dữ liệu đầu vào
 *       404:
 *         description: Mã giảm giá không tồn tại
 */
router.put("/:id", validateMiddleware(updateSchema, "body"), discountController.updateDiscount);

/**
 * @swagger
 * /discounts:
 *   get:
 *     summary: Lấy danh sách mã giảm giá (Hỗ trợ phân trang và lọc)
 *     tags: [Discounts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         description: Tìm kiếm theo mã (code)
 *       - in: query
 *         name: discountType
 *         schema:
 *           type: string
 *           enum: [percentage, fixed]
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *           default: createdAt
 *       - in: query
 *         name: orderDirection
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 */
router.get("/", validateMiddleware(getAllSchema, "query"), discountController.getAllDiscount);

/**
 * @swagger
 * /discounts/{id}:
 *   delete:
 *     summary: Xóa một mã giảm giá
 *     tags: [Discounts]
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
 *         description: Xóa thành công
 *       404:
 *         description: Mã giảm giá không tồn tại
 */
router.delete("/:id", discountController.deleteDiscount);
export default router;