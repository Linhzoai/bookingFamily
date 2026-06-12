import type { User } from './auth';

export interface LeaveRequest {
    id: number;
    staffId: string;
    startTime: string;
    endTime: string;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    approvedBy?: string;
    createdAt: string;
    staff?: User;
    approver?: User;
}
