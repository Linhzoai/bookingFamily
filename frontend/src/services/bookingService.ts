import api from "@/libs/axiosClient.ts";
import type { Booking } from "@/types/booking";
import type { GetQuery } from "@/types/store";


export const bookingService = {
    getAllBookings: async (query?: string): Promise<GetQuery<Booking>> => {
        const response = await api.get(`/bookings?${query}`);
        return response.data.data;
    },
    createBooking: async (data: Booking): Promise<Booking> => {
        const response = await api.post('/bookings', data);
        return response.data;
    },
    updateBooking: async (id: string, data: Booking): Promise<Booking> => {
        const response = await api.put(`/bookings/${id}`, data);
        return response.data;
    },
    deleteBooking: async (id: string): Promise<Booking> => {
        const response = await api.delete(`/bookings/${id}`);
        return response.data;
    },
    getBookingById: async (id: string): Promise<Booking> => {
        const response = await api.get(`/bookings/${id}`);
        return response.data;
    }
}