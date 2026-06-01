import prisma from "../../config/prisma.js";
import AppError from "../../utils/app.error.js";
import checkRecordExist from "../../utils/check-exist.js";
import {io} from "../../socket/index.js"
class AssignmentService{
    createAssignJob = async (data) =>{
        const {bookingId, staffId, assignedAt, status} = data;
        const [booking, staff] = await Promise.all([
            checkRecordExist(prisma.booking, {id: bookingId}, undefined, 'Booking không tồn tại'),
            checkRecordExist(prisma.user, {id: staffId, role: 'staff'}, undefined, 'Nhân viên không tồn tại')
        ])
        const asignExist = await prisma.staffAssignment.findFirst({
            where: { bookingId, status: {
                not: 'rejected'
            }}
        })
        if(asignExist){
            throw new AppError('Booking này đã được giao cho nhân viên khác', 400);
        }
        
        const assignJob = await prisma.staffAssignment.create({
            data: {
                bookingId,
                staffId,
                assignedAt: new Date(assignedAt),
                status,
            }
        })
        io.to(staffId).to(booking.customerId).emit("new-assignment-job", {
          type: 'STAFF_NEW_REQUEST',
          payload: {
            bookingId,
            staffAssignment: assignJob,
            message: `Bạn có một yêu cầu đặt dịch vụ mới từ Admin`
          }
        })
        return assignJob;
    }

    updateAssignJob = async (id, data) =>{
        // Kiểm tra assignment có tồn tại không
        await checkRecordExist(prisma.staffAssignment, {id: Number(id)}, undefined, 'Giao việc không tồn tại');
        const assignJob = await prisma.staffAssignment.update({
            where: { id: Number(id) },
            data
        })
        const booking = await prisma.booking.findUnique({
            where: { id: assignJob.bookingId },
            include: {
                customer: true
            }
        })
        io.to(assignJob.staffId).to(booking?.customer?.id).emit("update-assignment-job", {
          type: data.status==="accepted"?"STAFF_ACCEPT_REQUEST":"STAFF_REJECT_REQUEST",
          payload: {
            bookingId: assignJob.bookingId,
            staffAssignment: assignJob,
            message: data.status==="accepted"?"Nhân viên đã chấp nhận yêu cầu đặt dịch vụ":"Nhân viên đã từ chối yêu cầu đặt dịch vụ"
          }
        })
        return assignJob;
    }

    deleteAssignJob = async (id) =>{
        await checkRecordExist(prisma.staffAssignment, {id}, undefined, 'Giao việc không tồn tại');
        const assignJob = await prisma.staffAssignment.delete({
            where: { id }
        })
        return assignJob;
    }
}

export default new AssignmentService();