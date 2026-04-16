import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
// ========================
// Khởi tạo Prisma Client
// ========================
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } 
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
async function formatAreaPaths() {
  console.log("🚀 Đang khởi động cập nhật Path cho các khu vực...");

  try {
    // 1. Lấy toàn bộ danh sách khu vực
    const areas = await prisma.serviceArea.findMany();
    
    // 2. Tạo một Map để truy xuất nhanh theo ID
    const areaMap = new Map(areas.map(a => [a.id, a]));

    // 3. Hàm đệ quy để xây dựng path (Ví dụ: /1/12/45/)
    const buildPath = (id: number): string => {
      const area = areaMap.get(id);
      if (!area) return "";
      
      if (!area.parentId) {
        // Cấp gốc
        return `/${area.id}/`;
      }
      
      // Đệ quy lên cha
      return `${buildPath(area.parentId)}${area.id}/`;
    };

    console.log(`📊 Tìm thấy ${areas.length} khu vực. Bắt đầu tính toán...`);

    // 4. Cập nhật từng bản ghi
    for (const area of areas) {
      const newPath = buildPath(area.id);
      
      await prisma.serviceArea.update({
        where: { id: area.id },
        data: { path: newPath }
      });
      
      console.log(`✅ Updated: ${area.name} -> ${newPath}`);
    }

    console.log("\n✨ Hoàn thành cập nhật tất cả các đường dẫn!");
  } catch (error) {
    console.error("❌ Lỗi khi cập nhật path:", error);
  } finally {
    await prisma.$disconnect();
  }
}

formatAreaPaths();
