import prisma from "../../config/prisma.js";
import { pagination } from "../../utils/response.handle.js";
import AppError from "../../utils/app.error.js";
import { paginatePrisma } from "../../helper/prisma.helper.js";
class AreaService {
    
    createArea = async (data) =>{
        const existArea = await prisma.serviceArea.findFirst({
            where:{ name: data.name, parentId: data.parentId }
        })
        if(existArea){ throw new AppError("Địa điểm đã tồn tại", 400); }
        data.path = '/';
        if(data.parentId){
            const parentArea = await prisma.serviceArea.findUnique({
                where:{ id: data.parentId }
            })
            if(!parentArea){ throw new AppError("Địa điểm cha không tồn tại", 404); }
            data.path = parentArea.path;
        }
        const area = await prisma.serviceArea.create({ data });
        const updatedArea  = await prisma.serviceArea.update({
            where:{ id: area.id },
            data:{ path: `${data.path}${area.id}/` }
        })
        return updatedArea;
    }

    updateArea = async (id, data) =>{
        const existArea = await prisma.serviceArea.findUnique({
            where:{ id: Number(id) }
        })
        if(!existArea){ throw new AppError("Địa điểm không tồn tại", 404); }
        const area = await prisma.serviceArea.update({
            where:{ id: Number(id) },
            data
        })
        return area;
    }

    deleteArea = async (id) =>{
        await prisma.serviceArea.deleteMany({
            where:{ path: { contains: `/${id}/` }, id: {not: Number(id)} },
        })
        return prisma.serviceArea.delete({
            where:{ id: Number(id) }
        })
    } 

    getAllAreas = async (data) =>{
        const where = {isActive: data.isActive}
        if(data.name){ where.name = { contains: data.name } }
        if(data.parentId !== 0 && data.parentId){
            where.parentId = Number(data.parentId);
        }
        else if(data.parentId !== 0){
            where.parentId = null;
        }
        return await paginatePrisma(prisma.serviceArea, where, data);
    }

    getAreaById = async (id) =>{
        return prisma.serviceArea.findUnique({
            where:{ id: Number(id) },
            include:{
                children: true,
                parent: true
            }
        })
    }
}

export default new AreaService();