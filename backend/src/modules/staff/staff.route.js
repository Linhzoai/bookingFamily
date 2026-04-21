import express  from "express";
import staffController  from "./staff.controller.js";
import validateMiddleware from "../../middlewares/validate.middleware.js";
import { checkParamSchema,getJobSchema,updateJobSchema, getStaffListSchema,addProfileSchema,updateProfileSchema,updateStatusSchema } from "./staff.validation.js";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Staff
 *   description: Quản lý hồ sơ và thông tin nhân viên
 */

/**
 * @swagger
 * /staff/{id}/add-profile:
 *   post:
 *     summary: Thêm hồ sơ nhân viên
 *     tags: [Staff]
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
 *               cardNumber: {type: string}
 *               skills: {type: string}
 *               experience: {type: string}
 *               review: {type: string}
 *     responses:
 *       201:
 *         description: Tạo hồ sơ thành công
 */
router.post("/:id/add-profile", validateMiddleware(addProfileSchema), staffController.addProfile);

/**
 * @swagger
 * /staff/{id}/profile:
 *   get:
 *     summary: Lấy hồ sơ nhân viên
 *     tags: [Staff]
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
 *         description: Thành công
 */
router.get("/:id/profile", validateMiddleware(checkParamSchema), staffController.getProfile);

/**
 * @swagger
 * /staff/{id}/update-profile:
 *   put:
 *     summary: Cập nhật hồ sơ nhân viên
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cardNumber: {type: string}
 *               skills: {type: string}
 *               experience: {type: string}
 *               review: {type: string}
 *               currentAvailability: {type: string}
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.put("/:id/update-profile", validateMiddleware(updateProfileSchema), staffController.updateProfile);

/**
 * @swagger
 * /staff/{id}/update-status:
 *   patch:
 *     summary: Cập nhật trạng thái nhân viên (StaffProfile status)
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status: {type: string}
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.patch("/:id/update-status", validateMiddleware(updateStatusSchema), staffController.updateStatus);

/**
 * @swagger
 * /staff/{id}/delete-profile:
 *   delete:
 *     summary: Xóa hồ sơ nhân viên
 *     tags: [Staff]
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
 */
router.delete("/:id/delete-profile", validateMiddleware(checkParamSchema), staffController.deleteProfile);

/**
 * @swagger
 * /staff/list:
 *   get:
 *     summary: Lấy danh sách nhân viên kèm hồ sơ
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: {type: number}
 *       - in: query
 *         name: limit
 *         schema: {type: number}
 *       - in: query
 *         name: search
 *         schema: {type: string}
 *       - in: query
 *         name: sort
 *         schema: {type: string}
 *       - in: query
 *         name: order
 *         schema: {type: string}
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get("/list", validateMiddleware(getStaffListSchema, 'query'), staffController.getStaffList);

/**
 * @swagger
 * /staff/{id}/delete-staff:
 *   delete:
 *     summary: Xóa nhân viên hoàn toàn (Xóa User)
 *     tags: [Staff]
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
 */
router.delete("/:id/delete-staff", validateMiddleware(checkParamSchema), staffController.deleteStaff);

/**
 * @swagger
 * /staff/{id}/jobs:
 *   get:
 *     summary: Lấy danh sách công việc của một nhân viên
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của nhân viên (staff id)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [accepted, rejected, assigned, completed]
 *         description: Lọc theo trạng thái công việc
 *       - in: query
 *         name: assignedAt
 *         schema:
 *           type: string
 *           format: date
 *         description: Lọc công việc từ ngày này trở đi
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
 *         description: Tìm kiếm công việc
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [name, createdAt, email, status]
 *           default: createdAt
 *         description: Sắp xếp
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Chiều sắp xếp
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 *       404:
 *         description: Không tìm thấy nhân viên
 */
router.get("/:id/jobs", validateMiddleware(getJobSchema, 'query'), staffController.getJob);

/**
 * @swagger
 * /staff/{id}/update-job:
 *   patch:
 *     summary: Cập nhật trạng thái công việc của nhân viên
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của bản ghi phân công (assign_id)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [accepted, rejected, assigned, completed]
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy bản ghi công việc
 */
router.patch("/:id/update-job", validateMiddleware(updateJobSchema), staffController.updateJob);

export default router;