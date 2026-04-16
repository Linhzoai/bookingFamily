import styles from './style.module.scss';
import StatusBadge from '@components/StatusBadge/StatusBadge';
import { useGetQuery } from '@/hooks/useQueryCustom';
import { bookingService } from '@/services/bookingService';
import formatDate from '@/utils/formatDate';
import { AreaService } from '@/services/areaService';
import SelectCommon from '@/components/SelectCommon/SelectCommon';
import { useState } from 'react';

const statusData = [
    { label: 'Tất cả trạng thái', value: '' },
    { label: 'Đang chờ', value: 'pending' },
    { label: 'Đã xác nhận', value: 'accepted' },
    { label: 'Đang thực hiện', value: 'in_progress' },
    { label: 'Đã hoàn thành', value: 'completed' },
    { label: 'Đã hủy', value: 'cancelled' }
] as const;

type BookingStatus = typeof statusData[number]['value'];
export default function BookingManagement() {
    const [status, setStatus] = useState<BookingStatus>('');
    const { data: bookings } = useGetQuery('bookings', bookingService.getAllBookings);
    const { data: areas } = useGetQuery('areas', AreaService.getAllAreas);
    const dataArea = (areas?.data ?? []).map((item) => ({ label: item.name, value: item.id }));
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h2 className={styles.title}>Quản lý Lịch đặt</h2>
                    <p className={styles.subtitle}>Theo dõi và điều phối 124 lịch hẹn trong ngày hôm nay.</p>
                </div>
                <button className={styles.add_btn}>
                    <span className="material-symbols-outlined">add</span>
                    Tạo Booking
                </button>
            </div>

            {/* Filter Bar */}
            <section className={styles.filter_bar}>
                <div className={styles.filter_group}>
                    <label>Khu vực</label>
                    <SelectCommon options={dataArea} placeholder="Tất cả khu vực" />
                </div>
                <div className={styles.filter_group}>
                    <label>Trạng thái</label>
                    <select>
                        <option>Tất cả trạng thái</option>
                    </select>
                </div>
                <div className={styles.filter_group}>
                    <label>Nhân viên</label>
                    <select>
                        <option>Chọn nhân viên</option>
                    </select>
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
                                    <button className="material-symbols-outlined">more_vert</button>
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
                        <button className="material-symbols-outlined">chevron_left</button>
                        <button className={styles.active_page}>1</button>
                        <button>2</button>
                        <button className="material-symbols-outlined">chevron_right</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
