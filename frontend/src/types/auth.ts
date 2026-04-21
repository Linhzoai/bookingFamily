import type { Area } from "./booking";

export interface User {
    id: string,
    email: string,
    role: 'admin' | 'user' | 'staff',
    name: string,
    phone?: string,
    address?: string,
    areaId?: number,
    status: 'active' | 'inactive',
    gender?: 'male' | 'female',
    avatarUrl?: string,
    createdAt: string,
    updatedAt: string
}

export interface Staff extends User {
    staffProfile?: StaffProfile
    area?: Area
    _count?: {
        bookings: number;
    }
}

export interface Customer extends User {
    area?: Area
    _count?: {
        bookings: number;
    }
    totalSpent?: number;
}

export interface StaffProfile{
    id: number;
    idCardNumber: string;
    skills?: string;
    hireDate: string;
    status: string;
    currentAvailability: string;
}
