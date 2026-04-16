import catchAsync from "../../utils/catch.async.js";
import AreaService from "./area.service.js";
import { successResponse } from "../../utils/response.handle.js";
class AreaController {

  //[POST] /api/v1/areas/create
  createArea = catchAsync(async (req, res) => {
    const data = req.body;
    const result = await AreaService.createArea(data);
    return successResponse(res, { data: result, message: "Thêm địa điểm thành công" }, 201);
  });

  //[PUT] /api/v1/areas/:id/update
  updateArea = catchAsync(async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const result = await AreaService.updateArea(id, data);
    return successResponse(res, { data: result, message: "Cập nhật địa điểm thành công" }, 200);
  });

  //[DELETE] /api/v1/areas/:id/delete
  deleteArea = catchAsync(async (req, res) => {
    const { id } = req.params;
    await AreaService.deleteArea(id);
    return successResponse(res, { message: "Xóa địa điểm thành công" }, 200);
  });

  //[GET] /api/v1/areas
  getAreas = catchAsync(async (req, res)=>{
    const data = req.validatedQuery;
    const result = await AreaService.getAllAreas(data);
    return successResponse(res, { data: result, message: "Lấy danh sách địa điểm thành công" }, 200);
  })

  //[GET] /api/v1/areas/:id/get
  getAreaById = catchAsync(async (req, res)=>{
    const { id } = req.params;
    const result = await AreaService.getAreaById(id);
    return successResponse(res, { data: result, message: "Lấy địa điểm thành công" }, 200);
  })
}

export default new AreaController();
