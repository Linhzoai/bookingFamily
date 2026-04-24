import express from "express";
import validateMiddleware from "../../middlewares/validate.middleware.js";
import { queryRevenue, queryRevenueByPartner } from "./Report.validation.js";
import ReportController from "./Report.controller.js";

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: API báo cáo thống kê doanh thu
 */
/**
 * @swagger
 * /report/revenue:
 *   get:
 *     summary: Thống kê doanh thu tổng quát (Admin)
 *     tags: [Reports]
 *     parameters:
 *       - in: query
 *         name: groupBy
 *         schema:
 *           type: string
 *           enum: [day, month, year]
 *           default: day
 *         description: Nhóm dữ liệu theo ngày, tháng hoặc năm
 *       - in: query
 *         name: from
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         example: 2026-03-28
 *         description: Ngày bắt đầu (YYYY-MM-DD)
 *       - in: query
 *         name: to
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         example: 2026-04-26
 *         description: Ngày kết thúc (YYYY-MM-DD)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [completed, cancelled, ordered, all]
 *           default: all
 *         description: Trạng thái đơn hàng để thống kê
 *     responses:
 *       200:
 *         description: Lấy dữ liệu thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Lấy dữ liệu thành công
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         example: "24-04-2024"
 *                       totalAmount:
 *                         type: number
 *                         example: 1500000
 *                       totalBooking:
 *                         type: integer
 *                         example: 10
 */
router.get(
  "/revenue",
  validateMiddleware(queryRevenue, "query"),
  ReportController.queryRevenue,
);
/**
 * @swagger
 * /report/revenue-by-partner:
 *   get:
 *     summary: Thống kê doanh thu theo đối tác (Customer hoặc Staff)
 *     tags: [Reports]
 *     parameters:
 *       - in: query
 *         name: groupBy
 *         schema:
 *           type: string
 *           enum: [day, month, year]
 *           default: year
 *         description: Nhóm dữ liệu theo ngày, tháng hoặc năm
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *         description: Ngày bắt đầu (YYYY-MM-DD)
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *         description: Ngày kết thúc (YYYY-MM-DD)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [completed, cancelled, ordered, all]
 *           default: all
 *         description: Trạng thái đơn hàng
 *     responses:
 *       200:
 *         description: Lấy dữ liệu thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         example: "2024"
 *                       totalAmount:
 *                         type: number
 *                         example: 5000000
 *                       totalBooking:
 *                         type: integer
 *                         example: 25
 */
router.get(
  "/revenue-by-partner",
  validateMiddleware(queryRevenueByPartner, "query"),
  ReportController.queryRevenueByPartner,
);

export default router;
