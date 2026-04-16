/* eslint-disable react-hooks/exhaustive-deps */
import styles from './style.module.scss';
import StatusBadge from '@components/StatusBadge/StatusBadge';
import type { Booking } from '@/types/booking';
import formatDate from '@/utils/formatDate';
import SelectCommon from '@/components/SelectCommon/SelectCommon';
import { useMemo, useState } from 'react';
import { useGetQuery } from '@/hooks/useQueryCustom';
import { AreaService } from '@/services/areaService';

interface RecentBookingsProps {
    bookings: Booking[];
}
export default function RecentBookings({bookings}: RecentBookingsProps) {
    const {data, isLoading} = useGetQuery('areas', AreaService.getAllAreas);
    const [areaId, setAreaId] = useState<number | ''>('');
    const dataArea = (data?.data ?? []).map((item)=> ({label: item.name, value: item.id}));
    
    const handleChoiceArea = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setAreaId(value === '' ? '' : Number(value));
    }
    const filteredBookings = useMemo(() => {
        if (areaId !== '') {
            return bookings.filter((item) => item?.area?.path?.includes(`/${areaId}/`));
        }
        return bookings.slice(0, 5);
    }, [areaId, bookings]);
    return (
        <section className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>Bookings Gần Đây</h2>
                <div className={styles.actions}>
                    <SelectCommon options={dataArea} placeholder={isLoading? 'Đang tải dl': 'Khu vực'} onChange={handleChoiceArea} />
                </div>
            </div>
            <div className={styles.table_wrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Mã Booking</th>
                            <th>Khách hàng</th>
                            <th>Dịch vụ</th>
                            <th>Nhân viên</th>
                            <th>Thời gian</th>
                            <th>Trạng thái</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBookings.slice(0, 5).map((item) => (
                            <tr key={item.id}>
                                <td className={styles.id}>{item.id}</td>
                                <td>
                                    <div className={styles.customer_name}>{item.customer.name}</div>
                                    <div className={styles.customer_phone}>{item.customer.phone}</div>
                                </td>
                                <td className={styles.text_small}>{item.bookingDetails.map((detail) => detail.service.name).join(' , ')}</td>
                                <td className={styles.text_small}>{item.staff ? item.staff.name : ''}</td>
                                <td className={styles.text_small}>{formatDate(item.scheduledTime)}</td>
                                <td>
                                    <StatusBadge status={item.status} text={item.status} />
                                </td>
                                <td className={styles.actions_cell}>
                                    <button className="material-symbols-outlined">more_vert</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
