import BookingService from "./booking.service.js";
import catchAsync from "../../utils/catch.async.js";
import { findEligibleStaffs } from "../dispatch/dispatch.service.js";
import { dispatchQueue  } from "../dispatch/dispatch.worker.js";

class BookingController{
    //[POST] /api/v1/bookings
    createBooking = catchAsync(async (req, res, next) =>{
        const booking = await BookingService.createBooking(req.body)
        const eligibleStaffs = await findEligibleStaffs(booking.areaId,booking.scheduledTime, booking.expectedEndTime);
        if(eligibleStaffs.length > 0){
            await dispatchQueue.add('processNext', {
                bookingId: booking.id,
                staffList: eligibleStaffs,
                currentIndex: 0
            });
        }
        else{
            console.log("No staff available at the moment");
        }
        res.status(201).json({ success: true, message: "Tạo đơn hàng thành công", data: booking })
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
        const bookings = await BookingService.getBooking(req.validatedQuery)
        const bookingsFormat = bookings.data.map((booking) => {
            return {
                ...booking,
                staff: booking.staffAssignments.find((assignment) =>assignment.status !== 'rejected')?.staff || null,
                staffAssignments: booking.staffAssignments.filter((assignment) =>{
                    if(assignment.status !== 'rejected') return assignment
                }),
            }
        })
        const { data, ...pageData } = bookings;
        res.status(200).json({
            success: true,
            message: "Lấy danh sách đơn hàng thành công",
            data: {data: bookingsFormat, ...pageData}
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

    getBookingIdsForSocketIO = async (userId) =>{
        const bookingsIds = await BookingService.getBookingIdForSocketId(userId)
        return bookingsIds.map((b)=> b.id);
    }

    getEligibleStaffs = catchAsync(async (req, res, next) => {
        const booking = await BookingService.getBookingById(req.params.bookingId)
        const staffs = await findEligibleStaffs(booking.areaId,booking.scheduledTime, booking.expectedEndTime)
        res.status(200).json({
            success: true,
            message: "Lấy danh sách nhân viên thành công",
            data: staffs
        })
    })
}

export default new BookingController()