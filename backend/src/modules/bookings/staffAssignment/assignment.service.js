import AppError from '../../../utils/app.error.js';
import prisma from '../../../config/prisma.js';
import HttpStatus from '../../../utils/http.status.js';
import checkRecordExist from '../../../utils/check-exist.js';
import { paginatePrisma } from '../../../helper/prisma.helper.js';
class AssignmentService{
    createAssignment = async (body) =>{
        const [booking, staff] =await Promise.all([
            checkRecordExist(prisma.booking, body.bookingId,),
            checkRecordExist(prisma.user, body.staffId)
        ])
        const exist = await prisma.staffAssignment.findFirst({
            where: {
                bookingId: body.bookingId,
                status: {
                    not: ['rejected']
                }
            }
        })
        if(exist){
            throw new AppError("Nhân viên đã được giao việc", HttpStatus.BAD_REQUEST)
        }
        const assignment = await prisma.staffAssignment.create({
            data: body
        })
        return assignment
    }

    updateAssignment = async (id, data) =>{
        const assignment = await checkRecordExist(prisma.staffAssignment, {id})
        const updatedAssignment = await prisma.staffAssignment.update({
            where: {id},
            data: data
        })
        return updatedAssignment
    }
    deleteAssignment = async (id) =>{
        const assignment = await checkRecordExist(prisma.staffAssignment, {id})
        await prisma.staffAssignment.delete({ where: {id} })
        return {
            message: "Xóa giao việc thành công"
        }
    }
    getAssignmentById = async (id) =>{
        const assignment = await checkRecordExist(prisma.staffAssignment, {id}, {
            booking: true,
            staff: true,
        })
        return assignment
    }
    getAssignment = async (data) =>{
        const query = {}
        if(data.bookingId) query.bookingId = data.bookingId
        if(data.staffId) query.staffId = data.staffId
        if(data.status) query.status = {in: data.status}
        const include = { booking: true, staff: true }
        return paginatePrisma(prisma.staffAssignment, query, data, include)
    }
}

export default new AssignmentService()