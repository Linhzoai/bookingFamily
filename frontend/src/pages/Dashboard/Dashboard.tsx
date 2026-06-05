/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from './style.module.scss';
import StatsCard from '@components/StatsCard/StatsCard';
import RecentBookings from './components/RecentBookings/RecentBookings';
import BookingChart from './components/BookingChart/BookingChart';
import StaffPromotion from './components/StaffPromotion/StaffPromotion';
import RecentNotifications from './components/RecentNotifications/RecentNotifications';
import LoadingComponent from '@/components/Loading/Loading';
import { useGetQuery } from '@/hooks/useQueryCustom';
import { bookingService } from '@/services/bookingService';
import { reportService } from '@/services/reportSevice';

const getCurrentWeekDateRange = () =>{
    const now = new Date();
    const day = now.getDay();
    const diffToMonday = day===0 ? 6 : day -1;
    const monday = new Date(now);
    monday.setDate(now.getDate() - diffToMonday);
    
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    return { monday, sunday };
    
}
const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
}
const formatDataForChart = (data: any) => {
    const weekdays = [ 'Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7' ];
    const result = weekdays.map((day) => ({
        label: day,
        value: 0
    }));
    data.forEach((item) => {
        const [year, month, day] = item.recordDate.split('-');
        const date = new Date( Number(year), Number(month) - 1, Number(day) );
        const dayOfWeek = date.getDay();
        result[dayOfWeek].value = Number(item.totalBookings);
    });
    return result;
} 
export default function Dashboard() {
    const { container, stats_grid, main_grid } = styles;
    const {data, isLoading} = useGetQuery("bookings",bookingService.getAllBookings)
    const {monday, sunday} = getCurrentWeekDateRange();
    const query = `from=${formatDate(monday)}&to=${formatDate(sunday)}`
    const {data: dataReport} = useGetQuery("report", reportService.getReportRevenue, query);
        const statsData = [
        {
            icon: 'payments',
            title: 'Doanh thu hôm nay',
            value: `${dataReport?.reduce((a: number,b: {totalAmounts: number}) => a + Number(b.totalAmounts), 0)} VND`,
            trend: '+12% so với hôm qua',
            trendType: 'positive' as const
        },
        {
            icon: 'calendar_add_on',
            title: 'Lịch đặt mới',
            value: `${dataReport?.reduce((a: number,b: {totalBookings: number}) => a + Number(b.totalBookings), 0)} Đơn hàng`,
            trend: '+4 đơn mới',
            trendType: 'positive' as const
        },
        {
            icon: 'engineering',
            title: 'Nhân viên đang làm việc',
            value: '18/25 Người',
            trend: '7 người đang nghỉ',
            trendType: 'neutral' as const
        },
        {
            icon: 'star',
            title: 'Đánh giá trung bình',
            value: '4.8 / 5.0',
            trend: 'Tăng 0.2',
            trendType: 'positive' as const
        }
    ];
    if(isLoading){
        return <LoadingComponent/>
    }

    return (
        <div className={container}>
            <div className={styles.header}>
                <h2 className={styles.title}>Tổng quan Dashoard</h2>
                <p className={styles.subtitle}>Chào mừng trở lại! Đây là tóm tắt hoạt động hệ thống hôm nay.</p>
            </div>

            {/* Overview Stats */}
            <section className={stats_grid}>
                {statsData.map((stat, index) => (
                    <StatsCard key={index} {...stat} />
                ))}
            </section>

            {/* Main Content: Table & Chart */}
            <div className={main_grid}>
                <div className={styles.left_col}>
                    <RecentBookings bookings={data?.data} />
                    <StaffPromotion />
                </div>
                <div className={styles.right_col}>
                    <BookingChart reportData = {formatDataForChart(dataReport)}  cancelRate = {(dataReport?.reduce((a: number,b: {totalCancelledBookings: number}) => a + Number(b.totalCancelledBookings), 0)/dataReport?.reduce((a: number,b: {totalBookings: number}) => a + Number(b.totalBookings), 0)) * 100  }/>
                    <RecentNotifications />
                </div>
            </div>
        </div>
    );
}
