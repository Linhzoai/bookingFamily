import api from "@/libs/axiosClient";
import type { LeaveRequest } from "@/types/leaveRequest";
import type { GetQuery } from "@/types/store";

export const leaveRequestService = {
    getAllRequests: async (query?: string): Promise<GetQuery<LeaveRequest>> => {
        const res = await api.get(`/request-leave?${query || ''}`);
        return res.data.data;
    },
    updateStatus: async (id: number, status: 'pending' | 'approved' | 'rejected'): Promise<LeaveRequest> => {
        const res = await api.patch(`/request-leave/${id}`, { status });
        return res.data.data;
    },
    createRequest: async (data: Omit<LeaveRequest, 'id' | 'staffId' | 'status' | 'createdAt' | 'approvedBy' | 'staff' | 'approver'>): Promise<LeaveRequest> => {
        const res = await api.post(`/request-leave`, data);
        return res.data.data;
    },
    deleteRequest: async (id: number): Promise<void> => {
        await api.delete(`/request-leave/${id}`);
    },

    updateRequest: async (id: number, data: Omit<LeaveRequest, 'id' | 'staffId' | 'status' | 'createdAt' | 'approvedBy' | 'staff' | 'approver'>): Promise<LeaveRequest> => {
        const res = await api.patch(`/request-leave/${id}`, data);
        return res.data.data;
    },
};
