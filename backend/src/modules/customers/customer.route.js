import { Router } from "express";
import validate from "../../middlewares/validate.middleware.js";
import { paramsValidation, queryValidation } from "./customer.validation.js";
import CustomerController from "./customer.controller.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: Quản lý thông tin khách hàng
 */

/**
 * @swagger
 * /customers:
 *   get:
 *     summary: Lấy danh sách khách hàng (Hỗ trợ lọc và phân trang)
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Tìm theo tên khách hàng
 *       - in: query
 *         name: phone
 *         schema:
 *           type: string
 *         description: Tìm theo số điện thoại
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Tìm theo email
 *       - in: query
 *         name: areaId
 *         schema:
 *           type: integer
 *         description: Lọc theo khu vực
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Lọc theo trạng thái
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
 *     responses:
 *       200:
 *         description: Thành công
 *       401:
 *         description: Không có quyền truy cập
 */
router.get("/", validate(queryValidation, "query"), CustomerController.getCustomers);

/**
 * @swagger
 * /customers/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết một khách hàng
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã định danh của khách hàng (UUID)
 *     responses:
 *       200:
 *         description: Thành công
 *       404:
 *         description: Khách hàng không tồn tại
 */
router.get("/:id", validate(paramsValidation, "params"), CustomerController.getCustomerById);

export default router;