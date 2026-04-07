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
        if(data.parentId){
            const parentArea = await prisma.serviceArea.findUnique({
                where:{ id: data.parentId }
            })
            if(!parentArea){ throw new AppError("Địa điểm cha không tồn tại", 404); }
        }
        const area = await prisma.serviceArea.create({ data });
        return area;
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
        return prisma.serviceArea.delete({
            where:{ id: Number(id) }
        })
    } 

    getAllAreas = async (data) =>{
        const where = {isActive: true}
        if(data.name){ where.name = { contains: data.name } }
        if(data.parentId !== undefined){ 
            if(data.parentId === 'null'){
                where.parentId = null;
            }else{
                where.parentId = Number(data.parentId);
            }
         }

        return await paginatePrisma(prisma.serviceArea, where, data, {children: true});
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