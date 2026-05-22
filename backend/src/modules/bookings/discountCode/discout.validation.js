import Joi from "joi";
import { queryPaginationSchema } from "#helper/joi.helper.js";

const DISCOUNT_TYPE = ["percentage", "fixed"];
export const createSchema = Joi.object({
    code: Joi.string().required(),
    description: Joi.string().optional(),
    discountType: Joi.string().valid(...DISCOUNT_TYPE).required(),
    discountValue: Joi.number().required(),
    minBookingAmount: Joi.number().optional().default(0),
    maxDiscountAmount: Joi.number().optional(),
    startDate: Joi.date().required(),
    endDate: Joi.date().optional(),
    usageLimit: Joi.number().optional().default(null).allow(null),
    usedCount: Joi.number().optional().default(0),
    isActive: Joi.boolean().optional().default(true),
});

export const updateSchema = Joi.object({
    code: Joi.string().optional(),
    description: Joi.string().optional(),
    discountType: Joi.string().optional(),
    discountValue: Joi.number().optional(),
    minBookingAmount: Joi.number().optional().default(0),
    maxDiscountAmount: Joi.number().optional(),
    startDate: Joi.date().optional(),
    endDate: Joi.date().optional(),
    usageLimit: Joi.number().optional().default(null).allow(null),
    usedCount: Joi.number().optional().default(0),
    isActive: Joi.boolean().optional().default(true),
});

export const deleteSchema = Joi.object({
    id: Joi.string().required(),
});

export const getByIdSchema = Joi.object({
    id: Joi.string().required(),
});

export const getAllSchema = Joi.object({
    code: Joi.string().optional(),
    discountType: Joi.string().optional(),
    startDate: Joi.date().optional(),
    endDate: Joi.date().optional(),
    isActive: Joi.boolean().optional().default(true),
}).concat(queryPaginationSchema);