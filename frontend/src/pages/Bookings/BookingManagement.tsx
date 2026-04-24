/* eslint-disable no-case-declarations */

import styles from './style.module.scss';
import StatusBadge from '@components/StatusBadge/StatusBadge';
import { useDeleteQuery, useGetQuery } from '@/hooks/useQueryCustom';
import { bookingService } from '@/services/bookingService';
import formatDate from '@/utils/formatDate';
import { AreaService } from '@/services/areaService';
import SelectCommon from '@/components/SelectCommon/SelectCommon';
import { useState } from 'react';
import { staffService } from '@/services/staffService';
import SelectSearch from '@/components/SelectSearch/SelectSearch';
import cls from 'classnames';
import type { Booking } from '@/types/booking';
import { useSideBarStore } from '@/stores/useSidebarStore';
import Loading from '@/components/LoadingCommon/Loading';
import { toast } from 'react-toastify';
import { assignBookingService } from '@/services/assignBookingService';

export default function BookingManagement() {
    const statusData = [
        { label: 'Tất cả trạng thái', value: '' },
        { label: 'Đang chờ', value: 'pending' },
        { label: 'Đã xác nhận', value: 'accepted' },
        { label: 'Đang thực hiện', value: 'in_progress' },
        { label: 'Đã hoàn thành', value: 'completed' },
        { label: 'Đã hủy', value: 'cancelled' }
    ];
    const [status, setStatus] = useState<string>('');
    const [areaId, setAreaId] = useState<string>('');
    const [staffId, setStaffId] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);

    const query = `status=${status}&areaId=${areaId}&staffId=${staffId}&page=${page}`;
    const { data: bookings,  isRefetching } = useGetQuery('bookings', bookingService.getAllBookings, query);
    const { data: staffs } = useGetQuery('staff', staffService.getAllStaff);
    const { data: areas } = useGetQuery('areas', AreaService.getAllAreas);
    const dataArea = (areas?.data ?? []).map((item) => ({ label: item.name, value: item.id }));
    const dataStaff = (staffs?.data ?? []).map((item) => ({ label: item.name, value: item.id }));
    const {mutate: deleteBooking, isPending: isUnssign} = useDeleteQuery('bookings', bookingService.deleteBooking, 'Đơn đặt lịch')
    const { mutate, isPending: isdelete } = useDeleteQuery( 'bookings', assignBookingService.deleteAssignBooking, 'Phân công' );
    const { toggleType } = useSideBarStore();
    const handleAction = (type: string, booking?: Booking) => {
        switch (type) {
            case 'assign':
                if (booking?.staff) {
                    toast.warning('Booking đã được phân công nhân viên');
                } else {
                    toggleType('assignment_booking', {booking});
                }
                break;
            case 'cancel_assign':
                const staffAssign = booking.staffAssignments.pop();
                if (staffAssign?.status === 'assigned') {
                    mutate(staffAssign.id);
                }
                else {
                    toast.warning('Booking đã được nhận, ko thể hủy phân công');
                }
                break;
            case 'update':
                toggleType('update_booking', {booking});
                break;
            case 'delete':
                deleteBooking(booking.id)
                break;
            default:
                break;
        }
    };
    const handlePageChange = (type: string) => {
        if(type === 'next') {
            if(page < bookings?.totalPages) {
                setPage(page + 1);
            }
        } else {
            if(page > 1) {
                setPage(page - 1);
            }
        }
    }



    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h2 className={styles.title}>Quản lý Lịch đặt</h2>
                    <p className={styles.subtitle}>Theo dõi và điều phối 124 lịch hẹn trong ngày hôm nay.</p>
                </div>
                <button className={styles.add_btn} onClick={()=> toggleType('create_booking')}>

                    <span className="material-symbols-outlined">add</span>
                    Tạo Booking
                </button>
            </div>

            {/* Filter Bar */}
            <section className={styles.filter_bar}>
                <div className={styles.filter_group}>
                    <label>Khu vực</label>
                    <SelectCommon
                        options={dataArea}
                        placeholder="Tất cả khu vực"
                        onChange={(e) => setAreaId(e.target.value)}
                    />
                </div>
                <div className={styles.filter_group}>
                    <label>Trạng thái</label>
                    <SelectCommon
                        options={statusData}
                        placeholder="Tất cả trạng thái"
                        onChange={(e) => setStatus(e.target.value)}
                    />
                </div>
                <div className={styles.filter_group}>
                    <label>Nhân viên</label>
                    <SelectSearch
                        options={dataStaff}
                        placeholder="Tất cả nhân viên"
                        onChange={(e) => setStaffId(e.target.value)}
                    />
                </div>
                <div className={styles.filter_group_wide}>
                    <label>Khoảng thời gian</label>
                    <input type="text" defaultValue="12/10/2023 - 14/10/2023" />
                </div>
                <button className={styles.refresh_btn}>
                    <span className="material-symbols-outlined">refresh</span>
                </button>
            </section>

            {/* Table */}
            <div className={styles.table_card}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Mã</th>
                            <th>Khách hàng</th>
                            <th>Dịch vụ</th>
                            <th>Lịch hẹn</th>
                            <th>Khu vực</th>
                            <th>Phân công</th>
                            <th>Trạng thái</th>
                            <th className={styles.text_right}>Tổng tiền</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {(isRefetching || isdelete || isUnssign) && <Loading />}
                        {bookings?.data.map((bk) => (
                            <tr key={bk.id}>
                                <td className={styles.id_cell}>{bk.id}</td>
                                <td>
                                    <div className={styles.bold_text}>{bk.customer.name}</div>
                                    <div className={styles.mono_text_xs}>{bk.customer.phone}</div>
                                </td>
                                <td>
                                    <div className={styles.medium_text}>
                                        {bk.bookingDetails
                                            .map((item) => item.service.name + ' x ' + item.quantity)
                                            .join(', ')}
                                    </div>
                                    <div className={styles.secondary_text_xs}>
                                        {bk.bookingDetails.reduce(
                                            (acc, item) => acc + item.service.duration * item.quantity,
                                            0
                                        )}
                                    </div>
                                </td>
                                <td>
                                    <div className={styles.mono_text_sm}>{formatDate(bk.scheduledTime)}</div>
                                </td>
                                <td>{bk.address}</td>
                                <td>
                                    {bk.staff ? (
                                        <div className={styles.staff_info}>
                                            <img src={bk.staff?.avatarUrl} alt={bk.staff?.name} />
                                            <span>{bk.staff?.name}</span>
                                        </div>
                                    ) : (
                                        <span className={styles.unassigned}>
                                            <span className="material-symbols-outlined">priority_high</span>
                                            Cần phân công
                                        </span>
                                    )}
                                </td>
                                <td className={styles.text_center}>
                                    <StatusBadge status={bk.status} text={bk.status} />
                                </td>
                                <td className={styles.amount_cell}>
                                    {bk.bookingDetails
                                        .reduce((acc, item) => acc + item.service.price * item.quantity, 0)
                                        .toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                </td>
                                <td className={styles.action_cell}>
                                    <button className="material-symbols-outlined" onClick={(    ) => setActiveMenu((prev) => prev === bk.id ? null : bk.id)} >more_vert</button>
                                    <div className={cls(styles.action_menu, activeMenu === bk.id && styles.active)}>
                                        <button disabled={!!bk?.staff} onClick={() => handleAction('assign', bk)}>
                                            Phân công
                                        </button>
                                        <button disabled={!bk?.staff} onClick={() => handleAction('cancel_assign', bk)}>
                                            Hủy phân quyền
                                        </button>
                                        <button onClick={()=> handleAction('update', bk)}>Xem chi tiết</button>
                                        <button onClick={()=> handleAction('delete', bk)}>Xóa</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className={styles.pagination}>                                                
                    <p>
                        Showing {bookings?.pageNumber - 1}1-{bookings?.pageSize * bookings?.pageNumber} of{' '}
                        {bookings?.totalRecords} bookings
                    </p>
                    <div className={styles.page_btns}>
                        <button className="material-symbols-outlined" onClick={() => handlePageChange('prev')} disabled={page === 1}>chevron_left</button>
                        {Array.from({ length: bookings?.totalPages }, (_, i) => (
                            <button key={i} className={cls(page === i + 1 && styles.active_page)} onClick={() => setPage(i + 1)}>{i + 1}</button>
                        ))}
                        <button className="material-symbols-outlined" onClick={() => handlePageChange('next')} disabled={page === bookings?.totalPages}>chevron_right</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
