import express  from "express";
import staffController  from "./staff.controller.js";
import validateMiddleware from "../../middlewares/validate.middleware.js";
import { requireRole } from "../../middlewares/auth.middleware.js";
import { checkParamSchema, getStaffListSchema,addProfileSchema,updateProfileSchema,updateStatusSchema } from "./staff.validation.js";
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

router.use(requireRole(["admin"]));
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

export default router;