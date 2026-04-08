import { Router } from "express";
import assignmentController from "./assignment.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { createProgressValidation, updateProgressValidation, paramsIdValidation } from "./assignment.validation.js";

const router = Router();

router.post('/', validate(createProgressValidation), assignmentController.createAssignJob)
router.put('/:id', validate(updateProgressValidation), assignmentController.updateAssignJob)
router.delete('/:id', validate(paramsIdValidation, "params"), assignmentController.deleteAssignJob)

export default router;