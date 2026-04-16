import api from "@/libs/axiosClient.ts";
import type { Area } from "@/types/booking";
import type { GetQuery } from "@/types/store";

export const AreaService = {
    getAllAreas: async (query?: string): Promise<GetQuery<Area>>=> {
        const response = await api.get(`/areas?${query}`);
        return response.data.data;
    },

    createArea: async (data): Promise<Area> =>{
        const response = await api.post(`/areas/create`, data);
        return response.data;
    },

    updateArea: async (id: number,data: Partial<Area>): Promise<Area> =>{
        const response = await api.put(`/areas/${id}/update`, data);
        return response.data;
    },

    deleteArea: async (id: number): Promise<Area> =>{
        const response = await api.delete(`/areas/${id}/delete`);
        return response.data;
    }

}