import express from "express";
import validateMiddleware from "../../../middlewares/validate.middleware.js";
import { createCategorySchema, updateCategorySchema, getCategoriesSchema } from "./category.validation.js";
import CategoryController from "./category.controller.js";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Quản lý Danh mục dịch vụ
 */

/**
 * @swagger
 * /categories/create:
 *   post:
 *     summary: Tạo danh mục mới
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, description]
 *             properties:
 *               name: {type: string, example: "Chăm sóc thú cưng"}
 *               description: {type: string, example: "Dịch vụ tắm rửa, tỉa lông thú cưng tại nhà"}
 *     responses:
 *       201:
 *         description: Tạo danh mục thành công
 */
router.post('/create',validateMiddleware(createCategorySchema), CategoryController.createCategory);

/**
 * @swagger
 * /categories/{id}/update:
 *   put:
 *     summary: Cập nhật danh mục
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID danh mục
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: {type: string, example: "Vệ sinh công nghiệp"}
 *               description: {type: string, example: "Dịch vụ vệ sinh công nghiệp cho văn phòng"}
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.put('/:id/update',validateMiddleware(updateCategorySchema), CategoryController.updateCategory);

/**
 * @swagger
 * /categories/{id}/delete:
 *   delete:
 *     summary: Xóa danh mục
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID danh mục
 *     responses:
 *       200:
 *         description: Xóa thành công
 */
router.delete('/:id/delete', CategoryController.deleteCategory);

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Lấy danh sách danh mục (có phân trang & lọc)
 *     tags: [Categories]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema: {type: string}
 *         description: Lọc theo tên danh mục
 *       - in: query
 *         name: description
 *         schema: {type: string}
 *         description: Lọc theo mô tả
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
router.get('/',validateMiddleware(getCategoriesSchema, 'query'), CategoryController.getCategories);

/**
 * @swagger
 * /categories/{id}/get:
 *   get:
 *     summary: Lấy chi tiết một danh mục
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID danh mục
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/:id/get', CategoryController.getCategoryById);

export default router;