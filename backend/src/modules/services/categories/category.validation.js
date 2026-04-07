import Joi from "joi";
import  {queryPaginationSchema} from "../../../helper/joi.helper.js";
export const createCategorySchema = Joi.object({
    name: Joi.string().required().min(3).max(50).trim(),
    description: Joi.string().required().min(3).max(255).trim(),
})

export const updateCategorySchema = Joi.object({
    name: Joi.string().optional().min(3).max(50).trim(),
    description: Joi.string().optional().min(3).max(255).trim(),
})

export const getCategoriesSchema = Joi.object({
    name: Joi.string().optional().min(3).max(50).trim(),
    description: Joi.string().optional().min(3).max(255).trim(),
}).concat(queryPaginationSchema);