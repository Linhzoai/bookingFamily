import api from "@/libs/axiosClient.ts";

export const customerService = {
    getAllCustomers: async (query?: string) => {
        const response = await api.get(`/customers?${query}`);
        return response.data.data;
    },
    getCustomersById: async (id: string) => {
        const response = await api.get(`/customers/${id}`);
        return response.data;
    },
}