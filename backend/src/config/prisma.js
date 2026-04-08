import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import env from "./env.js";

const pool = new Pool({ 
  connectionString: env.databaseUrl,
  ssl: { rejectUnauthorized: false } // 👈 Thêm thêm mạng SSL vào đây nữa
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export default prisma;
