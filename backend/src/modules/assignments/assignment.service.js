import prisma from "../../config/prisma.js";
import AppError from "../../utils/app.error.js";
import { paginatePrisma } from "../../helper/prisma.helper.js";
import deleteFile from "../../helper/delete-file.helper.js";
import checkRecordExist from "../../utils/check-exist.js";
class AssignmentService{
    createAssignJob = async (data) =>{
        const {bookingId, staffId, assignAt, status} = data;
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
                assignAt,
                status,
            }
        })
        return assignJob;
    }

    updateAssignJob = async (id, data) =>{
        const {bookingId, staffId, assignAt, status} = data;
        
        // Kiểm tra assignment có tồn tại không
        await checkRecordExist(prisma.staffAssignment, {id}, undefined, 'Giao việc không tồn tại');

        const assignJob = await prisma.staffAssignment.update({
            where: { id },
            data
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