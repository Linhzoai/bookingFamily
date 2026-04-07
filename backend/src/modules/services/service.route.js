import express from 'express';
import validateMiddleware from '../../middlewares/validate.middleware.js';
import { createServiceSchema, updateServiceSchema, getServicesSchema } from './service.validation.js';
import ServiceController from './service.controller.js';
import {uploadImageStorage} from '../../middlewares/upload.middleware.js';
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Services
 *   description: Quản lý Dịch vụ
 */

/**
 * @swagger
 * /services/create:
 *   post:
 *     summary: Tạo dịch vụ mới
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [name, description, price, duration, categoryId]
 *             properties:
 *               name: {type: string, example: "Dọn dẹp nhà cửa chuyên sâu"}
 *               description: {type: string, example: "Gói dịch vụ dọn dẹp tổng thể nhà cửa bao gồm phòng khách, phòng ngủ, nhà bếp..."}
 *               price: {type: number, example: 350000}
 *               duration: {type: number, example: 180, description: "Thời lượng tính bằng phút"}
 *               categoryId: {type: number, example: 1, description: "ID của danh mục dịch vụ"}
 *               image: {type: string, format: binary, description: "Ảnh minh họa dịch vụ"}
 *               active: {type: boolean, example: true}
 *     responses:
 *       201:
 *         description: Tạo dịch vụ thành công
 */
router.post('/create', uploadImageStorage('services').single('image'), validateMiddleware(createServiceSchema), ServiceController.createService);

/**
 * @swagger
 * /services/{id}/update:
 *   put:
 *     summary: Cập nhật dịch vụ
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID dịch vụ
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name: {type: string, example: "Giặt ủi quần áo cao cấp"}
 *               description: {type: string, example: "Dịch vụ giặt sấy quần áo tận nhà"}
 *               price: {type: number, example: 150000}
 *               duration: {type: number, example: 90}
 *               categoryId: {type: number, example: 1}
 *               image: {type: string, format: binary, description: "Ảnh minh họa dịch vụ"}
 *               active: {type: boolean, example: true}
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.put('/:id/update',uploadImageStorage('services').single('image'),validateMiddleware(updateServiceSchema), ServiceController.updateService);

/**
 * @swagger
 * /services/{id}/delete:
 *   delete:
 *     summary: Xóa dịch vụ
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID dịch vụ
 *     responses:
 *       200:
 *         description: Xóa thành công
 */
router.delete('/:id/delete', ServiceController.deleteService);

/**
 * @swagger
 * /services:
 *   get:
 *     summary: Lấy danh sách dịch vụ (Tìm kiếm & Phân trang)
 *     tags: [Services]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema: {type: string}
 *         description: Lọc theo tên dịch vụ
 *       - in: query
 *         name: description
 *         schema: {type: string}
 *       - in: query
 *         name: price
 *         schema: {type: number}
 *         description: Lọc giá lớn hơn hoặc bằng
 *       - in: query
 *         name: duration
 *         schema: {type: number}
 *       - in: query
 *         name: categoryId
 *         schema: {type: number}
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
router.get('/', validateMiddleware(getServicesSchema, 'query'), ServiceController.getServices);

/**
 * @swagger
 * /services/{id}/get:
 *   get:
 *     summary: Lấy chi tiết một dịch vụ
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID dịch vụ
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/:id/get', ServiceController.getServiceById);

export default router;