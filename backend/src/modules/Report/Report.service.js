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
            SELECT TO_CHAR(b.created_at, ${formatTime.formatStr}) AS "recordDate",
            SUM(b.total_amount) as "totalAmounts",
            CAST(COUNT(*) AS INTEGER ) as "totalBookings",
            SUM(CASE WHEN b.status = 'completed' THEN b.total_amount ELSE 0 END) as "totalCompletedAmount",
            CAST(COUNT(CASE WHEN b.status = 'completed' THEN 1 END) AS INTEGER) as "totalCompletedBookings",
            CAST((COUNT(CASE WHEN b.status = 'completed' THEN 1 END) * 100.0 / COUNT(*)) AS NUMERIC(10,2)) as "completedRate",
            SUM(CASE WHEN b.status = 'cancelled' THEN b.total_amount ELSE 0 END) as "totalCancelledAmount",
            CAST(COUNT(CASE WHEN b.status = 'cancelled' THEN 1 END) AS INTEGER) as "totalCancelledBookings",
            CAST((COUNT(CASE WHEN b.status = 'cancelled' THEN 1 END) * 100.0 / COUNT(*)) AS NUMERIC(10,2)) as "cancelledRate"
            FROM bookings b
            WHERE b.created_at BETWEEN ${from} AND ${to}
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
        if (user.role === "customer") partnerCondition = Prisma.sql`AND customer_id = ${user.id}`;
        if (user.role === "staff") partnerCondition = Prisma.sql`AND EXISTS (
            SELECT 1 FROM staff_assignments sa
            WHERE sa.booking_id = b.booking_id
            AND sa.staff_id = ${user.id}
            AND sa.status <> 'rejected'
        )`
        console.log(diffDays);
        if (groupBy === "day" && diffDays <= 31) {
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
            CAST(COUNT(*) AS INTEGER ) as "totalBookings",
            SUM(CASE WHEN b.status = 'completed' THEN b.total_amount ELSE 0 END) as "totalCompletedAmount",
            CAST(COUNT(CASE WHEN b.status = 'completed' THEN 1 END) AS INTEGER) as "totalCompletedBookings",
            CAST((COUNT(CASE WHEN b.status = 'completed' THEN 1 END) * 100.0 / COUNT(*)) AS NUMERIC(10,2)) as "completedRate",
            SUM(CASE WHEN b.status = 'cancelled' THEN b.total_amount ELSE 0 END) as "totalCancelledAmount",
            CAST(COUNT(CASE WHEN b.status = 'cancelled' THEN 1 END) AS INTEGER) as "totalCancelledBookings",
            CAST((COUNT(CASE WHEN b.status = 'cancelled' THEN 1 END) * 100.0 / COUNT(*)) AS NUMERIC(10,2)) as "cancelledRate"
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
