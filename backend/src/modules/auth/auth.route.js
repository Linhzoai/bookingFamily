import express from "express";
import authController from "./auth.controller.js";
import validateMiddleware from "../../middlewares/validate.middleware.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import {
  uploadAvatar,
  CropAndSave,
} from "../../middlewares/upload.middleware.js";
import {
  signUpSchema,
  signInSchema,
  fetchUserByIdSchema,
  updateStatusSchema,
  updateUserSchema,
} from "./auth.validation.js";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API xác thực người dùng
 */

/**
 * @swagger
 * /auth/sign-up:
 *   post:
 *     summary: Đăng ký tài khoản mới
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [name, email, password, phone, address, areaId, role, gender]
 *             properties:
 *               name: {type: string, minLength: 3, maxLength: 30, example: "Nguyễn Văn A"}
 *               email: {type: string, format: email, example: "nguyenvana@example.com"}
 *               password: {type: string, minLength: 6, maxLength: 30, example: "123456Aa!"}
 *               phone: {type: string, pattern: '^[0-9]+$', minLength: 10, maxLength: 10, example: "0901234567"}
 *               address: {type: string, example: "123 Đường B,Quận 1, TP.HCM"}
 *               areaId: {type: number, example: 1}
 *               role: {type: string, enum: [staff, admin, customer], example: "customer"}
 *               gender: {type: string, enum: [male, female, other], example: "male"}
 *               avatar: {type: string, format: binary, description: "Ảnh đại diện (Upload File)"}
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 */
router.post( "/sign-up", uploadAvatar.single("avatar"), CropAndSave("avatar"), validateMiddleware(signUpSchema, "body"), authController.signUp, );

/**
 * @swagger
 * /auth/sign-in:
 *   post:
 *     summary: Đăng nhập vào hệ thống
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: {type: string, format: email, example: "admin@bookingfamily.com"}
 *               password: {type: string, minLength: 6, maxLength: 30, example: "123456"}
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 */
router.post( "/sign-in", validateMiddleware(signInSchema, "body"), authController.signIn, );

/**
 * @swagger
 * /auth/sign-out:
 *   post:
 *     summary: Đăng xuất
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Đăng xuất thành công
 */
router.post("/sign-out", authController.signOut);

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Làm mới token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Token mới được tạo
 */
router.post("/refresh-token", authController.refreshToken);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Lấy thông tin cá nhân của người dùng hiện tại
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy thông tin người dùng thành công
 */
router.get("/me", authMiddleware, authController.fetchMe);

/**
 * @swagger
 * /auth/{id}:
 *   get:
 *     summary: Lấy thông tin người dùng
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng
 *     responses:
 *       200:
 *         description: Lấy thông tin người dùng thành công
 */
router.get(
  "/:id",
  validateMiddleware(fetchUserByIdSchema, "params"),
  authController.fetchUserById,
);

/**
 * @swagger
 * /auth/{id}:
 *   put:
 *     summary: Cập nhật thông tin người dùng
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 * # ... (rest of the block)
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name: {type: string}
 *               email: {type: string}
 *               phone: {type: string}
 *               address: {type: string}
 *               areaId: {type: number}
 *               gender: {type: string, enum: [male, female, other]}
 *               avatar: {type: string, format: binary, description: "Ảnh đại diện (Upload File)"}
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.put(
  "/:id",
  uploadAvatar.single("avatar"),
  CropAndSave("avatar"),
  validateMiddleware(updateUserSchema, "body"),
  authController.updateUserById,
);

/**
 * @swagger
 * /auth/{id}/status:
 *   patch:
 *     summary: Cập nhật trạng thái tài khoản
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status: {type: string, enum: [active, locked]}
 *     responses:
 *       200:
 *         description: Cập nhật trạng thái thành công
 */
router.patch(
  "/:id/status",
  validateMiddleware(updateStatusSchema, "body"),
  authController.updateStatus,
);

export default router;
