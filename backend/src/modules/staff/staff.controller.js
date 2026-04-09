import catchAsync from "../../utils/catch.async.js";
import StaffService from "./staff.service.js";
import { successResponse } from "../../utils/response.handle.js";
import HttpStatus from "../../utils/http.status.js";

class StaffController {
  //[POST] /api/v1/staff/:id/add-profile - thêm thông tin nhân viên
  addProfile = catchAsync(async (req, res) => {
    const id = req.params.id;
    const data = req.body;
    const staffProfile = await StaffService.addProfile(id, data);
    return successResponse(res, { data: staffProfile, message: "Thêm thông tin nhân viên thành công", statusCode: HttpStatus.CREATED, });
  });

  //[GET] /api/v1/staff/:id/profile - lấy thông tin nhân viên
  getProfile = catchAsync(async (req, res) => {
    const id = req.params.id;
    const staffProfile = await StaffService.getProfile(id);
    return successResponse(res, { data: staffProfile, message: "Lấy thông tin nhân viên thành công", statusCode: HttpStatus.OK, });
  });

  //[PUT] /api/v1/staff/:id/update-profile - cập nhật thông tin nhân viên
  updateProfile = catchAsync(async (req, res) => {
    const id = req.params.id;
    const data = req.body;
    const staffProfile = await StaffService.updateProfile(id, data);
    return successResponse(res, { data: staffProfile, message: "Cập nhật thông tin nhân viên thành công", statusCode: HttpStatus.OK, });
  });

  //[PATCH] /api/v1/staff/:id/update-status - cập nhật trạng thái nhân viên
  updateStatus = catchAsync(async (req, res) => {
    const id = req.params.id;
    const status = req.body.status;
    const staffProfile = await StaffService.updateprofile(id, status);
    return successResponse(res, { data: staffProfile, message: "Cập nhật thông tin nhân viên thành công", statusCode: HttpStatus.OK, });
  });

  //[DELETE] /api/v1/staff/:id/delete-profile - xóa thông tin nhân viên
  deleteProfile = catchAsync(async (req, res) => {
    const id = req.params.id;
    await StaffService.deleteProfile(id);
    return successResponse(res, { message: "Xóa thông tin nhân viên thành công", statusCode: HttpStatus.OK, });
  });

  //[GET] /api/v1/staff/list - lấy danh sách nhân viên
  getStaffList = catchAsync(async (req, res)=>{
    const data = req.validatedQuery;
    const staffList = await StaffService.getStaffList(data);
    return successResponse(res, { data: staffList, message: "Lấy danh sách nhân viên thành công", statusCode: HttpStatus.OK, });
  })

  //[DELETE] /api/v1/staff/:id/delete-staff - xóa nhân viên
  deleteStaff = catchAsync(async (req, res) => {
    const id = req.params.id;
    await StaffService.deleteStaff(id);
    return successResponse(res, { message: "Xóa nhân viên thành công", statusCode: HttpStatus.OK, });
  });

  //[GET] /api/v1/staff/:id/jobs - lấy danh sách công việc của nhân viên
  getJob = catchAsync(async (req, res) => {
    const id = req.params.id;
    const data = req.validatedQuery;
    const jobs = await StaffService.getJob(id, data);
    return successResponse(res, { data: jobs, message: "Lấy danh sách công việc thành công", statusCode: HttpStatus.OK, });
  });

  //[PATCH] /api/v1/staff/:id/update-job - cập nhật trạng thái công việc
  updateJob = catchAsync(async (req, res) => {
    const id = req.params.id;
    const status = req.body.status;
    const job = await StaffService.updateJob(id, status);
    return successResponse(res, { data: job, message: "Cập nhật trạng thái công việc thành công", statusCode: HttpStatus.OK, });
  });

}

export default new StaffController();