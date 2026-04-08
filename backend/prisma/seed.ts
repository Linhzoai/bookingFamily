import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";

// ========================
// Khởi tạo Prisma Client
// ========================
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // 👈 Thêm đúng đoạn SSL này vào
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });


// ========================
// Hàm hash password
// ========================
async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

// ========================
// SEED DATA
// ========================
async function main() {
  console.log("🌱 Bắt đầu seed dữ liệu...\n");

  // ----------------------------
  // 1. Tạo khu vực dịch vụ
  // ----------------------------
  console.log("📍 Tạo khu vực dịch vụ...");

  const hcm = await prisma.serviceArea.create({
    data: { name: "TP. Hồ Chí Minh" },
  });

  const hanoi = await prisma.serviceArea.create({
    data: { name: "TP. Hà Nội" },
  });

  // Quận/Huyện thuộc HCM
  const quan1 = await prisma.serviceArea.create({
    data: { name: "Quận 1", parentId: hcm.id },
  });
  const quan3 = await prisma.serviceArea.create({
    data: { name: "Quận 3", parentId: hcm.id },
  });
  const quan7 = await prisma.serviceArea.create({
    data: { name: "Quận 7", parentId: hcm.id },
  });
  const binhThanh = await prisma.serviceArea.create({
    data: { name: "Quận Bình Thạnh", parentId: hcm.id },
  });
  const thuDuc = await prisma.serviceArea.create({
    data: { name: "TP. Thủ Đức", parentId: hcm.id },
  });

  // Quận/Huyện thuộc Hà Nội
  const cauGiay = await prisma.serviceArea.create({
    data: { name: "Quận Cầu Giấy", parentId: hanoi.id },
  });
  const dongDa = await prisma.serviceArea.create({
    data: { name: "Quận Đống Đa", parentId: hanoi.id },
  });

  console.log("  ✅ Đã tạo khu vực dịch vụ\n");
  // ----------------------------
  // 2. Tạo ServiceCategory
  // ----------------------------
  console.log("📦 Tạo danh mục dịch vụ...");

  const serviceCategory1 = await prisma.serviceCategory.create({
    data: { name: "Vệ sinh nhà cửa", description: "Dịch vụ vệ sinh nhà cửa" },
  });

  const serviceCategory2 = await prisma.serviceCategory.create({
    data: { name: "Chăm sóc thú cưng", description: "Dịch vụ chăm sóc thú cưng" },
  });

  const serviceCategory3 = await prisma.serviceCategory.create({
    data: { name: "Chăm sóc cây cảnh", description: "Dịch vụ chăm sóc cây cảnh" },
  });

  console.log("  ✅ Đã tạo danh mục dịch vụ\n");

  // ----------------------------
  // 3. Tạo Users (Admin, Staff, Customer)
  // ----------------------------
  console.log("👤 Tạo tài khoản người dùng...");

  const defaultPassword = await hashPassword("123456");

  // Admin
  const admin = await prisma.user.create({
    data: {
      role: "admin",
      name: "Nguyễn Văn Admin",
      email: "admin@bookingfamily.com",
      phone: "0901000001",
      hashPassword: defaultPassword,
      address: "123 Nguyễn Huệ, Quận 1",
      areaId: quan1.id,
    },
  });

  // Khách hàng
  const customer1 = await prisma.user.create({
    data: {
      role: "customer",
      name: "Trần Thị Hoa",
      email: "hoa.tran@gmail.com",
      phone: "0912345678",
      hashPassword: defaultPassword,
      address: "456 Lê Lợi, Quận 1",
      areaId: quan1.id,
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      role: "customer",
      name: "Lê Minh Tuấn",
      email: "tuan.le@gmail.com",
      phone: "0923456789",
      hashPassword: defaultPassword,
      address: "789 Nguyễn Trãi, Quận 3",
      areaId: quan3.id,
    },
  });

  const customer3 = await prisma.user.create({
    data: {
      role: "customer",
      name: "Phạm Thanh Mai",
      email: "mai.pham@gmail.com",
      phone: "0934567890",
      hashPassword: defaultPassword,
      address: "321 Phạm Văn Đồng, Thủ Đức",
      areaId: thuDuc.id,
    },
  });

  // Nhân viên
  const staff1 = await prisma.user.create({
    data: {
      role: "staff",
      name: "Nguyễn Thị Lan",
      email: "lan.nguyen@bookingfamily.com",
      phone: "0945678901",
      hashPassword: defaultPassword,
      address: "111 Nguyễn Văn Linh, Quận 7",
      areaId: quan7.id,
    },
  });

  const staff2 = await prisma.user.create({
    data: {
      role: "staff",
      name: "Võ Văn Hùng",
      email: "hung.vo@bookingfamily.com",
      phone: "0956789012",
      hashPassword: defaultPassword,
      address: "222 Xô Viết Nghệ Tĩnh, Bình Thạnh",
      areaId: binhThanh.id,
    },
  });

  const staff3 = await prisma.user.create({
    data: {
      role: "staff",
      name: "Đặng Thị Nhung",
      email: "nhung.dang@bookingfamily.com",
      phone: "0967890123",
      hashPassword: defaultPassword,
      address: "333 Lê Văn Việt, Thủ Đức",
      areaId: thuDuc.id,
    },
  });

  console.log("  ✅ Đã tạo tài khoản người dùng\n");

  // ----------------------------
  // 3. Tạo hồ sơ nhân viên
  // ----------------------------
  console.log("📋 Tạo hồ sơ nhân viên...");

  await prisma.staffProfile.create({
    data: {
      staffId: staff1.id,
      idCardNumber: "079201000001",
      skills: "Dọn dẹp nhà cửa, giặt ủi, nấu ăn",
      hireDate: new Date("2024-01-15"),
      status: "active",
      currentAvailability: "available",
    },
  });

  await prisma.staffProfile.create({
    data: {
      staffId: staff2.id,
      idCardNumber: "079201000002",
      skills: "Vệ sinh công nghiệp, lau kính, dọn văn phòng",
      hireDate: new Date("2024-03-01"),
      status: "active",
      currentAvailability: "available",
    },
  });

  await prisma.staffProfile.create({
    data: {
      staffId: staff3.id,
      idCardNumber: "079201000003",
      skills: "Chăm sóc người già, trông trẻ, nấu ăn",
      hireDate: new Date("2024-06-10"),
      status: "active",
      currentAvailability: "available",
    },
  });

  console.log("  ✅ Đã tạo hồ sơ nhân viên\n");

  // ----------------------------
  // 4. Phân công khu vực phục vụ cho nhân viên
  // ----------------------------
  console.log("🗺️  Phân công khu vực phục vụ...");

  await prisma.staffServiceArea.createMany({
    data: [
      { staffId: staff1.id, areaId: quan1.id, primaryArea: true },
      { staffId: staff1.id, areaId: quan3.id, primaryArea: false },
      { staffId: staff1.id, areaId: quan7.id, primaryArea: false },
      { staffId: staff2.id, areaId: binhThanh.id, primaryArea: true },
      { staffId: staff2.id, areaId: thuDuc.id, primaryArea: false },
      { staffId: staff3.id, areaId: thuDuc.id, primaryArea: true },
      { staffId: staff3.id, areaId: binhThanh.id, primaryArea: false },
    ],
  });

  console.log("  ✅ Đã phân công khu vực\n");

  // ----------------------------
  // 5. Tạo dịch vụ
  // ----------------------------
  console.log("🧹 Tạo danh sách dịch vụ...");

  const service1 = await prisma.service.create({
    data: {
      name: "Dọn dẹp nhà cửa",
      description:
        "Dịch vụ dọn dẹp tổng thể nhà ở bao gồm quét, lau sàn, hút bụi, lau kính, dọn bếp và phòng vệ sinh.",
      price: 250000,
      duration: 120,
      categoryId: serviceCategory1.id,
    },
  });

  const service2 = await prisma.service.create({
    data: {
      name: "Giặt ủi quần áo",
      description:
        "Giặt, phơi và ủi quần áo tại nhà khách hàng. Bao gồm phân loại đồ và xử lý vết bẩn.",
      price: 150000,
      duration: 90,
      categoryId: serviceCategory1.id,
    },
  });

  const service3 = await prisma.service.create({
    data: {
      name: "Nấu ăn gia đình",
      description:
        "Nấu các bữa ăn gia đình theo yêu cầu. Bao gồm đi chợ, chuẩn bị nguyên liệu và dọn dẹp bếp sau khi nấu.",
      price: 300000,
      duration: 150,
      categoryId: serviceCategory1.id,
    },
  });

  const service4 = await prisma.service.create({
    data: {
      name: "Chăm sóc người cao tuổi",
      description:
        "Hỗ trợ chăm sóc người cao tuổi tại nhà: ăn uống, vệ sinh cá nhân, uống thuốc, thể dục nhẹ.",
      price: 400000,
      duration: 240,
      categoryId: serviceCategory1.id,
    },
  });

  const service5 = await prisma.service.create({
    data: {
      name: "Trông trẻ tại nhà",
      description:
        "Trông giữ trẻ tại nhà, cho ăn, chơi cùng và đảm bảo an toàn cho bé.",
      price: 200000,
      duration: 180,
      categoryId: serviceCategory1.id,
    },
  });

  console.log("  ✅ Đã tạo dịch vụ\n");

  // ----------------------------
  // 6. Tạo mã giảm giá
  // ----------------------------
  console.log("🎟️  Tạo mã giảm giá...");

  const discount1 = await prisma.discountCode.create({
    data: {
      code: "WELCOME10",
      description: "Giảm 10% cho khách hàng mới",
      discountType: "percentage",
      discountValue: 10,
      minBookingAmount: 200000,
      maxDiscountAmount: 50000,
      startDate: new Date("2026-01-01"),
      endDate: new Date("2026-12-31"),
      usageLimit: 100,
      usedCount: 5,
    },
  });

  await prisma.discountCode.create({
    data: {
      code: "SUMMER50K",
      description: "Giảm 50,000đ cho đơn từ 300,000đ",
      discountType: "fixed_amount",
      discountValue: 50000,
      minBookingAmount: 300000,
      startDate: new Date("2026-04-01"),
      endDate: new Date("2026-06-30"),
      usageLimit: 50,
      usedCount: 0,
    },
  });

  console.log("  ✅ Đã tạo mã giảm giá\n");

  // ----------------------------
  // 7. Tạo đơn đặt lịch (Bookings)
  // ----------------------------
  console.log("📅 Tạo đơn đặt lịch...");

  const booking1 = await prisma.booking.create({
    data: {
      customerId: customer1.id,
      address: "456 Lê Lợi, Quận 1, TP.HCM",
      areaId: quan1.id,
      scheduledTime: new Date("2026-04-05T08:00:00"),
      status: "completed",
      totalAmount: 225000,
      discountCodeId: discount1.id,
      actualStartTime: new Date("2026-04-05T08:05:00"),
      actualEndTime: new Date("2026-04-05T10:00:00"),
      bookingDetails: {
        create: [
          {
            serviceId: service1.id,
            quantity: 1,
            unitPrice: 250000,
            notes: "",
          },
        ],
      },
    },
  });

  const booking2 = await prisma.booking.create({
    data: {
      customerId: customer2.id,
      address: "789 Nguyễn Trãi, Quận 3, TP.HCM",
      areaId: quan3.id,
      scheduledTime: new Date("2026-04-06T10:00:00"),
      status: "completed",
      totalAmount: 300000,
      actualStartTime: new Date("2026-04-06T10:10:00"),
      actualEndTime: new Date("2026-04-06T12:30:00"),
      bookingDetails: {
        create: [
          {
            serviceId: service3.id,
            quantity: 1,
            unitPrice: 300000,
            notes: "",
          },
        ],
      },
    },
  });

  const booking3 = await prisma.booking.create({
    data: {
      customerId: customer3.id,
      address: "321 Phạm Văn Đồng, Thủ Đức, TP.HCM",
      areaId: thuDuc.id,
      scheduledTime: new Date("2026-04-10T07:00:00"),
      status: "pending",
      totalAmount: 400000,
      note: "Bà ngoại 75 tuổi, cần người nhẹ nhàng",
      bookingDetails: {
        create: [
          {
            serviceId: service4.id,
            quantity: 1,
            unitPrice: 400000,
            notes: "",
          },
        ],
      },
    },
  });

  const booking4 = await prisma.booking.create({
    data: {
      customerId: customer1.id,
      address: "456 Lê Lợi, Quận 1, TP.HCM",
      areaId: quan1.id,
      scheduledTime: new Date("2026-04-08T14:00:00"),
      status: "cancelled",
      totalAmount: 150000,
      cancelReason: "Khách hàng bận việc đột xuất",
      bookingDetails: {
        create: [
          {
            serviceId: service2.id,
            quantity: 1,
            unitPrice: 150000,
            notes: "",
          },
        ],
      },
    },
  });

  console.log("  ✅ Đã tạo đơn đặt lịch\n");

  // ----------------------------
  // 8. Phân công nhân viên
  // ----------------------------
  console.log("👷 Phân công nhân viên cho đơn hàng...");

  await prisma.staffAssignment.createMany({
    data: [
      {
        bookingId: booking1.id,
        staffId: staff1.id,
        assignedAt: new Date("2026-04-04T15:00:00"),
        status: "completed",
      },
      {
        bookingId: booking2.id,
        staffId: staff1.id,
        assignedAt: new Date("2026-04-05T18:00:00"),
        status: "completed",
      },
      {
        bookingId: booking3.id,
        staffId: staff3.id,
        assignedAt: new Date("2026-04-09T10:00:00"),
        status: "assigned",
      },
    ],
  });

  console.log("  ✅ Đã phân công nhân viên\n");

  // ----------------------------
  // 9. Tạo thanh toán
  // ----------------------------
  console.log("💳 Tạo thanh toán...");

  await prisma.payment.createMany({
    data: [
      {
        bookingId: booking1.id,
        amount: 225000,
        method: "zaloPay",
        status: "paid",
        transactionId: "ZP20260405080001",
        paidAt: new Date("2026-04-05T10:05:00"),
      },
      {
        bookingId: booking2.id,
        amount: 300000,
        method: "card",
        status: "paid",
        transactionId: "CARD20260406100001",
        paidAt: new Date("2026-04-06T12:35:00"),
      },
    ],
  });

  console.log("  ✅ Đã tạo thanh toán\n");

  // ----------------------------
  // 10. Tạo đánh giá
  // ----------------------------
  console.log("⭐ Tạo đánh giá...");

  await prisma.review.createMany({
    data: [
      {
        bookingId: booking1.id,
        customerId: customer1.id,
        staffId: staff1.id,
        type: "STAFF",
        rating: 5,
        comment: "Chị Lan làm rất sạch sẽ và cẩn thận. Sẽ đặt lại!",
      },
      {
        bookingId: booking2.id,
        customerId: customer2.id,
        staffId: staff1.id,
        type: "STAFF",
        rating: 4,
        comment: "Nấu ăn ngon, nhưng đến trễ 10 phút.",
      },
    ],
  });

  console.log("  ✅ Đã tạo đánh giá\n");

  // ----------------------------
  // 11. Tạo ca làm việc
  // ----------------------------
  console.log("⏰ Tạo ca làm việc...");

  const shiftMorning = await prisma.workShift.create({
    data: {
      shiftName: "Ca sáng",
      startTime: new Date("1970-01-01T07:00:00"),
      endTime: new Date("1970-01-01T12:00:00"),
    },
  });

  const shiftAfternoon = await prisma.workShift.create({
    data: {
      shiftName: "Ca chiều",
      startTime: new Date("1970-01-01T13:00:00"),
      endTime: new Date("1970-01-01T18:00:00"),
    },
  });

  const shiftFullday = await prisma.workShift.create({
    data: {
      shiftName: "Ca cả ngày",
      startTime: new Date("1970-01-01T07:00:00"),
      endTime: new Date("1970-01-01T18:00:00"),
    },
  });

  console.log("  ✅ Đã tạo ca làm việc\n");

  // ----------------------------
  // 12. Tạo lịch làm việc nhân viên
  // ----------------------------
  console.log("📆 Tạo lịch làm việc...");

  await prisma.staffSchedule.createMany({
    data: [
      // Staff 1: Làm sáng T2-T6
      {
        staffId: staff1.id,
        shiftId: shiftMorning.id,
        dayOfWeek: 2,
        status: "active",
      },
      {
        staffId: staff1.id,
        shiftId: shiftMorning.id,
        dayOfWeek: 3,
        status: "active",
      },
      {
        staffId: staff1.id,
        shiftId: shiftMorning.id,
        dayOfWeek: 4,
        status: "active",
      },
      {
        staffId: staff1.id,
        shiftId: shiftMorning.id,
        dayOfWeek: 5,
        status: "active",
      },
      {
        staffId: staff1.id,
        shiftId: shiftMorning.id,
        dayOfWeek: 6,
        status: "active",
      },
      // Staff 2: Làm cả ngày T2, T4, T6
      {
        staffId: staff2.id,
        shiftId: shiftFullday.id,
        dayOfWeek: 2,
        status: "active",
      },
      {
        staffId: staff2.id,
        shiftId: shiftFullday.id,
        dayOfWeek: 4,
        status: "active",
      },
      {
        staffId: staff2.id,
        shiftId: shiftFullday.id,
        dayOfWeek: 6,
        status: "active",
      },
      // Staff 3: Làm chiều T2-T7
      {
        staffId: staff3.id,
        shiftId: shiftAfternoon.id,
        dayOfWeek: 2,
        status: "active",
      },
      {
        staffId: staff3.id,
        shiftId: shiftAfternoon.id,
        dayOfWeek: 3,
        status: "active",
      },
      {
        staffId: staff3.id,
        shiftId: shiftAfternoon.id,
        dayOfWeek: 4,
        status: "active",
      },
      {
        staffId: staff3.id,
        shiftId: shiftAfternoon.id,
        dayOfWeek: 5,
        status: "active",
      },
      {
        staffId: staff3.id,
        shiftId: shiftAfternoon.id,
        dayOfWeek: 6,
        status: "active",
      },
      {
        staffId: staff3.id,
        shiftId: shiftAfternoon.id,
        dayOfWeek: 7,
        status: "active",
      },
    ],
  });

  console.log("  ✅ Đã tạo lịch làm việc\n");

  // ----------------------------
  // 13. Tạo hợp đồng
  // ----------------------------
  console.log("📝 Tạo hợp đồng...");

  await prisma.contract.createMany({
    data: [
      {
        contractNumber: "HD-2024-001",
        staffId: staff1.id,
        contractType: "chính thức",
        signDate: new Date("2024-01-15"),
        startDate: new Date("2024-02-01"),
        baseSalary: 8000000,
        commissionRate: 10,
        status: "hiệu lực",
      },
      {
        contractNumber: "HD-2024-002",
        staffId: staff2.id,
        contractType: "chính thức",
        signDate: new Date("2024-03-01"),
        startDate: new Date("2024-03-15"),
        baseSalary: 7500000,
        commissionRate: 8,
        status: "hiệu lực",
      },
      {
        contractNumber: "HD-2024-003",
        staffId: staff3.id,
        contractType: "thử việc",
        signDate: new Date("2024-06-10"),
        startDate: new Date("2024-06-15"),
        endDate: new Date("2024-08-15"),
        baseSalary: 5000000,
        commissionRate: 5,
        status: "hiệu lực",
      },
    ],
  });

  console.log("  ✅ Đã tạo hợp đồng\n");

  // ----------------------------
  // 14. Tạo thông báo
  // ----------------------------
  console.log("🔔 Tạo thông báo...");

  await prisma.notification.createMany({
    data: [
      {
        userId: customer1.id,
        message:
          "Đơn đặt lịch #1 của bạn đã hoàn thành. Hãy đánh giá dịch vụ nhé!",
        type: "in-app",
      },
      {
        userId: staff1.id,
        message: "Bạn có đơn hàng mới cần xác nhận vào ngày 05/04/2026",
        type: "in-app",
      },
      {
        userId: customer3.id,
        message: "Đơn đặt lịch #3 đã được tiếp nhận. Nhân viên sẽ liên hệ sớm.",
        type: "in-app",
      },
    ],
  });

  console.log("  ✅ Đã tạo thông báo\n");

  console.log("🎉 Seed dữ liệu hoàn tất!");
  console.log("=".repeat(50));
  console.log("📊 Tổng kết:");
  console.log("  - Khu vực: 9 (2 tỉnh/thành + 7 quận/huyện)");
  console.log("  - Người dùng: 7 (1 admin + 3 khách hàng + 3 nhân viên)");
  console.log("  - Dịch vụ: 5");
  console.log("  - Mã giảm giá: 2");
  console.log("  - Đơn đặt lịch: 4");
  console.log("  - Đánh giá: 2");
  console.log("  - Ca làm việc: 3");
  console.log("  - Hợp đồng: 3");
  console.log("=".repeat(50));
  console.log("\n🔑 Tài khoản mặc định (password: 123456):");
  console.log("  Admin:    admin@bookingfamily.com");
  console.log("  KH 1:     hoa.tran@gmail.com");
  console.log("  KH 2:     tuan.le@gmail.com");
  console.log("  KH 3:     mai.pham@gmail.com");
  console.log("  NV 1:     lan.nguyen@bookingfamily.com");
  console.log("  NV 2:     hung.vo@bookingfamily.com");
  console.log("  NV 3:     nhung.dang@bookingfamily.com");
}

// ========================
// Chạy seed
// ========================
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Lỗi seed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
