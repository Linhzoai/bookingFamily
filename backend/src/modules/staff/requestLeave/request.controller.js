import catchAsync from "#utils/catch.async.js";
import { successResponse } from "#utils/response.handle.js";
import RequestService from "./request.service.js";
import HttpStatus from "#utils/http.status.js";

class RequestController {
    
    createRequest = catchAsync(async (req, res, next) => {
        const result = await RequestService.createRequest(req.body);
        successResponse(res, {data: result, message: "Tạo yêu cầu nghỉ việc thành công", status: HttpStatus.CREATED});
    })

    updateRequest = catchAsync(async (req, res, next) => {
        const result = await RequestService.updateRequest(req.params.id, req.body, req.user);
        successResponse(res, {data: result, message: "Cập nhật yêu cầu nghỉ việc thành công", status: HttpStatus.OK});
    })

    deleteRequest = catchAsync(async (req, res, next) => {
        const result = await RequestService.deleteRequest(req.params.id);
        successResponse(res, {data: result, message: "Xóa yêu cầu nghỉ việc thành công", status: HttpStatus.OK});
    })

    getAllRequests = catchAsync(async (req, res, next) => {
        const result = await RequestService.getAllRequests(req.validatedQuery);
        successResponse(res, {data: result, message: "Lấy danh sách yêu cầu nghỉ việc thành công", status: HttpStatus.OK});
    })

}

export default new RequestController();