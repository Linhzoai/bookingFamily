import api from "@/libs/axiosClient";
export const reportService = {
    getReportRevenue: async (query: string) => {
        const res = await api.get(`/report/revenue?${query}`)
        return res.data.data
    }
}
