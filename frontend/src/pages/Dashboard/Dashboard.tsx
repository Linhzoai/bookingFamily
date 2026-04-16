import styles from './style.module.scss';
import StatsCard from '@components/StatsCard/StatsCard';
import RecentBookings from './components/RecentBookings/RecentBookings';
import BookingChart from './components/BookingChart/BookingChart';
import StaffPromotion from './components/StaffPromotion/StaffPromotion';
import RecentNotifications from './components/RecentNotifications/RecentNotifications';
import LoadingComponent from '@/components/Loading/Loading';
import { useGetQuery } from '@/hooks/useQueryCustom';
import { bookingService } from '@/services/bookingService';
export default function Dashboard() {
    const { container, stats_grid, main_grid } = styles;
    const statsData = [
        {
            icon: 'payments',
            title: 'Doanh thu hôm nay',
            value: '5,400,000 VND',
            trend: '+12% so với hôm qua',
            trendType: 'positive' as const
        },
        {
            icon: 'calendar_add_on',
            title: 'Lịch đặt mới',
            value: '24 Đơn hàng',
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
    const {data, isLoading} = useGetQuery("bookings",bookingService.getAllBookings)
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
                    <BookingChart />
                    <RecentNotifications />
                </div>
            </div>
        </div>
    );
}
