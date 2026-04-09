import Joi from "joi";

export const createProgressValidation = Joi.object({
    bookingId: Joi.string().required(),
    staffId: Joi.string().required(),
    assignedAt: Joi.date().required().default(Date.now),
    status: Joi.string().valid('accepted', 'rejected','assigned', 'completed').default('assigned').required(),
})

export const updateProgressValidation = Joi.object({
    bookingId: Joi.string().optional(),
    staffId: Joi.string().optional(),
    assignedAt: Joi.date().optional(),
    status: Joi.string().valid('accepted', 'rejected','assigned', 'completed').optional(),
})

export const paramsIdValidation = Joi.object({
    id: Joi.number().required(),
})
