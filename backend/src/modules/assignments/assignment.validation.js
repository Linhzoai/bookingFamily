import Joi from "joi";

export const createProgressValidation = Joi.object({
    bookingId: Joi.string().required(),
    staffId: Joi.string().required(),
    assignedAt: Joi.date().optional().default(Date.now),
    status: Joi.string().valid('accepted', 'rejected','assigned', 'completed', 'cancelled').default('assigned').optional(),
})

export const updateProgressValidation = Joi.object({
    bookingId: Joi.string().optional(),
    staffId: Joi.string().optional(),
    assignedAt: Joi.date().optional(),
    reason: Joi.string().optional(),
    status: Joi.string().valid('accepted', 'rejected','assigned', 'completed','cancelled').optional(),
})

export const paramsIdValidation = Joi.object({
    id: Joi.number().required(),
})
