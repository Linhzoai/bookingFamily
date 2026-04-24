import joi from "joi";

export const queryRevenue = joi.object({
    groupBy: joi.string().valid("day","month","year").default("day").optional(),
    from : joi.date(),
    to : joi.date(),
    status: joi.string().valid('completed','cancelled','ordered','all').optional().default('all')
    
})
export const queryRevenueByPartner = joi.object({
    groupBy: joi.string().valid("day","month","year").default("year").optional(),
    from : joi.date().optional(),
    to : joi.date().optional(),
    status: joi.string().valid('completed','cancelled','ordered','all').optional().default('all')
})