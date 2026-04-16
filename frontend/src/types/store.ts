import type { User } from './auth';
import type { Area, Booking, Category, Service } from './booking';

export interface AuthStore {
    loading: boolean;
    user: User | null;
    token: string | null;
    login: (data: { email: string; password: string }) => Promise<void>;
    logout: () => Promise<void>;
    refreshToken: () => Promise<void>;
    fetchMe: () => Promise<void>;
    clearState: () => void;
}

export interface BookingsStore {
    loading: boolean;
    bookings: Booking[];
    getAllBookings: (query?: string) => Promise<void>;
    createBooking: (data: Booking) => Promise<void>;
    updateBooking: (id: string, data: Booking) => Promise<void>;
    deleteBooking: (id: string) => Promise<void>;
    getBookingById: (id: string) => Promise<void>;
    clearState: () => void;
}

export interface CategoryStore {
    loading: boolean;
    categories: Category[];
    getAllCategories: () => Promise<void>;
    createCategory: (data: Category) => Promise<void>;
    updateCategory: (id: string, data: Category) => Promise<void>;
    deleteCategory: (id: string) => Promise<void>;
    clearState: () => void;
}

export interface ServiceStore{
    loading: boolean,
    services: Service[],
    getAllServices: () => Promise<void>;
    createService: (data: Service) => Promise<void>;
    updateService: (id: string, data: Service) => Promise<void>;
    deleteService: (id: string) => Promise<void>;
    clearState: () => void;
}

export interface AreaStore{
    loading: boolean,
    areas: Area[],
    getAllAreas: () => Promise<void>;
    createArea: (data: Area) => Promise<void>;
    updateArea: (id: number, data: Area) => Promise<void>;
    deleteArea: (id: number) => Promise<void>;
    clearState: () => void;
}

export interface GetQuery<T>{
    data: T[],
    pageNumber: number,
    pageSize: number,
    totalPages: number,
    totalRecords: number,
    hasNextPage: boolean,
    hasPrevPage: boolean
}

export interface SideBarStore{
    isOpen: boolean,
    type: string,
    toggleSidebar: () => void,
    toggleType: (type: string) => void,
}