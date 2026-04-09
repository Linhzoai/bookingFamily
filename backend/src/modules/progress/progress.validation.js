import Joi from "joi";
import {queryPaginationSchema} from "../../helper/joi.helper.js";
export const createProgressSchema = Joi.object({
    bookingId: Joi.string().required().label("Mã đặt lịch"),
    staffId: Joi.string().required().label("Mã nhân viên"),
    note: Joi.string().optional().label("Ghi chú"),
    recordAt: Joi.date().required().label("Thời gian ghi nhận"),
})

export const getProgressSchema = Joi.object({
    stepName: Joi.string().valid("is_coming", "arrived", "is_working", "completed").optional().label("Trạng thái"),
    bookingId: Joi.string().required().label("Mã đặt lịch"),
    staffId: Joi.string().optional().label("Mã nhân viên"),
}).concat(queryPaginationSchema);
