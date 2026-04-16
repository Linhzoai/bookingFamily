import api from "@/libs/axiosClient.ts";
import type { Category } from "@/types/booking.ts";


export const CategoriesService = {
    getAllCategories: async (): Promise<Category[]> => {
        const response = await api.get('/categories');
        return response.data.data;
    },
    getCategoryById: async (id: string): Promise<Category> => {
        const response = await api.get(`/categories/${id}/get`);
        return response.data.data;
    },
    createCategory: async (data: Category): Promise<Category> => {
        const response = await api.post('/categories', data);
        return response.data.data;
    },
    updateCategory: async (id: string, data: Category): Promise<Category> => {
        const response = await api.put(`/categories/${id}/update`, data);
        return response.data.data;
    },
    deleteCategory: async (id: string): Promise<Category> => {
        const response = await api.delete(`/categories/${id}/delete`);
        return response.data.data;
    }
}