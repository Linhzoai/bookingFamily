import Joi from 'joi';
import {queryPaginationSchema} from '#helper/joi.helper.js';
const StatusEnum = ['pending', 'approved', 'rejected'];

export const createValidation = Joi.object({
    staffId: Joi.string().required(),
    startTime: Joi.date().required(),
    endTime: Joi.date().required(),
    reason: Joi.string().optional(),
    status: Joi.string().valid(...StatusEnum).default("pending"),
})

export const updateValidation = Joi.object({
    startTime: Joi.date().optional(),
    endTime: Joi.date().optional(),
    reason: Joi.string().optional(),
    status: Joi.string().valid(...StatusEnum).optional(),
})

export const deleteValidation = Joi.object({
    id: Joi.number().required(),
})

export const getValidation = Joi.object({
    staffId: Joi.string().optional(),
    startTime: Joi.date().optional(),
    endTime: Joi.date().optional(),
    status: Joi.string().valid(...StatusEnum).optional(),
}).concat(queryPaginationSchema);

export const updateStatusValidation = Joi.object({
    status: Joi.string().valid(...StatusEnum).required(),
})