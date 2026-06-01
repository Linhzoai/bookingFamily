import prisma from "../../config/prisma.js";
import { pagination } from "../../utils/response.handle.js";
import checkRecordExist from "../../utils/check-exist.js";
import { paginatePrisma } from "../../helper/prisma.helper.js";
class StaffService {
  //Thêm thông tin nhân viên
  addProfile = async (id, data) => {
    const user = await prisma.user.findUniqueOrThrow({ where: { id } });
    const staffProfile = await prisma.staffProfile.create({
      data: {
        staffId: id,
        idCardNumber: data.cardNumber,
        skills: data.skills,
        experience: data.experience,
        review: data.review,
        hireDate: new Date(Date.now()),
        status: "approved",
      },
    });
    user.status = "active";
    await prisma.user.update({ where: { id }, data: user });
    return staffProfile;
  };

  //Lấy thông tin nhân viên
  getProfile = async (id) => {
    const staffProfile = await prisma.staffProfile.findUniqueOrThrow({
      where: { staffId: id },
      include: {
        staff: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            gender: true,
            address: true,
          },
        },
      },
    });
    return staffProfile;
  };

  //Cập nhật thông tin nhân viên
  updateProfile = async (id, data) => {
    const staffProfile = await prisma.staffProfile.update({
      where: { staffId: id },
      data: data,
    });
    return staffProfile;
  };

  //Cập nhật trạng thái nhân viên
  updateStatus = async (id, status) => {
    const staffProfile = await prisma.staffProfile.findUniqueOrThrow({
      where: { staffId: id },
    });
    staffProfile.status = status;
    await prisma.staffProfile.update({
      where: { staffId: id },
      data: staffProfile,
    });
    return staffProfile;
  };

  //Xóa thông tin nhân viên
  deleteProfile = async (id) => {
    const staffProfile = await prisma.staffProfile.delete({
      where: { staffId: id },
    });
    return staffProfile;
  };

  //Lấy danh sách nhân viên
  getStaffList = async (data) => {
    const { page, limit, search, sort, order } = data;
    const skip = (page - 1) * limit;
    const staffList = await prisma.user.findMany({
      where: { role: "staff", name: { contains: search } },
      include: {
        staffProfile: true,
        area: true,
      },
      skip,
      take: limit,
      orderBy: {
        [sort]: order,
      },
    });
    const totalRecords = await prisma.user.count({
      where: { role: "staff", name: { contains: search } },
    });
    const totalPages = Math.ceil(totalRecords / limit);
    return {
      data: staffList,
      ...pagination(page, limit, totalPages, totalRecords),
    };
  };

  //Xóa nhân viên
  deleteStaff = async (id) => {
    const staffProfile = await prisma.user.delete({ where: { id } });
    return staffProfile;
  };

  //Lấy danh sách công việc
  getJob = async (id, data) => {
    const staff = await checkRecordExist(prisma.user, { id });
    const query = { staffId: id };
    if (data.status) query.status = data.status;
    if (data.assignedAt) query.assignedAt = { gte: new Date(data.assignedAt) };
    const include =  {
      booking: {
        select: {
          id: true,
          scheduledTime: true,
          expectedEndTime: true,
          address: true,
          totalAmount: true,
          status: true,
          note: true,
          // Chỉ lấy các trường cần thiết của customer, tuyệt đối KHÔNG lấy hashPassword
          customer: {
            select: {
              id: true,
              name: true,
              phone: true,
              avatarUrl: true,
            }
          },
          // Lấy chi tiết dịch vụ (chỉ cần tên, giá, thời lượng)
          bookingDetails: {
            select: {
              quantity: true,
              unitPrice: true,
              service: {
                select: {
                  id: true,
                  name: true,
                  duration: true,
                  imageUrl: true
                }
              }
            }
          }
        }
      }
    };
    const jobs = paginatePrisma(prisma.staffAssignment, query, data, include);
    return jobs;
  };

  //Cập nhật công việc
  updateJob = async (id, status) => {
    return await prisma.$transaction(async (tx) => {
      // const staffAssignment = await tx.staffAssignment.findUniqueOrThrow({where: {id: id}});
      // console.log(staffAssignment);
      const updateStaffAssignment = await tx.staffAssignment.update({
        where: { id: Number(id) },
        data: { status: status },
      });

      if (status === "accepted") {
        await tx.booking.update({
          where: { id: updateStaffAssignment.bookingId },
          data: { status: "accepted" },
        });
      }
      if (status === "completed") {
        await tx.booking.update({
          where: { id: updateStaffAssignment.bookingId },
          data: { status: "completed" },
        });
      }
      return updateStaffAssignment;
    });
  };

  //Thêm khu vực làm việc
  addArea = async (data) => {
    const staff = await checkRecordExist(prisma.user, { id: data.staffId });
    const area = await checkRecordExist(prisma.serviceArea, {
      id: Number(data.areaId),
    });
    const staffArea = await prisma.$transaction(async (tx) => {
      if (data.primaryArea) {
        await tx.staffServiceArea.updateMany({
          where: { staffId: data.staffId },
          data: { primaryArea: false },
        });
      }

      const createStaffArea = await tx.staffServiceArea.create({
        data: {
          staffId: data.staffId,
          areaId: Number(data.areaId),
          primaryArea: data.primaryArea,
        },
        include: {
          area: true,
        },
      });
      return createStaffArea;
    });
    return staffArea;
  };

  //Xóa khu vực làm việc
  deleteArea = async (data) => {
    const staff = await checkRecordExist(prisma.user, { id: data.staffId });
    const area = await checkRecordExist(prisma.area, { id: data.areaId });
    const staffArea = await prisma.staffArea.delete({
      where: { staffId_areaId: { staffId: data.staffId, areaId: data.areaId } },
    });
    return staffArea;
  };

  //Lấy danh sách khu vực làm việc
  getAreaOfStaff = async (id) => {
    // 1. Kiểm tra tồn tại
    const staff = await checkRecordExist(prisma.user, { id });

    // 2. Query lồng nhau (Nested Include) để lấy 3 cấp
    const staffServiceAreas = await prisma.staffServiceArea.findMany({
      where: { staffId: id },
      include: {
        area: {
          include: {
            parent: {
              include: {
                parent: true, // Cấp 3 (Thành phố)
              },
            },
          },
        },
      },
    });
    // 3. Format lại dữ liệu trả về
    const formattedAreas = staffServiceAreas.map((record) => {
      const currentArea = record.area;
      const parentArea = currentArea?.parent;
      const grandParentArea = parentArea?.parent;

      // Gom tên các cấp lại thành mảng [Phường, Quận, Thành phố]
      // filter(Boolean) dùng để xóa đi những giá trị null/undefined
      // (ví dụ nếu nhân viên đó chỉ đăng ký tới cấp Quận thì mảng trả về sẽ chỉ có [Quận, Thành phố])
      return {
        areaId: record.areaId,
        area: [
          currentArea?.name,
          parentArea?.name,
          grandParentArea?.name,
        ].filter(Boolean),
      };
    });

    return formattedAreas;
  };
}

export default new StaffService();
