import prisma from "#config/prisma.js";

export const findEligibleStaffs = async (areaId, startTime, expectedEndTime) => {
    //1. Lấy thông tin khu vực hoạt động
    console.log(areaId, startTime, expectedEndTime)
    const ward = await prisma.serviceArea.findUnique({where: {id: areaId}});
    const district = ward?.parentId ? await prisma.serviceArea.findUnique({where: {id: ward.parentId}}) : null;
    const city = district?.parentId ? await prisma.serviceArea.findUnique({where: {id: district.parentId}}) : null;
    const areaIds = [ward?.id, district?.id, city?.id].filter(Boolean)

    //2. Tìm kiếm nhân viên thỏa mãn điều kiện
    const avaiableStaffs = await prisma.user.findMany({
        where: {
            role: 'staff',
            status: 'active',
            staffProfile: {
                status: {in: ['active', 'approved']},
                currentAvailability: 'available',
            },
            //đang làm việc ở khu vực liên quan
            staffServiceAreas:{
                some: {areaId: {in: areaIds}}
            },
            leaveRequests:{
                none: {
                    status: 'approved',
                    startTime: {lt: expectedEndTime},
                    endTime: {gt: startTime},
                }
            },
            //Không có công việc đang làm hoặc đã trùng thời gian
            staffAssignments: {
                none: {
                    status: {in: ['assigned', 'accepted', 'in_progress']},
                    booking: {
                        scheduledTime: {lt: expectedEndTime},
                        expectedEndTime: {gt: startTime},
                    }
                }
            }
        },
        include: {
            staffServiceAreas: true,
        }
    })

    //Chấm điểm để sắp xếp ưu tiên
    const sortedStaffs  = avaiableStaffs.sort((a,b)=>{
        const getAreaScore = staff =>{
            const areas = staff.staffServiceAreas.map(sa=> sa.areaId);
            if(ward && areas.includes(ward.id)) return 3;
            if(district && areas.includes(district.id)) return 2;
            if(city && areas.includes(city.id)) return 1;
            return 0;
        };
        return getAreaScore(b) - getAreaScore(a);
    })
    return sortedStaffs 
}

