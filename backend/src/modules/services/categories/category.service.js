import prisma from "../../../config/prisma.js";
import AppError from "../../../utils/app.error.js";
import { paginatePrisma } from "../../../helper/prisma.helper.js";
class CategoryService {
    createCategory = async (data) =>{
        const existCategory = await prisma.serviceCategory.findFirst({
            where:{ name: data.name }
        })
        if(existCategory){ throw new AppError("Danh mục đã tồn tại", 400); }
        const category = await prisma.serviceCategory.create({ data });
        return category;
    }

    updateCategory = async (id, data) =>{
        if(!data.name && !data.description){ 
            throw new AppError("Không có dữ liệu nào để câp nhật", 400); 
        }
        const existCategory = await prisma.serviceCategory.findUnique({
            where:{ id: Number(id) }
        })
        if(!existCategory){ throw new AppError("Danh mục không tồn tại", 404); }
        if(data.name){
            const existCategoryByName = await prisma.serviceCategory.findFirst({
                where:{ name: data.name, id: { not: id } }
            })
            if(existCategoryByName){ throw new AppError("Tên danh mục đã tồn tại", 400); }
        }
        const category = await prisma.serviceCategory.update({
            where:{ id: Number(id) },
            data
        })
        return category;
    }

    deleteCategory = async (id) =>{
        const existCategory = await prisma.serviceCategory.findUnique({
            where:{ id: Number(id) }
        })
        if(!existCategory){ throw new AppError("Danh mục không tồn tại", 404); }
        return prisma.serviceCategory.delete({
            where:{ id: Number(id) }
        })
    }

    getAllCategories = async (data) =>{
        const where = {
            isActive: data.isActive
        };
        if(data.name){
            where.name = { contains: data.name };
        }
        if(data.description){
            where.description = { contains: data.description };
        }
        return await paginatePrisma(prisma.serviceCategory, where, data);
    }

    getCategoryById = async (id) =>{
        const existCategory = await prisma.serviceCategory.findUnique({
            where:{ id: Number(id) }
        })
        if(!existCategory){ throw new AppError("Danh mục không tồn tại", 404); }
        return existCategory;
    }
}

export default new CategoryService();