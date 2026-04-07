import prisma from "../../config/prisma.js";
import AppError from "../../utils/app.error.js";
import HttpStatus from "../../utils/http.status.js";
import checkRecordExist from "../../utils/check-exist.js";
import { formatArea } from "../../helper/format.helper.js";
import { paginatePrisma } from "../../helper/prisma.helper.js";
class BookingService {
  createBooking = async (data) => {
    const dataBooking = { ...data, status: "pending", };
    const [customer, area] = await Promise.all([
      checkRecordExist(prisma.user, { id: data.customerId, role: "customer" }),
      checkRecordExist(prisma.serviceArea, { id: data.areaId }),
    ]);
    dataBooking.address = data.address + ", " + (await formatArea(data.areaId));
    const serviceInfo = await Promise.all(
      data.serviceId.map(async (id) => {
        const service = await checkRecordExist(prisma.service, { id, active: true, });
        return {
          serviceId: id,
          price: service.price,
        };
      }),
    );
    const totalAmount = (await serviceInfo).reduce(
      (acc, service) => acc + Number(service.price),
      0,
    );
    dataBooking.totalAmount = totalAmount;
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
          const service = await checkRecordExist(prisma.service, {
            id,
            active: true,
          });
          return {
            serviceId: service.id,
            price: service.price,
          };
        }),
      );
      const totalAmount = serviceInfo.reduce(
        (acc, service) => acc + Number(service.price),
        0,
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
    if (data.serviceId) query.bookingDetails = {
        some: { serviceId: data.serviceId}
    };
    if (data.areaId) query.areaId = data.areaId;
    if (data.status) query.status = { in: data.status };
    if (data.scheduledTime) query.scheduledTime = data.scheduledTime;
    const include = { customer: true, area: true, bookingDetails: { include: { service: true } } };
    return paginatePrisma(prisma.booking, query, data, include);
  };
}

export default new BookingService();
