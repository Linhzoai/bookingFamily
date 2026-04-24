import prisma from "../../config/prisma.js";
import { Prisma } from "@prisma/client";
class ReportService {
    queryRevenue = async (data) => {
        const { groupBy, status } = data;
        const from = new Date(data.from);
        const to = new Date(data.to);
        const diffMs = to - from;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        let formatTime = { formatStr: "" };
        let statusCondition = Prisma.empty;
        if (status === "completed") statusCondition = Prisma.sql`AND status = 'completed'`;
        if (status === "cancelled") statusCondition = Prisma.sql`AND status = 'cancelled'`;
        if (status === "order") statusCondition = Prisma.sql`AND status <> 'cancelled'`;
        if (status === "all") statusCondition = Prisma.sql``;
        if (groupBy === "day" && diffDays < 31) {
            formatTime.formatStr = "DD-MM-YYYY";
        } else if (
            (groupBy === "month" && diffDays <= 365) ||
            (groupBy === "day" && diffDays > 31 && diffDays < 365)
        ) {
            formatTime.formatStr = "MM-YYYY"
        } else {
            formatTime.formatStr = "YYYY"
        }
        const result = await prisma.$queryRaw`
            SELECT TO_CHAR(created_at, ${formatTime.formatStr}) AS "recordDate",
            SUM(total_amount) as "totalAmounts",
            CAST(COUNT(*) AS INTEGER ) as "totalBookings"
            FROM bookings
            WHERE created_at BETWEEN ${from} AND ${to}
            ${statusCondition}
            GROUP BY "recordDate"
            ORDER BY "recordDate" ASC
             `;
        
        return result
    };
    queryRevenueByPartner = async (user, data) => {
        const { groupBy, status } = data;
        const from = new Date(data.from);
        const to = new Date(data.to);
        const diffMs = to - from;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        let formatTime = { formatStr: "" };
        let statusCondition = Prisma.empty;
        let partnerCondition = Prisma.empty;
        if (status === "completed") statusCondition = Prisma.sql`AND status = 'completed'`;
        if (status === "cancelled") statusCondition = Prisma.sql`AND status = 'cancelled'`;
        if (status === "order") statusCondition = Prisma.sql`AND status <> 'cancelled'`;
        if (status === "all") statusCondition = Prisma.sql``;
        if (user.role === "customer") partnerCondition = Prisma.sql`AND customerId = ${user.id}`;
        if (user.role === "staff") partnerCondition = Prisma.sql`AND EXISTS (
            SELECT 1 FROM staffAssignments sa
            WHERE sa.bookingId = b.id
            AND sa.staffId = ${user.id}
            AND sa.status <> 'rejected'
        )`
        if (groupBy === "day" && diffDays < 31) {
            formatTime.formatStr = "DD-MM-YYYY";
        } else if (
            (groupBy === "month" && diffDays <= 365) ||
            (groupBy === "day" && diffDays > 31 && diffDays < 365)
        ) {
            formatTime.formatStr = "MM-YYYY"
        } else {
            formatTime.formatStr = "YYYY"
        }
        const result = await prisma.$queryRaw`
            SELECT TO_CHAR(b.created_at, ${formatTime.formatStr}) AS "recordDate",
            SUM(b.total_amount) as "totalAmounts",
            CAST(COUNT(*) AS INTEGER ) as "totalBookings"
            FROM bookings b
            WHERE b.created_at BETWEEN ${from} AND ${to}
            ${statusCondition}
            ${partnerCondition}
            GROUP BY "recordDate"
            ORDER BY "recordDate" ASC
             `;
        return result
    };
}
export default new ReportService();
