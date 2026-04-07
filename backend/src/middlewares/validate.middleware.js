import { errorResponse } from "../utils/response.handle.js";

const validateMiddleware = (schema, source = "body") => {
  return (req, res, next) => {
    const data = req[source];
    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
      messages: {
        "string.empty": "{#label} không được để trống",
        "any.required": "{#label} là bắt buộc",
        "string.email": "{#label} không đúng định dạng email",
        "string.min": "{#label} phải có ít nhất {#limit} ký tự",
        "string.max": "{#label} phải có tối đa {#limit} ký tự",
        "number.min": "{#label} phải lớn hơn hoặc bằng {#limit}",
        "number.max": "{#label} phải nhỏ hơn hoặc bằng {#limit}",
      },
    });
    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }));
      return errorResponse(res, {
        message: "Dữ liệu không hợp lệ",
        code: 400,
        errors,
      });
    }
    if (source === "body") {
      req.body = value;
    } else if (source === "query") {
      req.validatedQuery = value;
    } else if (source === "params") {
      req.params = value;
    }
    next();
  };
};

export default validateMiddleware;
