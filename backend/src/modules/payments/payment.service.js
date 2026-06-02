import prisma from "../../config/prisma.js";
import AppError from "../../utils/app.error.js";
import HttpStatus from "../../utils/http.status.js";
import crypto from "crypto";
import checkRecordExist from "../../utils/check-exist.js";
import {io} from "../../socket/index.js";
function getVNPayDate(date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");
  return `${yyyy}${mm}${dd}${hh}${min}${ss}`;
}

function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      str.push(key);
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}
// 3. Cấu hình VNPay
const tmnCode = process.env.VNP_TMN_CODE;
const secretKey = process.env.VNP_HASH_SECRET;
const vnpUrl = process.env.VNP_URL;
const returnUrl = process.env.VNP_RETURN_URL;

class PaymentService {

  async buildVNPayUrl(user, data, ipAddr) {
    const { bookingId, method } = data;

    // 1. Kiểm tra Booking
    const booking = await checkRecordExist( prisma.booking, { id: bookingId }, undefined, "Không tìm thấy đơn đặt lịch", );
    if (booking.customerId !== user.id && user.role !== "admin") {
      throw new AppError(
        "Bạn không có quyền thanh toán đơn này",
        HttpStatus.FORBIDDEN,
      );
    }

    // Lưu ý: Nếu bạn cg db thì mở comment này
    if (booking.paymentStatus === "PAID") {
      throw new AppError("Đơn này đã được thanh toán", HttpStatus.BAD_REQUEST);
    }

    // Tạo mã giao dịch duy nhất
    const date = new Date();
    const txnRef = booking.id + "_" + date.getTime();

    // 2. Tạo record Payment
    const amount = Number(booking.totalAmount);
    await prisma.payment.create({
      data: {
        bookingId: booking.id,
        amount: amount,
        method: method,
        status: "PENDING",
        vnpayTnxRef: txnRef.toString(),
      },
    });

    const createDate = getVNPayDate(date);

    let vnp_Params = {};
    vnp_Params["vnp_Version"] = "2.1.0";
    vnp_Params["vnp_Command"] = "pay";
    vnp_Params["vnp_TmnCode"] = tmnCode;
    vnp_Params["vnp_Locale"] = "vn";
    vnp_Params["vnp_CurrCode"] = "VND";
    vnp_Params["vnp_TxnRef"] = txnRef;
    vnp_Params["vnp_OrderInfo"] = `Thanh toan don hang ${booking.id}`;
    vnp_Params["vnp_OrderType"] = "other";
    vnp_Params["vnp_Amount"] = amount * 100; // VNPay yêu cầu nhân 100
    vnp_Params["vnp_ReturnUrl"] = returnUrl;
    vnp_Params["vnp_IpAddr"] = ipAddr;
    vnp_Params["vnp_CreateDate"] = createDate;

    vnp_Params = sortObject(vnp_Params);

    const signData = Object.keys(vnp_Params).map((key) =>`${key}=${vnp_Params[key]}`).join('&');
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
    vnp_Params["vnp_SecureHash"] = signed;

    const paymentUrl =
      vnpUrl + "?" + Object.keys(vnp_Params).map(key => `${key}=${vnp_Params[key]}`).join("&");
    return paymentUrl;
  }
  
  async verifyAndProcessIPN(vnpayParams) {
    let params = { ...vnpayParams };
    let secureHash = params["vnp_SecureHash"];
    delete params["vnp_SecureHash"];
    delete params["vnp_SecureHashType"];

    params = sortObject(params);
    const signData = Object.keys(params).map((key) =>`${key}=${params[key]}`).join("&");
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
    if (secureHash === signed) {
      const txnRef = params["vnp_TxnRef"];
      const booking = await checkRecordExist( prisma.booking, { id: txnRef.split("_")[0] }, undefined, "Không tìm thấy đơn đặt lịch", );
      const responseCode = params["vnp_ResponseCode"];

      const payment = await prisma.payment.findFirst({
        where: { vnpayTnxRef: txnRef, status: "PENDING" },
        orderBy: { createdAt: "desc" },
      });

      if (responseCode === "00") {
        if (booking.paymentStatus !== "PAID") {
          if (payment) {
            await prisma.$transaction(async (tx) => {
              await tx.payment.update({
                where: { id: payment.id },
                data: {
                  status: "SUCCESS",
                  transactionId: vnpayParams["vnp_TransactionNo"],
                  paidAt: new Date(),
                  gatewayResponse: vnpayParams,
                },
              });
              await tx.booking.update({
                where: { id: payment.bookingId },
                data: {
                  paymentStatus: "PAID",
                },
              });
            });
            const booking = await checkRecordExist( prisma.booking, { id: payment.bookingId }, undefined, "Không tìm thấy đơn đặt lịch", );
            io.to(booking.customerId).emit("payment-success", {
              type: "PAYMENT_SUCCESS",
              bookingId: booking.id,
              message: "Thanh toán thành công",
            });
          } else {
            if (payment) {
              await prisma.payment.update({
                where: { vnpayTnxRef: txnRef },
                data: {
                  status: "OVERPAID_NEED_REFUND",
                  gatewayResponse: vnpayParams,
                },
              });
            }
          }
        }
        return { isSuccess: true };
      } else {
        if (payment) {
          await prisma.payment.update({
            where: { id: payment.id },
            data: {
              status: "FAILED",
              gatewayResponse: vnpayParams,
            },
          });
          const booking = await checkRecordExist( prisma.booking, { id: payment.bookingId }, undefined, "Không tìm thấy đơn đặt lịch", );
          io.to(booking.customerId).emit("payment-failed", {
            type: "PAYMENT_FAILED",
            bookingId: booking.id,
            message: "Thanh toán thất bại",
          });
        }
        return { isSuccess: true };
      }
    } else {
      return { isSuccess: false };
    }
  }
  
  async verifyReturnUrl(vnpayParams) {
    let secureHash = vnpayParams["vnp_SecureHash"];

    delete vnpayParams["vnp_SecureHash"];
    delete vnpayParams["vnp_SecureHashType"];
    const params = new URLSearchParams(vnpayParams);
    let obj = Object.fromEntries(params);
    obj = sortObject(obj);
    const signData = Object.keys(obj).map((key) => `${key}=${obj[key]}`).join("&");
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    const bookingId = obj["vnp_TxnRef"] ? obj["vnp_TxnRef"].split("_")[0] : null;

    if (secureHash === signed) {
      return {
        isSuccess: obj["vnp_ResponseCode"] === "00",
        bookingId: bookingId,
        vnpayParams: obj,
      };
    } else {
      throw new AppError("Chữ ký VNPay không hợp lệ", HttpStatus.BAD_REQUEST);
    }
  }
}
export default new PaymentService();
