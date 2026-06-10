import progressService from "./progress.service.js";
import env from "../../config/env.js";
import catchAsync from "../../utils/catch.async.js";
class ProgressController {
    createProgress = catchAsync(async (req, res, next) => {
        const images = req.files ? req.files.map(file => `${env.baseUrl}/progress/${file.filename}`) : [];
        const progress = await progressService.createProgress(req.body, images);
            res.status(201).json({
                success: true,
                message: "Tạo tiến độ thành công",
                data: progress,
            });
    });
    getAllProgress = catchAsync(async (req, res, next) => {
            const progress = await progressService.getAllProgress(req.validatedQuery);
            res.status(200).json({
                success: true,
                message: "Lấy danh sách tiến độ thành công",
                data: progress,
            });
    });
}

export default new ProgressController();