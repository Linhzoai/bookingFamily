import Joi from 'joi';
import { queryPaginationSchema } from '../../helper/joi.helper.js';

export const paramsValidation = Joi.object({
    id: Joi.string().required().label("Mã khách hàng")
})

export const queryValidation = Joi.object({
    name: Joi.string().optional().label("Tên khách hàng").empty(''),
    phone: Joi.string().optional().label("Số điện thoại").empty(''),
    email: Joi.string().optional().label("Email").empty(''),
    address: Joi.string().optional().label("Địa chỉ").empty(''),
    areaId: Joi.number().optional().label("Mã khu vực").empty(''),
    status: Joi.string().optional().label("Trạng thái").empty(''),     
}).concat(queryPaginationSchema)