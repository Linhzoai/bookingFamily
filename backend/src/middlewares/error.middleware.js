import { errorResponse } from "../utils/response.handle.js";
import { Prisma } from "@prisma/client";
import HttpStatus from "../utils/http.status.js";
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Lỗi hệ thống";

  // Lỗi Prisma đã biết (unique, not found, FK...)
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002": // Unique constraint violation
        statusCode = HttpStatus.CONFLICT;
        const field = err.meta?.target || "Trường";
        message = `${field} đã tồn tại`;
        break;
      case "P2025": // Record not found
        statusCode = HttpStatus.NOT_FOUND;
        message = "Không tìm thấy dữ liệu";
        break;
      case "P2003": // Foreign key constraint failed
        statusCode = HttpStatus.BAD_REQUEST;
        message = "Dữ liệu tham chiếu không hợp lệ";
        break;
      default:
        statusCode = HttpStatus.BAD_REQUEST;
        message = `Lỗi database: ${err.code}`;
    }
  }

  // Lỗi Prisma validation (dữ liệu sai kiểu)
  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = HttpStatus.BAD_REQUEST;
    message = "Dữ liệu gửi lên không hợp lệ";
  }

  // Lỗi kết nối database
  if (err instanceof Prisma.PrismaClientInitializationError) {
    statusCode = HttpStatus.SERVICE_UNAVAILABLE;
    message = "Không thể kết nối đến database";
  }

  // Lỗi JWT
  if (err.name === "JsonWebTokenError") {
    statusCode = HttpStatus.UNAUTHORIZED;
    message = "Token không hợp lệ";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = HttpStatus.UNAUTHORIZED;
    message = "Token đã hết hạn";
  }

  // Lỗi Joi validation
  if (err.isJoi) {
    statusCode = HttpStatus.BAD_REQUEST;
    message = err.details.map((d) => d.message).join(", ");
  }

  if (statusCode >= 500) {
    console.error("SERVER ERROR:", {
      message: err.message,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
      body: req.body,
      timestamp: new Date().toISOString(),
    });
  } else {
    console.warn("CLIENT ERROR:", {
      statusCode,
      message,
      url: req.originalUrl,
      method: req.method,
    });
  }

  const response = {
    message,
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
    }),
  };
  return errorResponse(res, { message, code: statusCode, errors: response });
};

export default errorHandler;
