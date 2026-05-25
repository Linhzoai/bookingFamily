import express from "express";
import RequestController from "#modules/staff/requestLeave/request.controller.js";
import validateMiddleware from "#middleware/validate.middleware.js";
import { createValidation, updateValidation, deleteValidation, getValidation } from "./request.validation.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Request Leave
 *   description: Quản lý đơn xin nghỉ phép của nhân viên
 */

/**
 * @swagger
 * /request-leave:
 *   post:
 *     summary: Tạo đơn xin nghỉ phép mới
 *     tags: [Request Leave]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - staffId
 *               - startTime
 *               - endTime
 *             properties:
 *               staffId:
 *                 type: string
 *                 description: ID của nhân viên
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 description: Thời gian bắt đầu nghỉ
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 description: Thời gian kết thúc nghỉ
 *               reason:
 *                 type: string
 *                 description: Lý do nghỉ phép
 *               status:
 *                 type: string
 *                 enum: [pending, approved, rejected]
 *                 default: pending
 *                 description: Trạng thái đơn (mặc định pending)
 *     responses:
 *       201:
 *         description: Tạo đơn xin nghỉ phép thành công
 *       400:
 *         description: Lỗi dữ liệu đầu vào
 */
router.post("/", validateMiddleware(createValidation), RequestController.createRequest);

/**
 * @swagger
 * /request-leave/{id}:
 *   put:
 *     summary: Cập nhật đơn xin nghỉ phép
 *     tags: [Request Leave]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của đơn xin nghỉ phép
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 description: Thời gian bắt đầu nghỉ
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 description: Thời gian kết thúc nghỉ
 *               reason:
 *                 type: string
 *                 description: Lý do nghỉ phép
 *               status:
 *                 type: string
 *                 enum: [pending, approved, rejected]
 *                 description: Trạng thái đơn
 *     responses:
 *       200:
 *         description: Cập nhật đơn thành công
 *       400:
 *         description: Lỗi dữ liệu đầu vào
 *       404:
 *         description: Không tìm thấy đơn xin nghỉ phép
 */
router.put("/:id", validateMiddleware(updateValidation), RequestController.updateRequest);

/**
 * @swagger
 * /request-leave/{id}:
 *   delete:
 *     summary: Xóa đơn xin nghỉ phép
 *     tags: [Request Leave]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của đơn xin nghỉ phép
 *     responses:
 *       200:
 *         description: Xóa đơn thành công
 *       400:
 *         description: Lỗi dữ liệu đầu vào
 *       404:
 *         description: Không tìm thấy đơn xin nghỉ phép
 */
router.delete("/:id", validateMiddleware(deleteValidation, "params"), RequestController.deleteRequest);

/**
 * @swagger
 * /request-leave:
 *   get:
 *     summary: Lấy danh sách đơn xin nghỉ phép
 *     tags: [Request Leave]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: staffId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của nhân viên
 *       - in: query
 *         name: startTime
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Lọc theo thời gian bắt đầu
 *       - in: query
 *         name: endTime
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Lọc theo thời gian kết thúc
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected]
 *         description: Lọc theo trạng thái đơn
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Trang hiện tại
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Số lượng kết quả trên mỗi trang
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Tìm kiếm
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Trường cần sắp xếp
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Chiều sắp xếp (tăng/giảm dần)
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 */
router.get("/", validateMiddleware(getValidation, "query"), RequestController.getAllRequests);

export default router;