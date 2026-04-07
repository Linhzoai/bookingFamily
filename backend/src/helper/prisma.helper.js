import { pagination } from "../utils/response.handle.js";
export const paginatePrisma = async (module, query, filter, include = {}) =>{
    const {page, limit, orderBy, order} = filter;
    const skip = (page - 1) * limit;
    const result = await module.findMany({
        where: query,
        skip,
        take: Number(limit),
        orderBy:{
            [orderBy]: order
        },
        include
    })
    const totalRecords = await module.count({
        where: query
    })
    const totalPages = Math.ceil(totalRecords / limit)
    const pageData = pagination(page, limit, totalPages, totalRecords)
    return {data: result, ...pageData}
}   