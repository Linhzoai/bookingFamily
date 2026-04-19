import prisma from "../../config/prisma.js";
import { pagination } from "../../utils/response.handle.js";
import checkRecordExist from "../../utils/check-exist.js";
import {paginatePrisma} from "../../helper/prisma.helper.js";
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
    return {data:staffList, ...pagination(page, limit, totalPages, totalRecords)};
  };

  //Xóa nhân viên
  deleteStaff = async (id) => {
    const staffProfile = await prisma.user.delete({ where: { id } });
    return staffProfile;
  };

  getJob = async (id, data) =>{
    const staff = await checkRecordExist(prisma.user, {id});
    const query = {staffId: id};
    if(data.status) query.status = data.status;
    if(data.assignedAt) query.assignedAt = {
      gte: new Date(data.assignedAt),
    };
    console.log(data);
    const jobs = paginatePrisma(prisma.staffAssignment, query, data, {
      booking: true,
      staff: true,
    });
    return jobs;
  }

  updateJob = async (id, status) =>{
    return await prisma.$transaction(async (tx)=>{
      const updateStaffAssignment = await tx.staffAssignment.update({
        where: {id: id},
        data: {status: status}
      })
      if(status === "accepted"){
        await tx.booking.update({
          where: {id: updateStaffAssignment.bookingId},
          data: {status: "accepted"}
        })
      }
      if(status === "completed"){
        await tx.booking.update({
          where: {id: updateStaffAssignment.bookingId},
          data: {status: "completed"}
        })
      }
      return updateStaffAssignment;
    })
  }
}

export default new StaffService();
