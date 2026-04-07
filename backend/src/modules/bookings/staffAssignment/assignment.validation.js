import Joi from 'joi';

export const createAssignmentValidation = Joi.object({
    bookingId: Joi.string().required().label("Mã đặt lịch"),
    staffId: Joi.string().required().label("Mã nhân viên"),
    assignedAt: Joi.date().optional().label("Thời gian giao").default(Date.now),
    status: Joi.string().valid('assigned','accepted', 'completed', 'rejected').optional().default('assigned').label("Trạng thái"),
})

export const updateAssignmentValidation = Joi.object({
    bookingId: Joi.string().optional().label("Mã đặt lịch"),
    staffId: Joi.string().optional().label("Mã nhân viên"),
    assignedAt: Joi.date().optional().label("Thời gian giao").default(Date.now),
    status: Joi.string().valid('assigned','accepted', 'completed', 'rejected').optional().default('assigned').label("Trạng thái"),
})

export const deleteAssignmentValidation = Joi.object({
    id: Joi.number().required().label("Mã giao"),
})

export const getAssignmentValidation = Joi.object({
    bookingId: Joi.string().optional().label("Mã đặt lịch"),
    staffId: Joi.string().optional().label("Mã nhân viên"),
    assignedAt: Joi.date().optional().label("Thời gian giao"),
    status: Joi.array().items(Joi.string().valid('assigned','accepted', 'completed', 'rejected')).optional().label("Trạng thái"),
}).concat(queryPaginationSchema)