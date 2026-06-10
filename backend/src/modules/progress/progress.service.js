import prisma from "../../config/prisma.js";
import AppError from "../../utils/app.error.js";
import HttpStatus from "../../utils/http.status.js";
import bookingService from "../bookings/booking.service.js";
import { paginatePrisma } from "../../helper/prisma.helper.js";
import { io } from '../../socket/index.js';
class ProgressService {
  createProgress = async (data, images) => {
    console.log("data: ", data);
    const staffAssignment = await prisma.staffAssignment.findFirst({
      where: { bookingId: data.bookingId, staffId: data.staffId , status: { notIn: ['cancelled', 'rejected'] }},
    });
    console.log(staffAssignment)
    if (!staffAssignment || staffAssignment.staffId !== data.staffId) {
      throw new AppError("Bạn không có quyền cập nhật tiến độ cho đơn này", HttpStatus.BAD_REQUEST);
    }
    const progress = await bookingService.getProgressNow(data.bookingId);
    let nextStep = "is_coming";
    if (progress) {
      if (progress.stepName === "completed") {
        throw new AppError("Công việc đã hoàn thành", HttpStatus.BAD_REQUEST);
      }
      const flow = {
        is_coming: "arrived",
        arrived: "is_working",
        is_working: "completed",
      };
      nextStep = flow[progress.stepName] || progress.stepName;
    }
    
    return await prisma.$transaction(async (tx) => {
      const nextProgress = await tx.taskProgress.create({
        data: {
          bookingId: data.bookingId,
          staffId: data.staffId,
          note: data.note,
          recordedAt: new Date(data.recordAt || new Date()),
          stepName: nextStep,
          evidenceImageUrl: images,
        },
      });
      await tx.staffAssignment.updateMany({
        where: { staffId: data.staffId, bookingId: data.bookingId },
        data: { status: nextStep },
      });
      if (nextStep === "completed") {
        await tx.booking.update({
          where: { id: data.bookingId },
          data: { status: "completed" },
        });
      }
      const booking = await prisma.booking.findUnique({ where: { id: data.bookingId } });
      io.to(booking.customerId).emit("update-progress", nextProgress);
      io.to(data.staffId).emit("update-progress", nextProgress);
      return nextProgress;
    });
  };
  getAllProgress = async (data) => {
    const query = {};
    if(data.bookingId){
      query.bookingId = data.bookingId;
    }
    if(data.stepName){
      query.stepName = data.stepName;
    }
    if(data.staffId){
      query.staffId = data.staffId;
    }
    
    return await paginatePrisma(prisma.taskProgress, query, data);
  };
}
export default new ProgressService();
