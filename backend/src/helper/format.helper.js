import prisma from "../config/prisma.js";
export const formatArea = async (id) => {
    if (!id) return ""; // Tránh trường hợp id undefined truyền vào
    let currentId = id;
    const areaNames = [];
    while(currentId){
        const area = await prisma.serviceArea.findUnique({where: {id: currentId}, select: {name: true, parentId:true}});
        if(!area) break;
        areaNames.push(area.name);
        currentId = area.parentId;
    }
    return areaNames.join(", ");  
}