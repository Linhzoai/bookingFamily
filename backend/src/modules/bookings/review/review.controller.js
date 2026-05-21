import reviewService from "./review.service.js";
import catchAsync from "#utils/catch.async.js";
import {successResponse} from "#utils/response.handle.js";
class ReviewController {
    createReview = catchAsync(async (req, res) => {
        const review = await reviewService.createReview(req.body);
        res.status(201).json(successResponse(res, {data: review, message: "Tạo đánh giá thành công"}));
    })

    updateReview = catchAsync(async (req, res) => {
        const review = await reviewService.updateReview(req.params.id, req.body);
        res.status(200).json(successResponse(res, {data: review, message: "Cập nhật đánh giá thành công"}));
    })

    deleteReview = catchAsync(async (req, res) => {
        await reviewService.deleteReview(req.params.id);
        res.status(204).json(successResponse(res, {data: null, message: "Xóa đánh giá thành công"}));
    })

    getReview = catchAsync(async (req, res) => {
        const reviews = await reviewService.getReview(req.validatedQuery);
        res.status(200).json(successResponse(res, {data: reviews, message: "Lấy danh sách đánh giá thành công"}));
    })
}

export default new ReviewController();