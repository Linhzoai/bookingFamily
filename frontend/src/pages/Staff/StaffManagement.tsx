import { useGetQuery, useDeleteQuery } from '@/hooks/useQueryCustom';
import styles from './style.module.scss';
import { staffService } from '@/services/staffService';
import Loading from '@/components/LoadingCommon/Loading';
import formatDate from '@/utils/formatDate';
import { useState, useEffect } from 'react';
import cls from 'classnames';
import { useSideBarStore } from '@/stores/useSidebarStore';

export default function StaffManagement() {
    const {
        container,
        header,
        title,
        subtitle,
        actions,
        export_btn,
        add_btn,
        stats_grid,
        stat_card,
        stat_card_wide,
        stat_label,
        stat_value,
        stat_trend_pos,
        stat_trend_info,
        stat_label_light,
        stat_value_large,
        stat_info_light,
        badge,
        wide_content,
        filter_bar,
        search_box,
        select_box,
        date_box,
        table_card,
        table,
        text_center,
        text_right,
        mono_text,
        staff_name,
        staff_date,
        contact_info,
        email,
        booking_count,
        action_cell,
        status_badge,
        avail_badge,
        badge_active,
        badge_leave,
        badge_inactive,
    } = styles;

    const [page, setPage] = useState(1);
    let queryStaff = `page=${page}`;
    const [search, setSearch] = useState('');
    const [isSearch, setIsSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [availFilter, setAvailFilter] = useState('');
    if (isSearch) queryStaff += `&name=${search}`;
    if (statusFilter) queryStaff += `&status=${statusFilter}`;
    if (availFilter) queryStaff += `&availability=${availFilter}`;

    const { toggleType } = useSideBarStore();
    const { data: staffList, isLoading, isFetching } = useGetQuery('staffs', staffService.getAllStaff, queryStaff);
    const { mutate: deleteStaff, isPending } = useDeleteQuery('staffs', staffService.deleteStaff, 'nhân viên');

    useEffect(() => {
        const timer = setTimeout(() => setIsSearch(search), 1000);
        return () => clearTimeout(timer);
    }, [search]);

    const handlePageChange = (type: 'prev' | 'next') => {
        if (type === 'prev' && page > 1) setPage(page - 1);
        if (type === 'next' && page < (staffList?.totalPages ?? 0)) setPage(page + 1);
    };

    const getStatusClass = (status: string) => {
        if (status === 'active') return `${status_badge} ${badge_active}`;
        if (status === 'on_leave') return `${status_badge} ${badge_leave}`;
        return `${status_badge} ${badge_inactive}`;
    };

    const getStatusLabel = (status: string) => {
        if (status === 'active') return 'Đang làm';
        if (status === 'on_leave') return 'Tạm nghỉ';
        return 'Đã nghỉ';
    };

    const getAvailClass = (avail: string) => {
        if (avail === 'available') return `${avail_badge} ${styles.avail_ready}`;
        if (avail === 'busy') return `${avail_badge} ${styles.avail_busy}`;
        return `${avail_badge} ${styles.avail_no_data}`;
    };

    const getAvailLabel = (avail: string) => {
        if (avail === 'available') return 'Sẵn sàng';
        if (avail === 'busy') return 'Đang bận';
        return 'Không xác định';
    };


    return (
        <div className={container}>
            {/* Header */}
            <div className={header}>
                <div>
                    <h2 className={title}>Quản lý Nhân viên</h2>
                    <p className={subtitle}>Quản lý thông tin và điều phối nhân sự kỹ thuật.</p>
                </div>
                <div className={actions}>
                    <button className={export_btn}>
                        <span className="material-symbols-outlined">download</span>
                        Xuất báo cáo
                    </button>
                    <button className={add_btn} onClick={() => toggleType('create_staff')}>
                        <span className="material-symbols-outlined">add</span>
                        Thêm nhân viên
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className={stats_grid}>
                <div className={stat_card}>
                    <p className={stat_label}>Tổng nhân viên</p>
                    <h3 className={stat_value}>{staffList?.totalRecords ?? '—'}</h3>
                    <div className={stat_trend_pos}>Đang hoạt động</div>
                </div>
                <div className={stat_card}>
                    <p className={stat_label}>Đang hoạt động</p>
                    <h3 className={stat_value}>—</h3>
                    <div className={stat_trend_info}>Chưa có dữ liệu</div>
                </div>
                <div className={stat_card}>
                    <p className={stat_label}>Tạm nghỉ</p>
                    <h3 className={stat_value}>—</h3>
                    <div className={stat_trend_info}>Chưa có dữ liệu</div>
                </div>
                <div className={stat_card_wide}>
                    <div className={wide_content}>
                        <p className={stat_label_light}>Hiệu suất trung bình</p>
                        <h3 className={stat_value_large}>—</h3>
                        <p className={stat_info_light}>Cần thêm dữ liệu đánh giá</p>
                    </div>
                    <div className={badge}>Beta</div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className={filter_bar}>
                <div className={search_box}>
                    <span className="material-symbols-outlined">manage_search</span>
                    <input
                        type="text"
                        placeholder="Tìm theo Tên hoặc Số điện thoại..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className={select_box}>
                    <label>Trạng thái:</label>
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="">Tất cả</option>
                        <option value="active">Đang làm</option>
                        <option value="on_leave">Nghỉ phép</option>
                        <option value="inactive">Đã nghỉ</option>
                    </select>
                </div>
                <div className={select_box}>
                    <label>Tình trạng:</label>
                    <select value={availFilter} onChange={(e) => setAvailFilter(e.target.value)}>
                        <option value="">Tất cả</option>
                        <option value="available">Sẵn sàng</option>
                        <option value="busy">Đang bận</option>
                    </select>
                </div>
                <div className={date_box}>
                    <span className="material-symbols-outlined">calendar_month</span>
                    <input type="date" />
                </div>
            </div>

            {/* Table */}
            <div className={table_card}>
                {(isLoading || isFetching || isPending) && <Loading />}
                <table className={table}>
                    <thead>
                        <tr>
                            <th>Mã NV</th>
                            <th>Nhân viên</th>
                            <th>Liên hệ</th>
                            <th>Khu vực</th>
                            <th className={text_center}>Trạng thái</th>
                            <th className={text_center}>Tình trạng</th>
                            <th className={text_center}>Bookings</th>
                            <th className={text_right}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(staffList?.data || []).map((staff) => (
                            <tr key={staff.id}>
                                <td className={mono_text}>{staff.id.slice(0, 8)}...</td>
                                <td>
                                    <img src={staff.avatarUrl || '/default-avatar.png'} alt={staff.name} />
                                    <p className={staff_name}>{staff.name}</p>
                                    <p className={staff_date}>Tham gia: {formatDate(new Date(staff.createdAt))}</p>
                                </td>
                                <td>
                                    <div className={contact_info}>
                                        <p>{staff.phone}</p>
                                        <p className={email}>{staff.email}</p>
                                    </div>
                                </td>
                                <td>{staff.address.split(",").pop() ?? '—'}</td>
                                <td className={text_center}>
                                    <span className={getStatusClass(staff.status || '')}>
                                        {getStatusLabel(staff.status || '')}
                                    </span>
                                </td>
                                <td className={text_center}>
                                    <span className={getAvailClass(staff?.staffProfile?.currentAvailability || '')}>
                                        {getAvailLabel(staff?.staffProfile?.currentAvailability || 'Chưa cập nhật')}
                                    </span>
                                </td>
                                <td className={text_center}>
                                    <span className={booking_count}>{staff._count?.bookings ?? 0}</span>
                                </td>
                                 <td className={action_cell}>
                                    <button className="material-symbols-outlined" onClick={()=> toggleType('update_staff', {customer: staff})} >visibility</button>
                                    <button className="material-symbols-outlined" onClick={()=> deleteStaff(staff.id)} >delete</button>
                                    <button className="material-symbols-outlined">notifications_active</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className={styles.pagination}>
                    <p>
                        Showing {staffList ? (staffList.pageNumber - 1) * staffList.pageSize + 1 : 0}–
                        {staffList ? Math.min(staffList.pageSize * staffList.pageNumber, staffList.totalRecords) : 0} of{' '}
                        {staffList?.totalRecords || 0} nhân viên
                    </p>
                    <div className={styles.page_btns}>
                        <button
                            className="material-symbols-outlined"
                            onClick={() => handlePageChange('prev')}
                            disabled={page === 1}
                        >
                            chevron_left
                        </button>
                        {Array.from({ length: staffList?.totalPages || 0 }, (_, i) => (
                            <button
                                key={i}
                                className={cls(page === i + 1 && styles.active_page)}
                                onClick={() => setPage(i + 1)}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            className="material-symbols-outlined"
                            onClick={() => handlePageChange('next')}
                            disabled={page === staffList?.totalPages}
                        >
                            chevron_right
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
