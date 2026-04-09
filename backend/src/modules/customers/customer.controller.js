import catchAsync from "../../utils/catch.async.js";
import CustomerService from "./customer.service.js";

class CustomerController{
    //[GET] /api/v1/customers
    getCustomers = catchAsync(async (req, res, next) => {
        const customers = await CustomerService.getCustomers(req.validatedQuery);
        res.status(200).json({
            success: true,
            message: "Lấy danh sách khách hàng thành công",
            data: customers
        })
    })

    //[GET] /api/v1/customers/:id
    getCustomerById = catchAsync(async (req, res, next) => {
        const customer = await CustomerService.getCustomerById(req.params.id);
        res.status(200).json({
            success: true,
            message: "Lấy thông tin khách hàng thành công",
            data: customer
        })
    })
}

export default new CustomerController()