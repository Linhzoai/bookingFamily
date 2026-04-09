import express from "express";
import progressController from "./progress.controller.js";
import validateMiddleware from "../../middlewares/validate.middleware.js";
import {
  createProgressSchema,
  getProgressSchema,
} from "./progress.validation.js";
import { uploadImageStorage } from "../../middlewares/upload.middleware.js";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Progress
 *   description: Quản lý tiến độ công việc của nhân viên
 */

/**
 * @swagger
 * /progress:
 *   post:
 *     summary: Cập nhật tiến độ tiếp theo cho đơn hàng (Tự động tính bước tiếp theo)
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - bookingId
 *               - staffId
 *               - recordAt
 *             properties:
 *               bookingId:
 *                 type: string
 *                 description: ID của đơn đặt lịch
 *               staffId:
 *                 type: string
 *                 description: ID của nhân viên cập nhật
 *               note:
 *                 type: string
 *                 description: Ghi chú hoặc báo cáo công việc
 *               recordAt:
 *                 type: string
 *                 format: date-time
 *                 description: Thời gian ghi nhận
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Hình ảnh bằng chứng (ảnh hiện trường, ảnh hoàn thành...)
 *     responses:
 *       201:
 *         description: Cập nhật tiến độ thành công
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc công việc đã hoàn thành
 */
router.post(
  "/",
  validateMiddleware(createProgressSchema),
  uploadImageStorage("progress").single("image"),
  progressController.createProgress,
);

/**
 * @swagger
 * /progress:
 *   get:
 *     summary: Lấy danh sách tiến độ công việc
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: stepName
 *         schema:
 *           type: string
 *         description: Trạng thái tiến độ (is_coming, arrived, is_working, completed)
 *       - in: query
 *         name: bookingId
 *         schema:
 *           type: string
 *         description: ID của đơn đặt lịch
 *       - in: query
 *         name: staffId
 *         schema:
 *           type: string
 *         description: ID của nhân viên
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Số trang
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Số lượng bản ghi mỗi trang
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *           default: createdAt
 *         description: Trường sắp xếp
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Thứ tự sắp xếp
 *     responses:
 *       200:
 *         description: Lấy danh sách tiến độ thành công
 */
router.get(
  "/",
  validateMiddleware(getProgressSchema),
  progressController.getAllProgress,
);
export default router;
