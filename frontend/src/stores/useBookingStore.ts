import { create } from 'zustand';
import type { BookingsStore } from '@/types/store';
import { bookingService } from '@/services/bookingService';
import type { Booking } from '@/types/booking';
import { toast } from 'react-toastify';

export const useBookingStore = create<BookingsStore>((set, get) => {
    return {
        loading: false,
        bookings: [],
        getAllBookings: async (query?: string) => {
            set({ loading: true });
            try {
                const bookings = await bookingService.getAllBookings(query);
                set({ bookings, loading: false });
            } catch (error) {
                set({ loading: false });
                toast.error('Lấy danh sách lịch đặt thất bại');
                throw error;
            }
        },
        createBooking: async (data: Booking) => {
            set({ loading: true });
            try {
                const booking = await bookingService.createBooking(data);
                set({ bookings: [...get().bookings, booking], loading: false });
            } catch (error) {
                set({ loading: false });
                toast.error('Tạo lịch đặt thất bại');
                throw error;
            }
        },
        updateBooking: async (id: string, data: Booking) => {
            set({ loading: true });
            try {
                const booking = await bookingService.updateBooking(id, data);
                set({ bookings: get().bookings.map((b) => (b.id === id ? booking : b)), loading: false });
            } catch (error) {
                set({ loading: false });
                throw error;
            }
        },
        deleteBooking: async (id: string) => {
            set({ loading: true });
            try {
                await bookingService.deleteBooking(id);
                set({ bookings: get().bookings.filter((b) => b.id !== id), loading: false });
            } catch (error) {
                set({ loading: false });
                throw error;
            }
        },
        getBookingById: async (id: string) => {
            set({ loading: true });
            try {
                const booking = await bookingService.getBookingById(id);
                set({ bookings: [...get().bookings, booking], loading: false });
            } catch (error) {
                set({ loading: false });
                throw error;
            }
        },
        clearState: () => {
            set({ bookings: [] });
        }
    };
});
