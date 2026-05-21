import { verifyAccessToken } from "#utils/jwt.util.js";
import prisma from "#config/prisma.js";
import AppError from "#utils/app.error.js";
export const socketAuthMiddleware = async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new AppError("Không tìm thấy accessToken"));
    const decoded = verifyAccessToken(token);
    if (!decoded)
      return next(new AppError("Token không tồn tại hoặc không hợp lệ"));
    const user = await prisma.user.findFirst({
      where: { id: decoded.id },
    });
    if (!user) return next(new AppError("Không tìm thấy user"));
    socket.user = user;
    next();
  } catch (error) {
    console.log("Socket auth error", error);
    next(new AppError("Kết nối socket thất bại", 500));
  }
};
