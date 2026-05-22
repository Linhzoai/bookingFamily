import prisma from "#config/prisma.js";
import AppError from "#utils/app.error.js";
import HttpStatus from "#utils/http.status.js";
import checkRecordExist from "#utils/check-exist.js";
import { paginatePrisma } from "#helper/prisma.helper.js";
class DiscountService {
  createDiscountCode = async (data) => {
    const existCode = await prisma.discountCode.findFirst({
      where: { code: data.code },
    });
    if (existCode) {
      throw new AppError("Mã giảm giá đã tồn tại", HttpStatus.BAD_REQUEST);
    }
    const discountCode = await prisma.discountCode.create({
      data: {
        code: data.code,
        description: data.description || "",
        discountType: data.discountType,
        discountValue: data.discountValue,
        minBookingAmount: data.minBookingAmount,
        maxDiscountAmount: data.maxDiscountAmount || null,
        startDate: data.startDate,
        endDate: data.endDate,
        usageLimit: data.usageLimit || 9999999,
        usedCount: data.usedCount,
        isActive: data.isActive,
      },
    });
    return discountCode;
  };

  updateDiscountCode = async (id, data) => {
    const existDiscountCode = await checkRecordExist(prisma.discountCode, id);
    if (!existDiscountCode) {
      throw new AppError("Mã giảm giá không tồn tại", HttpStatus.BAD_REQUEST);
    }
    if (existDiscountCode.code !== data.code) {
      const existCode = await prisma.discountCode.findFirst({
        where: { code: data.code },
      });
      if (existCode) {
        throw new AppError("Mã giảm giá đã tồn tại", HttpStatus.BAD_REQUEST);
      }
    }
    const discountCode = await prisma.discountCode.update({
      where: { id },
      data: {
        code: data.code,
        description: data.description,
        discountType: data.discountType,
        discountValue: data.discountValue,
        minOrderAmount: data.minOrderAmount,
        maxDiscountAmount: data.maxDiscountAmount,
        startDate: data.startDate,
        endDate: data.endDate,
        usageLimit: data.usageLimit,
        usedCount: data.usedCount,
        isActive: data.isActive,
      },
    });
    return discountCode;
  };

  getAllDiscountCode = async (data) => {
    const query = {};
    if (data.code) {
      where.code = { contains: data.code };
    }
    if (data.discountType) {
      where.discountType = data.discountType;
    }
    if (data.startDate) {
      where.startDate = { gte: new Date(data.startDate) };
    }
    if (data.endDate) {
      where.endDate = { lte: new Date(data.endDate) };
    }
    if (data.isActive) {
      where.isActive = data.isActive;
    }
    const discountCodes = await paginatePrisma(
      prisma.discountCode,
      query,
      data,
    );
    return discountCodes;
  };

  deleteDiscountCode = async (id) => {
    const existDiscountCode = await checkRecordExist(prisma.discountCode, {id});
    if (!existDiscountCode) {
      throw new AppError("Mã giảm giá không tồn tại", HttpStatus.BAD_REQUEST);
    }
    const discountCode = await prisma.discountCode.delete({
      where: { id },
    });
    return discountCode;
  };
}

export default new DiscountService();
