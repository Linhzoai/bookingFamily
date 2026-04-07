import prisma from "../../config/prisma.js";
import AppError from "../../utils/app.error.js";
import { paginatePrisma } from "../../helper/prisma.helper.js";
import deleteFile from "../../helper/delete-file.helper.js";
class ServiceService{
    createService = async (data) =>{
        const existCategory = await prisma.serviceCategory.findUnique({
            where:{ id: data.categoryId }
        })
        if(!existCategory){ throw new AppError("Danh mục dịch vụ không tồn tại", 404); }
        const existService = await prisma.service.findFirst({
            where:{ name: data.name }
        })
        if(existService){ throw new AppError("Tên dịch vụ đã tồn tại", 400); }
        const service = await prisma.service.create({ data });
        return service;
    }

    updateService = async (id, data) =>{
        const existService = await prisma.service.findUnique({
            where:{ id: Number(id) }
        })
        if(!existService){ throw new AppError("Dịch vụ không tồn tại", 404); }
        if(data.category){
            const existCategory = await prisma.serviceCategory.findUnique({
                where:{ id: data.category }
            })
            if(!existCategory){ throw new AppError("Danh mục dịch vụ không tồn tại", 404); }
        }
        if(data.name){
            const existServiceByName = await prisma.service.findFirst({
                where:{ name: data.name, id: { not: id } }
            })
            if(existServiceByName){ throw new AppError("Tên dịch vụ đã tồn tại", 400); }
        }
        const oldImageUrl = existService?.imageUrl;
        const service = await prisma.service.update({
            where:{ id: Number(id) },
            data
        })
        if(oldImageUrl){
            deleteFile(oldImageUrl);
        }
        return service;
    }

    deleteService = async (id) =>{
        return prisma.service.delete({
            where:{ id: Number(id) }
        })
    }

    getAllServices = async (data) =>{
        const where = {
            active: data.active
        };
        if(data.name){
            where.name = { contains: data.name };
        }
        if(data.description){
            where.description = { contains: data.description };
        }
        if(data.price){
            where.price = { gte: data.price };
        }
        if(data.duration){
            where.duration = { gte: data.duration };
        }
        if(data.categoryId){
            where.categoryId = data.categoryId;
        }
        return await paginatePrisma(prisma.service, where, data);
    }

    getServiceById = async (id) =>{
        const existService = await prisma.service.findUnique({
            where:{ id: Number(id) }
        })
        if(!existService){ throw new AppError("Dịch vụ không tồn tại", 404); }
        return existService;
    }
}

export default new ServiceService();