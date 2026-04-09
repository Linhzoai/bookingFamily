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
        const include = { area: true };
        return paginatePrisma(prisma.user, query, data, include);
    }

    getCustomerById = async (id) =>{
        const customer = checkRecordExist(prisma.user, {id, role: 'customer'}, {area: true}, 'Khách hàng không tồn tại');
        return customer;
    }

}

export default new CustomerService();