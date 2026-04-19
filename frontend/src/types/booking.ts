import type { User } from "./auth";

export interface Area {
    id: number;
    name: string;
    parentId: number;
    isActive: boolean;
    path: string;
    createdAt?: Date;
    updatedAt?: Date;

    parent?: Area;
    children?: Area[];
}
export interface Category {
    id: number;
    name: string;
    description?: string;
    iconUrl?: string;
    isActive: boolean;
    _count: {
        services: number;
    };
    
    createdAt?: Date;
    updatedAt?: Date;
}
export interface Service {
    id: string;
    name: string;
    description?: string;
    price: number;
    duration: number;
    active: boolean;
    categoryId: number;
    imageUrl?: string;
    createdAt?: string;
    updatedAt?: string;

    category?: Category;
}

export interface Category{
    id: number;
    name: string;
    description?: string;
    iconUrl?: string;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;

    services?: Service[];
}
export interface BookingDetail {
    id: string;
    bookingId: string;
    serviceId: string;
    staffId: string;
    unitPrice: number;
    quantity: number;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;

    booking?: Booking;
    service?: Service;
    staff?: User;
}
export interface Booking {
    id: string;
    customerId: string;
    address:string;
    areaId: number;
    scheduledTime: Date;
    discountId?: string;
    status: 'pending' | 'in_progress' | 'completed' | 'canceled';
    note?: string;
    totalAmount: number;
    cancelReason?: string;
    actualStartTime?: Date;
    actualEndTime?: Date;
    createdAt: Date;
    updatedAt: Date;

    customer?: User;
    area?: Area;
    bookingDetails?: BookingDetail[];
    staffAssignments?: AssignBooking[];
    staff?: User;
    
}

export interface AssignBooking {
    id: string;
    bookingId: string;
    staffId: string;
    status?: string;
    assignedAt?: Date;
    createdAt: Date;
    updatedAt: Date;

    booking?: Booking;
    staff?: User;
}