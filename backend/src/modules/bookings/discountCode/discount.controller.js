import catchAsync from "#utils/catch.async.js";
import {successResponse} from "#utils/response.handle.js";
import discountService from "./discount.service.js";

class DiscountController {
    createDiscount = catchAsync(async (req, res) => {
        const discount = await discountService.createDiscount(req.body);
        res.status(201).json(successResponse(res, {data: discount, message: "Tạo mã giảm giá thành công"}));
    })

    updateDiscount = catchAsync(async (req, res) => {
        const discount = await discountService.updateDiscount(req.params.id, req.body);
        res.status(200).json(successResponse(res, {data: discount, message: "Cập nhật mã giảm giá thành công"}));
    })

    getAllDiscount = catchAsync(async (req, res) => {
        const discounts = await discountService.getAllDiscount(req.validatedQuery);
        res.status(200).json(successResponse(res, {data: discounts, message: "Lấy danh sách mã giảm giá thành công"}));
    })

    deleteDiscount = catchAsync(async (req, res) => {
        const discount = await discountService.deleteDiscount(req.params.id);
        res.status(200).json(successResponse(res, {data: discount, message: "Xóa mã giảm giá thành công"}));
    })
}

export default new DiscountController();