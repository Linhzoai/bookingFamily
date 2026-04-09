import Joi from "joi";
import { queryPaginationSchema } from "../../helper/joi.helper.js";

export const createBookingValidation = Joi.object({
    customerId: Joi.string().required().label("Mã khách hàng"),
    areaId: Joi.number().required().label("Mã khu vực"),
    address: Joi.string().required().label("Địa chỉ").min(5).max(500),
    scheduledTime: Joi.string().required().label("Thời gian đặt lịch"),
    discountCodeId: Joi.string().optional().label("Mã giảm giá").empty(''),
    status: Joi.string().optional().default('pending').label("Trạng thái").valid('pending','accepted','in_progress','completed','cancelled'),
    note: Joi.string().optional().label("Ghi chú").max(500),
    serviceId: Joi.array().items(Joi.number()).required().label("Mã dịch vụ"),
})

export const updateBookingValidation = Joi.object({
    customerId: Joi.string().optional().label("Mã khách hàng"),
    serviceId: Joi.array().items(Joi.number()).optional().label("Mã dịch vụ"),
    areaId: Joi.number().optional().label("Mã khu vực"),
    address: Joi.string().optional().label("Địa chỉ").min(5).max(500),
    scheduledTime: Joi.string().optional().label("Thời gian đặt lịch"),
    discountCodeId: Joi.string().optional().label("Mã giảm giá"),
    status: Joi.string().optional().label("Trạng thái").valid('pending','accepted','in_progress','completed','cancelled'),
    note: Joi.string().optional().label("Ghi chú").max(500),
    actualStartTime: Joi.date().optional().label("Thời gian bắt đầu"),
    actualEndTime: Joi.date().optional().label("Thời gian kết thúc"),
    cancelReason: Joi.string().optional().label("Lý do hủy").max(500),
})

export const getBookingValidation = Joi.object({
    customerId: Joi.string().optional().label("Mã khách hàng").empty(''),
    serviceId: Joi.number().optional().label("Mã dịch vụ").empty(''),
    areaId: Joi.number().optional().label("Mã khu vực").empty(''),
    status: Joi.array().items(Joi.string().valid('pending','accepted','in_progress','completed','cancelled')).single().optional().label("Trạng thái").empty(''),
    scheduledTime: Joi.string().optional().label("Thời gian đặt lịch").empty(''),
    assign: Joi.boolean().optional().label("Đã phân công").empty('')
}).concat(queryPaginationSchema)

export const getBookingByIdValidation = Joi.object({
    id: Joi.string().required().label("Mã đặt lịch")
})
