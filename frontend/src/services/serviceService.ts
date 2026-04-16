import api from "@/libs/axiosClient";
import type { Service } from "@/types/booking";

export const serviceService = {
    getAllServices: async (): Promise<Service[]> => {
        const response = await api.get('/services');
        return response.data.data;
    },
    createService: async (data: Service): Promise<Service> => {
        const response = await api.post('/services/create', data);
        return response.data;
    },
    updateService: async (id: string, data: Service): Promise<Service> => {
        const response = await api.put(`/services/${id}/update`, data);
        return response.data;
    },
    deleteService: async (id: string): Promise<Service> => {
        const response = await api.delete(`/services/${id}/delete`);
        return response.data;
    }
}