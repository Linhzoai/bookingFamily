import api from "@/libs/axiosClient.ts";
import type { Discount } from "@/types/booking.ts";
import type { GetQuery } from "@/types/store.ts";
export const discountService = {
    createDiscount: async (data: Partial<Discount>): Promise<Discount> => {
        const response = await api.post("/discounts", data);
        return response.data;
    },
    getAllDiscounts: async (query?: string): Promise<GetQuery<Discount>> => {
        const response = await api.get(`/discounts?${query}`);
        return response.data.data;
    },
    updateDiscount: async (id: string, data: Partial<Discount>)=> {
        const response = await api.put(`/discounts/${id}`, data);
        return response.data;
    },
    deleteDiscount: async (id: string): Promise<Discount> => {
        const response = await api.delete(`/discounts/${id}`);
        return response.data;
    },
}