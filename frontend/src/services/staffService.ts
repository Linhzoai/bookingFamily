import api from "@/libs/axiosClient";
import type { Staff } from "@/types/auth";
import type { GetQuery } from "@/types/store";
export const staffService ={
    getAllStaff: async (query?: string): Promise<GetQuery<Staff>>=> {
        const res = await api.get(`/staff/list?${query}`);
        return res.data.data;
    },
    getStaffById: async (id: string): Promise<Staff> => {
        const res = await api.get(`/staff/${id}/profile`);
        return res.data;
    },
    updateStaffProfile: async (id: string, data: Partial<Staff>): Promise<Staff> => {
        const res = await api.patch(`/staff/${id}/profile`, data);
        return res.data;
    },
    updateStaffStatus: async (id: string, status: string): Promise<Staff> => {
        const res = await api.put(`/staff/${id}/status`, { status });
        return res.data;
    },
    createStaff: async (id: string, data: Partial<Staff>): Promise<Staff> => {
        const res = await api.post(`/staff/${id}/add-profile`, data);
        return res.data;
    },
    deleteStaff: async (id: string): Promise<Staff> => {
        const res = await api.delete(`/staff/${id}/delete-staff`);
        return res.data;
    },
    deleteStaffProfile: async (id: string): Promise<Staff> => {
        const res = await api.delete(`/staff/${id}/delete-profile`);
        return res.data;
    }
}