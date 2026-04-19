import prisma from "../../config/prisma.js";
import AppError from "../../utils/app.error.js";
import HttpStatus from "../../utils/http.status.js";
import bookingService from "../bookings/booking.service.js";
import { paginatePrisma } from "../../helper/prisma.helper.js";
class ProgressService {
  createProgress = async (data, image) => {
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
          evidenceImageUrl: image || '',
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

      return nextProgress;
    });
  };
  getAllProgress = async (data) => {
    const query={bookingId: data.bookingId}
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
