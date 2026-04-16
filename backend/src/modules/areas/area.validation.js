import Joi from "joi";
import  {queryPaginationSchema} from "../../helper/joi.helper.js";
export const createAreaSchema = Joi.object({
    name: Joi.string().required().min(3).max(50),
    parentId: Joi.number().allow(null).optional().default(null),
    isActive: Joi.boolean().default(true),

});

export const updateAreaSchema = Joi.object({
    name: Joi.string().min(3).max(50).optional(),
    parentId: Joi.number().allow(null).optional(),
    isActive: Joi.boolean().optional(),
});

export const getAreasSchema = Joi.object({
    name: Joi.string().optional().min(3).max(50),
    parentId: Joi.number().allow(null).optional(),
    isActive: Joi.boolean().optional().default(true),
}).concat(queryPaginationSchema);