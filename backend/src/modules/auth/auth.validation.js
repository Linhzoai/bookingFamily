import Joi from "joi";

export const signUpSchema = Joi.object({
  name: Joi.string().required().min(3).max(30),
  email: Joi.string().email().required(),
  password: Joi.string()
    .required()
    .min(6)
    .max(30)
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    )
    .messages({
      "string.pattern.base":
        "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt",
    }),
  phone: Joi.string()
    .required()
    .length(10)
    .pattern(/^[0-9]+$/),
  address: Joi.string().required(),
  areaId: Joi.number().required(),
  role: Joi.string().valid("staff", "admin", "customer").required(),
  gender: Joi.string().valid("male", "female", "other").required(),
});

export const signInSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required().min(6).max(30),
});

export const fetchUserByIdSchema = Joi.object({
  id: Joi.string().required(),
});

export const updateUserSchema = Joi.object({
  name: Joi.string().optional().empty("").min(3).max(30),
  email: Joi.string().email().optional().empty(""),
  phone: Joi.string()
    .optional()
    .empty("")
    .length(10)
    .pattern(/^[0-9]+$/),
  address: Joi.string().optional().empty(""),
  areaId: Joi.number().optional().empty(""),
  gender: Joi.string().valid("male", "female", "other").optional().empty(""),
});

export const updateStatusSchema = Joi.object({
  status: Joi.string().valid("active", "locked").required(),
});
