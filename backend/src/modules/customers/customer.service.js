import prisma from "../../config/prisma.js";
import { paginatePrisma } from "../../helper/prisma.helper.js";
import checkRecordExist from '../../utils/check-exist.js'
class CustomerService{
    getCustomers = async (data) => {
        const query = {role: 'customer'};
        if (data.name) query.name = { contains: data.name };
        if (data.phone) query.phone = { contains: data.phone };
        if (data.email) query.email = { contains: data.email };
        if (data.address) query.address = { contains: data.address };
        if (data.areaId) query.areaId = data.areaId;
        if (data.status) query.status = data.status;
        const include = { _count: { select: { bookings: true } }, area: true };
        const result = await paginatePrisma(prisma.user, query, data, include);
        
        result.data = await Promise.all(result.data.map(async (customer) => {
            const aggregate = await prisma.booking.aggregate({
                _sum: { totalAmount: true },
                where: { customerId: customer.id, status: 'Completed' },
            });
            return {
                ...customer,
                totalSpent: aggregate._sum.totalAmount || 0
            };
        }));

        return result;
    }

    getCustomerById = async (id) =>{
        const customer = checkRecordExist(prisma.user, {id, role: 'customer'}, {area: true}, 'Khách hàng không tồn tại');
        return customer;
    }

}

export default new CustomerService();