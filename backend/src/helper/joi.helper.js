import Joi from "joi";

export const queryPaginationSchema = Joi.object({
    search: Joi.string().optional(),
    page: Joi.number().optional().default(1),
    limit: Joi.number().optional().default(10),
    orderBy: Joi.string().optional().default("createdAt"),
    order: Joi.string().optional().default("desc"),
});
