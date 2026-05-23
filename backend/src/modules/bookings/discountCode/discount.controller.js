import catchAsync from "#utils/catch.async.js";
import {successResponse} from "#utils/response.handle.js";
import discountService from "./discount.service.js";

class DiscountController {
    createDiscount = catchAsync(async (req, res) => {
        const discount = await discountService.createDiscountCode(req.body);
        return successResponse(res, {data: discount, message: "Tạo mã giảm giá thành công", code: 201});
    })

    updateDiscount = catchAsync(async (req, res) => {
        const discount = await discountService.updateDiscountCode(req.params.id, req.body);
        return successResponse(res, {data: discount, message: "Cập nhật mã giảm giá thành công"});
    })

    getAllDiscount = catchAsync(async (req, res) => {
        const query = req.validatedQuery;
        console.log("query của getall",query)
        const discounts = await discountService.getAllDiscountCode(query);
        return successResponse(res, {data: discounts, message: "Lấy danh sách mã giảm giá thành công"});
    })

    deleteDiscount = catchAsync(async (req, res) => {
        const discount = await discountService.deleteDiscountCode(req.params.id);
        return successResponse(res, {data: discount, message: "Xóa mã giảm giá thành công"});
    })
}

export default new DiscountController();