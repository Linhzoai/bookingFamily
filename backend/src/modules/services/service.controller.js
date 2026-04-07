import catchAsync from "../../utils/catch.async.js";
import ServiceService from "./service.service.js";
import { successResponse } from "../../utils/response.handle.js";
import env from "../../config/env.js";
class ServiceController{
    createService = catchAsync(async (req, res) => {
        const data = req.body;
        if(req.file){
            data.imageUrl = `${env.baseUrl}/services/${req.file.filename}`;
        }
        const result = await ServiceService.createService(data);
        return successResponse(res, { data: result, message: "Tạo dịch vụ thành công" }, 201);
    });

    updateService = catchAsync(async (req, res) => {
        const { id } = req.params;
        const data = req.body;
        if(req.file){
            data.imageUrl = `${env.baseUrl}/services/${req.file.filename}`;
        }
        const result = await ServiceService.updateService(id, data);
        return successResponse(res, { data: result, message: "Cập nhật dịch vụ thành công" }, 200);
    });

    deleteService = catchAsync(async (req, res) => {
        const { id } = req.params;
        await ServiceService.deleteService(id);
        return successResponse(res, { message: "Xóa dịch vụ thành công" }, 200);
    });

    getServices = catchAsync(async (req, res) => {
        const data = req.validatedQuery;
        const result = await ServiceService.getAllServices(data);
        return successResponse(res, { data: result, message: "Lấy danh sách dịch vụ thành công" }, 200);
    });

    getServiceById = catchAsync(async (req, res) => {
        const { id } = req.params;
        const result = await ServiceService.getServiceById(id);
        return successResponse(res, { data: result, message: "Lấy dịch vụ thành công" }, 200);
    });
}

export default new ServiceController();