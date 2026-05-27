import prisma from "../../config/prisma.js";
import AppError from "../../utils/app.error.js";
import HttpStatus from "../../utils/http.status.js";
import checkRecordExist from "../../utils/check-exist.js";
import { formatArea } from "../../helper/format.helper.js";
import { paginatePrisma } from "../../helper/prisma.helper.js";
const caculateExpectEndTime = (serviceInfo) => {
  return serviceInfo.reduce((acc, service) => acc + Number(service.duration), 0);
}
class BookingService {
  createBooking = async (data) => {
    const dataBooking = { ...data, status: "pending" };
    const [customer, area] = await Promise.all([
      checkRecordExist(prisma.user, { id: data.customerId, role: "customer" }),
      checkRecordExist(prisma.serviceArea, { id: data.areaId }),
    ]);
    dataBooking.address = data.address + ", " + (await formatArea(data.areaId));
    const serviceInfo = await Promise.all(
      data.serviceId.map(async (id) => {
        const service = await checkRecordExist(prisma.service, { id, active: true, });
        return { serviceId: id, price: service.price, duration: service.duration };
      }),
    );
    let totalAmount = (await serviceInfo).reduce((acc, service) => acc + Number(service.price), 0);
    if (data.discountCode) {
      const discount = await prisma.discountCode.findUnique({ where: { code: data.discountCode }, });
      if (discount === null) {
        throw new AppError("Mã giảm giá không tồn tại", HttpStatus.BAD_REQUEST);
      }
      if (discount.discountType === "percentage") {
        totalAmount = Number(totalAmount) - (Number(totalAmount) * Number(discount.discountValue)) / 100;
      } else {
        totalAmount = Number(totalAmount) - Number(discount.discountValue);
      }
      if(discount.usageLimit && discount.usageLimit <= discount.usedCount){
        throw new AppError("Mã giảm giá đã hết lượt sử dụng", HttpStatus.BAD_REQUEST);
      }
      await prisma.discountCode.update({
        where: { code: data.discountCode },
        data: { usedCount: discount.usedCount + 1 },
      });
    }
    dataBooking.totalAmount = Number(totalAmount);
    dataBooking.scheduledTime = new Date(dataBooking.scheduledTime);
    dataBooking.expectedEndTime = new Date(
      dataBooking.scheduledTime.getTime() + caculateExpectEndTime(serviceInfo) * 60 * 1000
    );
    delete dataBooking.serviceId;
    const booking = await prisma.booking.create({
      data: {
        ...dataBooking,
        bookingDetails: {
          create: serviceInfo.map((service) => {
            return {
              serviceId: service.serviceId,
              quantity: 1,
              unitPrice: service.price,
              notes: "",
            };
          }),
        },
      },
    });
    return booking;
  };

  updateBooking = async (id, data) => {
    const booking = await checkRecordExist(prisma.booking, { id });
    if (data.status === "cancelled") {
      if (booking.status !== "pending" && booking.status !== "accepted") {
        throw new AppError(
          "Đơn hàng ko thể hủy do đã được sử lý",
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    if (data.status === "completed") {
      if (booking.status !== "in_progress") {
        throw new AppError(
          "Đơn hàng ko thể hoàn thành do chưa được sử lý",
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    if (data.status === "in_progress") {
      if (booking.status !== "accepted") {
        throw new AppError(
          "Đơn hàng ko thể sử lý do chưa được chấp nhận",
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (data.serviceId) {
      const serviceInfo = await Promise.all(
        data.serviceId.map(async (id) => {
          const service = await checkRecordExist(prisma.service, { id, active: true, });
          return { serviceId: service.id, price: service.price, duration: service.duration };
        }),
      );
      const totalAmount = serviceInfo.reduce((acc, service) => acc + Number(service.price), 0);
      data.expectedEndTime = new Date(
        data.scheduledTime.getTime() + caculateExpectEndTime(serviceInfo) * 60 * 1000
      );
      data.totalAmount = totalAmount;
      data.bookingDetails = {
        deleteMany: {},
        create: serviceInfo.map((service) => {
          return {
            serviceId: service.serviceId,
            quantity: 1,
            unitPrice: service.price,
            notes: "",
          };
        }),
      };
      delete data.serviceId;
    }
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: data,
      include: {
        bookingDetails: true,
      },
    });
    return updatedBooking;
  };

  deleteBooking = async (id) => {
    const booking = await checkRecordExist(prisma.booking, { id });
    if (booking.status !== "pending" && booking.status !== "accepted") {
      throw new AppError(
        "Đơn hàng ko thể xóa do đã được sử lý",
        HttpStatus.BAD_REQUEST,
      );
    }
    await prisma.bookingDetails.deleteMany({ where: { bookingId: id } });
    await prisma.staffAssignment.deleteMany({ where: { bookingId: id } });
    await prisma.booking.delete({ where: { id } });
    return {
      message: "Xóa đơn hàng thành công",
    };
  };

  getBookingById = async (id) => {
    const booking = await checkRecordExist(
      prisma.booking,
      { id },
      {
        customer: true,
        bookingDetails: {
          include: {
            service: true,
          },
        },
        area: true,
        staffAssignments: true,
        payments: true,
        review: true,
        issueReports: true,
        taskProgress: true,
      },
    );
    return booking;
  };

  getBooking = async (data) => {
    const query = {};
    if (data.customerId) query.customerId = data.customerId;
    if (data.serviceId)
      query.bookingDetails = {
        some: { serviceId: data.serviceId },
      };
    if (data.assign)
      query.staffAssignments = {
        none: {
          status: { in: ["accepted", "pending", "completed"] },
        },
      };
    if (data.areaId)
      query.area = {
        path: {
          contains: `/${data.areaId}/`,
        },
      };
    if (data.staffId) {
      query.staffAssignments = {
        some: {
          staffId: {
            in: Array.isArray(data.staffId) ? data.staffId : [data.staffId],
          },
        },
      };
    }
    if (data.status) query.status = { in: data.status };
    if (data.scheduledTime) query.scheduledTime = data.scheduledTime;
    const include = {
      customer: true,
      area: true,
      bookingDetails: { include: { service: true } },
      staffAssignments: {
        include: { staff: true },
      },
    };
    return paginatePrisma(prisma.booking, query, data, include);
  };

  getProgressNow = async (bookingId) => {
    const booking = await checkRecordExist(prisma.booking, { id: bookingId });
    const progress = await prisma.taskProgress.findFirst({
      where: { bookingId: bookingId },
      orderBy: {
        recordedAt: "desc",
      },
      include: {
        staff: true,
      },
    });
    return progress;
  };

  getBookingIdForSocketId = async (userId) => {
    const bookings = await prisma.booking.findMany({
      where: {
        OR: [
          { customerId: userId },
          {
            staffAssignments: {
              some: {
                staffId: userId,
                status: {
                  not: "rejected",
                },
              },
            },
          },
        ],
      },
      select: {
        id: true,
      },
    });
    return bookings;
  };
}

export default new BookingService();
