import { Router } from "express";
import assignmentController from "./assignment.controller.js";
import validateMiddleware from "../../middlewares/validate.middleware.js";
import { createProgressValidation, updateProgressValidation, paramsIdValidation } from "./assignment.validation.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Assignments
 *   description: Quản lý việc phân công nhân viên (Staff Assignments)
 */

/**
 * @swagger
 * /assignments:
 *   post:
 *     summary: Giao việc mới cho nhân viên
 *     tags: [Assignments]
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
 *               - staffId
 *               - status
 *             properties:
 *               bookingId:
 *                 type: string
 *                 description: ID của đơn đặt lịch
 *               staffId:
 *                 type: string
 *                 description: ID của nhân viên được giao việc
 *               status:
 *                 type: string
 *                 enum: [accepted, rejected, assigned, completed]
 *                 default: assigned
 *               assignedAt:
 *                 type: string
 *                 format: date-time
 *                 description: Thời gian giao việc
 *     responses:
 *       201:
 *         description: Giao việc thành công
 *       400:
 *         description: Dữ liệu gửi lên không đúng định dạng
 */
router.post('/', validateMiddleware(createProgressValidation), assignmentController.createAssignJob)

/**
 * @swagger
 * /assignments/{id}:
 *   put:
 *     summary: Cập nhật thông tin phân công
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của bản ghi phân công
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookingId:
 *                 type: string
 *               staffId:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [accepted, rejected, assigned, completed]
 *               assignedAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy bản ghi phân công
 */
router.put('/:id', validateMiddleware(updateProgressValidation), assignmentController.updateAssignJob)

/**
 * @swagger
 * /assignments/{id}:
 *   delete:
 *     summary: Xóa một bản ghi phân công
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID bản ghi phân công cần xóa
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       404:
 *         description: Không tìm thấy bản ghi
 */
router.delete('/:id', validateMiddleware(paramsIdValidation, "params"), assignmentController.deleteAssignJob)

export default router;