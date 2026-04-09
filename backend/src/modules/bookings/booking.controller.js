import BookingService from "./booking.service.js";
import catchAsync from "../../utils/catch.async.js";
class BookingController{
    //[POST] /api/v1/bookings
    createBooking = catchAsync(async (req, res, next) =>{
        const booking = await BookingService.createBooking(req.body)
        res.status(201).json({
            success: true,
            message: "Tạo đơn hàng thành công",
            data: booking
        })
    })

    //[PUT] /api/v1/bookings/:id
    updateBooking = catchAsync(async (req, res, next) =>{
        const booking = await BookingService.updateBooking(req.params.id, req.body)
        res.status(200).json({
            success: true,
            message: "Cập nhật đơn hàng thành công",
            data: booking
        })
    })

    //[DELETE] /api/v1/bookings/:id
    deleteBooking = catchAsync(async (req, res, next) =>{
        const booking = await BookingService.deleteBooking(req.params.id)
        res.status(200).json({
            success: true,
            message: "Xóa đơn hàng thành công",
            data: booking
        })
    })

    //[GET] /api/v1/bookings/:id
    getBookingById = catchAsync(async (req, res, next) =>{
        const booking = await BookingService.getBookingById(req.params.id)
        res.status(200).json({
            success: true,
            message: "Lấy đơn hàng thành công",
            data: booking
        })
    })

    //[GET] /api/v1/bookings
    getBooking = catchAsync(async (req, res, next) =>{
        console.log(req.validatedQuery);
        const bookings = await BookingService.getBooking(req.validatedQuery)
        res.status(200).json({
            success: true,
            message: "Lấy danh sách đơn hàng thành công",
            data: bookings
        })
    })

    //[GET] /api/v1/bookings/:id/progress
    getProgressNow = catchAsync(async (req, res, next) => {
        const booking = await BookingService.getProgressNow(req.params.id)
        res.status(200).json({
            success: true,
            message: "Lấy tiến độ thành công",
            data: booking
        })
    })
}

export default new BookingController()