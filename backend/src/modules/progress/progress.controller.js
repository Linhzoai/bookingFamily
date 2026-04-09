import progressService from "./progress.service.js";
import env from "../../config/env.js";
import catchAsync from "../../utils/catch.async.js";
class ProgressController {
    createProgress = catchAsync(async (req, res, next) => {
        const image = req.file ? `${env.baseUrl}/progress/${req.file?.filename}` : null;
        const progress = await progressService.createProgress(req.body, image);
            res.status(201).json({
                success: true,
                message: "Tạo tiến độ thành công",
                data: progress,
            });
    });
    getAllProgress = catchAsync(async (req, res, next) => {
            const progress = await progressService.getAllProgress(req.query);
            res.status(200).json({
                success: true,
                message: "Lấy danh sách tiến độ thành công",
                data: progress,
            });
    });
}

export default new ProgressController();