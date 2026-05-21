import express from "express";
import reviewController from "./review.controller.js";
import validateMiddleware from "#middleware/validate.middleware.js";
import { createSchema, updateSchema, deleteSchema, getReviewSchema } from "./review.validation.js";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Quản lý API Đánh giá (Review)
 */

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Tạo một đánh giá mới
 *     tags: [Reviews]
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
 *               - customerId
 *               - staffId
 *               - rating
 *               - review
 *               - type
 *             properties:
 *               bookingId:
 *                 type: string
 *                 description: ID của đơn đặt lịch
 *               customerId:
 *                 type: string
 *                 description: ID của khách hàng
 *               staffId:
 *                 type: string
 *                 description: ID của nhân viên
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Điểm đánh giá (từ 1 đến 5)
 *               review:
 *                 type: string
 *                 description: Nội dung đánh giá
 *               type:
 *                 type: string
 *                 enum: [customer, staff]
 *                 description: Loại đánh giá (từ khách hàng hay nhân viên)
 *     responses:
 *       201:
 *         description: Tạo đánh giá thành công
 *       400:
 *         description: Lỗi dữ liệu đầu vào
 */
router.post("/", validateMiddleware(createSchema, "body"), reviewController.createReview);

/**
 * @swagger
 * /reviews/{id}:
 *   put:
 *     summary: Cập nhật thông tin đánh giá
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của đánh giá cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *               - review
 *               - type
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               review:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [customer, staff]
 *     responses:
 *       200:
 *         description: Cập nhật đánh giá thành công
 *       400:
 *         description: Lỗi dữ liệu
 *       404:
 *         description: Không tìm thấy đánh giá
 */
router.put("/:id",  validateMiddleware(updateSchema, "body"), reviewController.updateReview);

/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     summary: Xóa một đánh giá
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của đánh giá cần xóa
 *     responses:
 *       204:
 *         description: Xóa đánh giá thành công
 *       404:
 *         description: Không tìm thấy đánh giá
 */
router.delete("/:id", validateMiddleware(deleteSchema, "params"), reviewController.deleteReview);

/**
 * @swagger
 * /reviews:
 *   get:
 *     summary: Lấy danh sách đánh giá (Hỗ trợ phân trang và lọc)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: bookingId
 *         schema:
 *           type: string
 *       - in: query
 *         name: customerId
 *         schema:
 *           type: string
 *       - in: query
 *         name: staffId
 *         schema:
 *           type: string
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [customer, staff]
 *       - in: query
 *         name: rating
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
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
 *         description: Lấy danh sách đánh giá thành công
 */
router.get("/", validateMiddleware(getReviewSchema, "query"), reviewController.getReview);


export default router;