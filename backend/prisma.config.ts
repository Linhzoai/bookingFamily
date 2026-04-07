import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  // Đường dẫn tới schema file
  schema: "prisma/schema.prisma",

  // Cấu hình migrations
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx prisma/seed.ts",
  },

  // Database URL cho Prisma CLI (migrate, generate, db push...)
  datasource: {
    url: env("DATABASE_URL"),
  },
});
