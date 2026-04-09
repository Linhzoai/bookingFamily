export interface User {
    id: string,
    email: string,
    role: 'admin' | 'user' | 'staff',
    name: string,
    phone?: string,
    address?: string,
    areaId?: number,
    status: 'active' | 'inactive',
    avatarUrl?: string,
    createdAt: string,
    updatedAt: string
    staffProfile?: StaffProfile
}

export interface StaffProfile{
    id: number;
    idCardNumber: string;
    skills?: string;
    hireDate: string;
    status: string;
    currentAvailability: string;
    
}