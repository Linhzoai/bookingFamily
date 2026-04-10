import express from 'express';
import AreaController from './area.controller.js';
import validateMiddleware from '../../middlewares/validate.middleware.js';
import { createAreaSchema, updateAreaSchema, getAreasSchema } from './area.validation.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Areas
 *   description: Quản lý Khu vực (Tỉnh/Thành phố, Quận/Huyện)
 */
/**
 * @swagger
 * /areas:
 *   get:
 *     summary: Lấy danh sách khu vực (Tìm kiếm & Phân trang)
 *     tags: [Areas]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema: {type: string}
 *         description: Lọc theo tên khu vực
 *       - in: query
 *         name: parentId
 *         schema: {type: number}
 *         description: Lọc theo khu vực cha
 *       - in: query
 *         name: isActive
 *         schema: {type: boolean}
 *       - in: query
 *         name: page
 *         schema: {type: number, default: 1}
 *       - in: query
 *         name: limit
 *         schema: {type: number, default: 10}
 *       - in: query
 *         name: orderBy
 *         schema: {type: string, default: "createdAt"}
 *       - in: query
 *         name: order
 *         schema: {type: string, enum: [asc, desc], default: "desc"}
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/',validateMiddleware(getAreasSchema, 'query'), AreaController.getAreas);

/**
 * @swagger
 * /areas/{id}/get:
 *   get:
 *     summary: Lấy chi tiết một khu vực
 *     tags: [Areas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID khu vực
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/:id/get', AreaController.getAreaById);

router.use(authMiddleware);

/**
 * @swagger
 * /areas/create:
 *   post:
 *     summary: Tạo khu vực mới
 *     tags: [Areas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Hà Nội"
 *               parentId:
 *                 type: number
 *                 example: null
 *                 description: "ID của khu vực cha (ví dụ ID Tỉnh), null nếu là cấp cao nhất"
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Tạo khu vực thành công
 */
router.post('/create',validateMiddleware(createAreaSchema), AreaController.createArea);

/**
 * @swagger
 * /areas/{id}/update:
 *   put:
 *     summary: Cập nhật khu vực
 *     tags: [Areas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID khu vực
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Quận Cầu Giấy"
 *               parentId:
 *                 type: number
 *                 example: 1
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.put('/:id/update',validateMiddleware(updateAreaSchema), AreaController.updateArea);

/**
 * @swagger
 * /areas/{id}/delete:
 *   delete:
 *     summary: Xóa khu vực
 *     tags: [Areas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID khu vực
 *     responses:
 *       200:
 *         description: Xóa thành công
 */
router.delete('/:id/delete', AreaController.deleteArea);



export default router;