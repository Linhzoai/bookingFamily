import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import env from "./env.js";

const adapter = new PrismaMariaDb(env.databaseUrl, { useTextProtocol: true });
const prisma = new PrismaClient({ adapter });

export default prisma;
