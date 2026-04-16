import Joi from "joi";
export const addProfileSchema = Joi.object({
    cardNumber: Joi.string().required().min(9).max(12).pattern(/^[0-9]+$/),
    skills: Joi.string().required(),
    experience: Joi.string().required(),
    review: Joi.string().optional(),
});

export const updateProfileSchema = Joi.object({
    cardNumber: Joi.string().min(9).max(12).pattern(/^[0-9]+$/).optional(),
    skills: Joi.string().optional(),
    experience: Joi.string().optional(),
    review: Joi.string().optional(),
    currentAvailability: Joi.string().valid("available", "busy", "offline").optional(),
});

export const updateStatusSchema = Joi.object({
    status: Joi.string().valid("active", "on_leave", "terminated").required(),
});

export const checkParamSchema = Joi.object({
    id: Joi.string().required(),
});

export const getStaffListSchema = Joi.object({
    page: Joi.number().optional().default(1),
    limit: Joi.number().optional().default(10),
    search: Joi.string().optional().default(""),
    sort: Joi.string().valid("name", "createdAt", "email", "status").default("createdAt"),
    order: Joi.string().valid("asc", "desc").default("desc"),
});

export const getJobSchema = Joi.object({
    status: Joi.string().valid("accepted", "rejected", "assigned", "completed").optional(),
    assignedAt: Joi.date().optional(),
}).concat(getStaffListSchema);

export const updateJobSchema = Joi.object({
    status: Joi.string().valid("accepted", "rejected", "assigned", "completed").required(),
});
