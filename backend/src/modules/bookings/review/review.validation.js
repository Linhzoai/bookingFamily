import Joi from 'joi'
import {queryPaginationSchema} from "#helper/joi.helper.js"
export const createSchema = Joi.object({
    bookingId: Joi.string().required(),
    customerId: Joi.string().required(),
    staffId: Joi.string().required(),
    rating: Joi.number().required().min(1).max(5).integer(),
    review: Joi.string().required(),
    type: Joi.string().valid("customer", "staff").required(),
})

export const updateSchema = Joi.object({
    rating: Joi.number().required().min(1).max(5).integer(),
    review: Joi.string().required(),
    type: Joi.string().valid("customer", "staff").required(),
})

export const deleteSchema = Joi.object({
    id: Joi.string().required(),
})

export const getReviewSchema = Joi.object({
    bookingId: Joi.string().optional(),
    customerId: Joi.string().optional(),
    staffId: Joi.string().optional(),
    type: Joi.string().valid("customer", "staff").optional(),
    rating: Joi.number().optional(),
}).concat(queryPaginationSchema);
