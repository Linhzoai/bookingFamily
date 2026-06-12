import prisma from "#config/prisma.js";
import { paginatePrisma } from "#helper/prisma.helper.js";
import checkRecordExist from "#utils/check-exist.js"
import AppError from "#utils/app.error.js";
import HttpStatus from "#utils/http.status.js";
class RequestService {

    //tạo yêu cầu nghỉ việc
    createRequest = async (data) => {
        await checkRecordExist(prisma.user, {id: data.staffId},undefined, "Nhân viên không tồn tại");
        const startTime = new Date(data.startTime);
        const endTime = new Date(data.endTime);
        if(startTime > endTime) throw new AppError("Thời gian bắt đầu không được lớn hơn thời gian kết thúc", HttpStatus.BAD_REQUEST);
        const request = await prisma.leaveRequest.create({
            data: {
                staffId: data.staffId,
                startTime: startTime,
                endTime: endTime,
                reason: data.reason,
                status: data.status,
            }
        })
        return request;
    }

    //sửa yêu cầu nghỉ việc
    updateRequest = async (id, data, user) => {
        await checkRecordExist(prisma.leaveRequest, {id}, "Yêu cầu nghỉ việc không tồn tại");
        const startTime = new Date(data.startTime);
        const endTime = new Date(data.endTime);
        if(startTime > endTime) throw new AppError("Thời gian bắt đầu không được lớn hơn thời gian kết thúc", HttpStatus.BAD_REQUEST);
        const request = await prisma.leaveRequest.update({
            where: {id},
            data: {...data, startTime, endTime, approvedBy: user.id}
        })
        return request;
    }

    //xóa yêu cầu nghỉ việc
    deleteRequest = async (id) => {
        await checkRecordExist(prisma.leaveRequest, {id}, "Yêu cầu nghỉ việc không tồn tại");
        await prisma.leaveRequest.delete({
            where: {id}
        })
        return "Xóa yêu cầu nghỉ việc thành công";
    }

    //lấy tất cả yêu cầu nghỉ việc
    getAllRequests = async (data) => {
        const query = {};
        if(data.startTime) query.startTime = {gte: new Date(data.startTime)} ;
        if(data.endTime) query.endTime = {lte: new Date(data.endTime)} ;
        if(data.status) query.status = data.status;
        if(data.staffId) query.staffId = data.staffId;
        return await paginatePrisma(prisma.leaveRequest, query,data, {staff: true});
    }

    //Cập nhật trạng thái yêu cầu xin nghỉ 
    updateStatus = async (id, data, user) => {
        await checkRecordExist(prisma.leaveRequest, {id}, "Yêu cầu nghỉ việc không tồn tại");
        const request = await prisma.leaveRequest.update({
            where: {id},
            data: {status: data.status, approvedBy: user.id}
        })
        return request;
    }
}

export default new RequestService();