import ReportService from "./Report.service.js";
import { successResponse } from "../../utils/response.handle.js";
import catchAsync from "../../utils/catch.async.js";
class ReportController {
  queryRevenue = catchAsync(async (req, res) => {
    const data = req.validatedQuery;
    const result = await ReportService.queryRevenue(data);
    return successResponse(res, { data: result, message: "Lấy dữ liệu thành công" });
  });
  queryRevenueByPartner = catchAsync(async (req, res) => {
    const user = req.user;
    const data = req.validatedQuery;
    const result = await ReportService.queryRevenueByPartner(user, data);
    return successResponse(res, { data: result, message: "Lấy dữ liệu thành công" });
  });
}
export default new ReportController();