import catchAsync from "../../utils/catch.async.js";
import assignmentService from "./assignment.service.js";
class AssignmentController{
    createAssignJob = catchAsync(async (req, res) => {
        const assignJob = await assignmentService.createAssignJob(req.body);
        res.status(201).json({ success: true, message: 'Tạo giao việc thành công', data: assignJob })
    })

    updateAssignJob = catchAsync(async (req, res) => {
        const assignJob = await assignmentService.updateAssignJob(req.params.id, req.body);
        res.status(200).json({ success: true, message: 'Cập nhật giao việc thành công', data: assignJob })
    })

    deleteAssignJob = catchAsync(async (req, res) => {
        const assignJob = await assignmentService.deleteAssignJob(req.params.id);
        res.status(200).json({ success: true, message: 'Xóa giao việc thành công', data: assignJob })
    })
}

export default new AssignmentController()