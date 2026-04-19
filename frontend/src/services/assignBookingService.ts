import api from "@/libs/axiosClient";
import type { AssignBooking } from "@/types/booking";

export const assignBookingService = {
    createAssignBooking: async (data: Partial<AssignBooking>): Promise<AssignBooking> => {
        const response = await api.post('/assignments', data);
        return response.data;
    },
    updateAssignBooking: async (data: Partial<AssignBooking>, id: string): Promise<AssignBooking> => {
        const response = await api.put(`/assignments/${id}`, data);
        return response.data;
    },
    deleteAssignBooking: async (id: string): Promise<AssignBooking> => {
        const response = await api.delete(`/assignments/${id}`);
        return response.data;
    }
}