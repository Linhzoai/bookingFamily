import { Queue, Worker } from "bullmq";
import IORedis from "ioredis";
import prisma from "../../config/prisma.js";
import { io } from "../../socket/index.js";

export const connection = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

// Khởi tạo Queue
export const dispatchQueue = new Queue("dispatchQueue", { connection });

// Định nghĩa Worker để chạy nền các Job
const dispatchWorker = new Worker(
  "dispatchQueue",
  async (job) => {
    const { bookingId, staffList, currentIndex } = job.data;
    // Lấy Assignment hiện tại để kiểm tra xem nhân viên trước đó có bấm nhận không
    if (currentIndex > 0) {
      const prevStaff = staffList[currentIndex - 1];
      const prevAssignment = await prisma.staffAssignment.findFirst({
        where: { bookingId, staffId: prevStaff.id },
        orderBy: { assignedAt: "desc" },
      });

      // Nếu họ đã bấm Nhận (accepted) thì kết thúc tiến trình
      if (prevAssignment && prevAssignment.status === "accepted") {
        console.log(
          `Nhân viên ${prevStaff.id} đã nhận đơn ${bookingId}. Hoàn tất.`,
        );
        return;
      }

      // Nếu không nhận (hoặc vẫn pending/assigned), update thành missed/rejected
      if (prevAssignment && prevAssignment.status === "assigned") {
        await prisma.staffAssignment.update({
          where: { id: prevAssignment.id },
          data: { status: "rejected" }, // Hoặc có thể thêm status 'missed'
        });
      }
    }

    // Lấy nhân viên tiếp theo
    if (currentIndex >= staffList.length) {
      console.log(`Đơn ${bookingId} không có nhân viên nào nhận.`);
      // Tự động đẩy đơn qua trạng thái chờ Admin điều phối tay
      await prisma.booking.update({
        where: { id: bookingId },
        data: { status: "no_staff_available" }, // Trạng thái tự định nghĩa
      });
      return;
    }

    const nextStaff = staffList[currentIndex];

    // Tạo StaffAssignment mới cho nhân viên tiếp theo
    await prisma.$transaction(async(tx) => {
      await tx.staffAssignment.create({
        data: {
          bookingId,
          staffId: nextStaff.id,
          status: "assigned",
          assignedAt: new Date(),
        },
      });
      await tx.booking.update({
        where: { id: bookingId },
        data: { status: "assigned" },
      });
    });

    // [Tuỳ chọn] Bắn Socket thông báo cho app của nhân viên
    io.to(nextStaff.id).emit("new_booking_request", {
      type: "STAFF_NEW_REQUEST",
      payload: {
        bookingId,
        staffId: nextStaff.id,
        message: `Bạn có một yêu cầu đặt dịch vụ mới`,
      },
    });

    // Lên lịch Job kế tiếp chạy SAU 5 PHÚT (300000 ms) nếu người này không nhận
    await dispatchQueue.add(
      "processNext",
      { bookingId, staffList, currentIndex: currentIndex + 1 },
      { delay: 300000 }, // Đợi 5 phút
    );
  },
  { connection },
);
