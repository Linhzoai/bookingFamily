import Joi from "joi";

export const createPaymentSessionSchema = Joi.object({
    bookingId: Joi.string().required("Booking ID không được để tróng"),
    method: Joi.string().valid("VNPAY", "MOMO", "CASH").required("Phương thức thanh toán không hợp lệ"),
    status: Joi.string().valid("PENDING", "SUCCESS", "FAILED", "REFUNDED").default("PENDING"),  
});