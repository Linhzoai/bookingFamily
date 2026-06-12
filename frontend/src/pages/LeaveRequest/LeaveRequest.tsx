import { useEffect, useState, useCallback } from 'react';
import styles from './style.module.scss';
import { leaveRequestService } from '@/services/leaveRequestService';
import type { LeaveRequest } from '@/types/leaveRequest';

import SearchCommon from '@/components/SearchCommon/SearchCommon';
import SelectCommon from '@/components/SelectCommon/SelectCommon';
import StatsCard from '@/components/StatsCard/StatsCard';
import LeaveList from './components/LeaveList';
import { toast } from 'react-toastify';

export default function LeaveRequestPage() {
    const [requests, setRequests] = useState<LeaveRequest[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [search, setSearch] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<string>('');

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            let query = '';
            if (statusFilter) query += `status=${statusFilter}&`;
            if (search) query += `search=${search}&`;
            const data = await leaveRequestService.getAllRequests(query);
            setRequests(data.data || []);
        } catch (error) {
            toast.error("Không thể tải danh sách đơn nghỉ phép");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [search, statusFilter]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleUpdateStatus = async (id: number, status: 'approved' | 'rejected') => {
        try {
            await leaveRequestService.updateStatus(id, status);
            toast.success(`Đã ${status === 'approved' ? 'duyệt' : 'từ chối'} đơn nghỉ phép`);
            fetchData();
        } catch (error) {
            console.log("error: ", error)
            toast.error("Có lỗi xảy ra khi cập nhật trạng thái");
        }
    };

    // Calculate stats
    const pendingCount = requests.filter(r => r.status === 'pending').length;
    const approvedCount = requests.filter(r => r.status === 'approved').length;
    const rejectedCount = requests.filter(r => r.status === 'rejected').length;

    const statusOptions = [
        { label: 'Chờ duyệt', value: 'pending' },
        { label: 'Đã duyệt', value: 'approved' },
        { label: 'Từ chối', value: 'rejected' },
    ];

    return (
        <div className={styles.pageContainer}>
            <main className={styles.mainContent}>
                {/* Stats Section */}
                <div className={styles.statsGrid}>
                    <StatsCard 
                        icon="pending_actions" 
                        title="Đơn chờ duyệt" 
                        value={pendingCount.toString()} 
                        trend="+2 tuần này" 
                        trendType="neutral" 
                    />
                    <StatsCard 
                        icon="task_alt" 
                        title="Đơn đã duyệt" 
                        value={approvedCount.toString()} 
                        trend="+15 tuần này" 
                        trendType="positive" 
                    />
                    <StatsCard 
                        icon="cancel" 
                        title="Đơn từ chối" 
                        value={rejectedCount.toString()} 
                        trendType="negative" 
                    />
                </div>

                {/* Action Bar */}
                <div className={styles.actionBar}>
                    <div className={styles.filters}>
                        <div className={styles.searchWrapper}>
                            <SearchCommon placeholder="Tìm tên nhân viên..." />
                            {/* Note: In a real app, bind the search input value to state. SearchCommon might need modifications to support value/onChange */}
                        </div>
                        <SelectCommon 
                            options={statusOptions} 
                            placeholder="Tất cả trạng thái" 
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        />
                        {/* Fake Date Picker for UI fidelity */}
                        <div className={styles.datePickerFake}>
                            <span className="material-symbols-outlined">calendar_today</span>
                            <span>Thời gian</span>
                        </div>
                    </div>
                </div>

                {/* Primary Content Area */}
                <div className={styles.contentArea}>
                    {loading ? (
                        <div className={styles.loadingWrapper}>Đang tải dữ liệu...</div>
                    ) : (
                        <LeaveList data={requests} onUpdateStatus={handleUpdateStatus} />
                    )}
                </div>
            </main>
        </div>
    );
}
