import paymentService from "./payment.service.js";
import { successResponse } from "../../utils/response.handle.js";

class PaymentController {

    async createPaymentUrl(req, res, next) {
        try {
            const user = req.user;
            const data = req.body;
            let ipAddr = req.ip ==='::1'? '127.0.0.1': req.ip;
            const paymentUrl = await paymentService.buildVNPayUrl(user, data, ipAddr);
            return successResponse(res, {
                message: "Tạo URL thanh toán VNPay thành công",
                data: { paymentUrl }
            });

        } catch (error) {
            next(error);
        }
    }

    async vnpayIPN(req, res, next) {
        try {
            const vnpayParams = req.query;
            const result = await paymentService.verifyAndProcessIPN(vnpayParams);
            if (result.isSuccess) {
                 return res.status(200).json({ RspCode: '00', Message: 'Confirm Success' });
            } else {
                 return res.status(200).json({ RspCode: '97', Message: 'Fail Checksum' });
            }
        } catch (error) {
            return res.status(200).json({ RspCode: '99', Message: 'Unknown error' });
        }
    }

    async vnpayReturn(req, res, next) {
        try {
            const vnpayParams = req.query;

            const result = await paymentService.verifyReturnUrl(vnpayParams);
            
            // Redirect thẳng về Frontend hoặc trả JSON tuỳ frontend handle
            // const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
            res.redirect(`http://localhost:5173/booking`);

            return successResponse(res, {
                message: "Kết quả thanh toán VNPay",
                data: result
            });
        } catch (error) {
            next(error);
        }
    }
}
export default new PaymentController();