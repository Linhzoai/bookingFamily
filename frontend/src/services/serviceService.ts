/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/libs/axiosClient";
import type { Service } from "@/types/booking";
import type { GetQuery } from "@/types/store";

export const serviceService = {
    getAllServices: async (query?: string): Promise<GetQuery<Service>> => {
        const response = await api.get(`/services?${query}`);
        return response.data.data;
    },
    createService: async (data: any): Promise<Service> => {
        const response = await api.post('/services/create', data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },
    updateService: async (id: string, data: any): Promise<Service> => {
        const response = await api.put(`/services/${id}/update`, data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },
    deleteService: async (id: string): Promise<Service> => {
        const response = await api.delete(`/services/${id}/delete`);
        return response.data;
    }
}