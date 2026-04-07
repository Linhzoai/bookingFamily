import Joi from "joi";
import  {queryPaginationSchema} from "../../helper/joi.helper.js";
export const createServiceSchema = Joi.object({
    name: Joi.string().required().min(3).max(50),
    description: Joi.string().required().min(3).max(500),
    price: Joi.number().required().min(0),
    duration: Joi.number().required().min(0),
    categoryId: Joi.number().required(),
    imageUrl: Joi.string().optional().min(3).max(500),
    active: Joi.boolean().optional().default(true),
});

export const updateServiceSchema = Joi.object({
    name: Joi.string().optional().empty('').min(3).max(50),
    description: Joi.string().optional().empty('').min(3).max(500),
    price: Joi.number().optional().empty('').min(0),
    duration: Joi.number().optional().empty('').min(0),
    categoryId: Joi.number().optional().empty(''),
    imageUrl: Joi.string().optional().empty('').min(3).max(500),
    active: Joi.boolean().optional().default(true),
});

export const getServicesSchema = Joi.object({
    name: Joi.string().optional().min(3).max(50),
    description: Joi.string().optional().min(3).max(500),
    price: Joi.number().optional().min(0),
    duration: Joi.number().optional().min(0),
    categoryId: Joi.number().optional(),
    imageUrl: Joi.string().optional().min(3).max(500),
    active: Joi.boolean().default(true),
}).concat(queryPaginationSchema);