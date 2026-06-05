import { useState, useMemo } from 'react';
import styles from './style.module.scss';
import StatsCard from '@/components/StatsCard/StatsCard';
import RevenueChart from './components/RevenueChart/RevenueChart';
import SelectCommon from '@/components/SelectCommon/SelectCommon';
import LoadingComponent from '@/components/Loading/Loading';
import { useGetQuery } from '@/hooks/useQueryCustom';
import { reportService } from '@/services/reportSevice';

export default function Report() {
    const [groupBy, setGroupBy] = useState('day');
    
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 6);
    
    const formatDate = (date: Date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    };

    const [fromDate, setFromDate] = useState(formatDate(lastWeek));
    const [toDate, setToDate] = useState(formatDate(today));
    const [status, setStatus] = useState('all');

    const query = `groupBy=${groupBy}&from=${fromDate}&to=${toDate}&status=${status}`;

    const { data: dataReport, isLoading } = useGetQuery("report", reportService.getReportRevenue,query);

    const totalRevenue = useMemo(() => {
        if (!dataReport) return 0;
        return dataReport.reduce((a, b) => a + Number(b.totalAmounts || 0), 0);
    }, [dataReport]);

    const totalBooking = useMemo(() => {
        if (!dataReport) return 0;
        return dataReport.reduce((a, b) => a + Number(b.totalBookings || 0), 0);
    }, [dataReport]);

    const avgRevenue = totalBooking > 0 ? totalRevenue / totalBooking : 0;

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    const chartData = useMemo(() => {
        if (!dataReport) return [];
        return dataReport.map((item) => ({
            label: item.recordDate,
            value: Number(item.totalAmounts || 0),
            totalBooking: Number(item.totalBookings || 0)
        }));
    }, [dataReport]);

    const statsData = [
        {
            icon: 'payments',
            title: 'Tổng doanh thu',
            value: formatCurrency(totalRevenue),
            trendType: 'positive' as const
        },
        {
            icon: 'receipt_long',
            title: 'Tổng đơn hàng',
            value: `${totalBooking} Đơn`,
            trendType: 'positive' as const
        },
        {
            icon: 'analytics',
            title: 'Doanh thu trung bình/Đơn',
            value: formatCurrency(avgRevenue),
            trendType: 'neutral' as const
        }
    ];

    const groupByOptions = [
        { label: 'Theo ngày', value: 'day' },
        { label: 'Theo tháng', value: 'month' },
        { label: 'Theo năm', value: 'year' },
    ];

    const statusOptions = [
        { label: 'Tất cả', value: 'all' },
        { label: 'Hoàn thành', value: 'completed' },
        { label: 'Đã hủy', value: 'cancelled' },
        { label: 'Đang đặt', value: 'ordered' },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.title_area}>
                    <h2 className={styles.title}>Báo cáo doanh thu</h2>
                    <p className={styles.subtitle}>Thống kê doanh thu và lượt đặt lịch theo thời gian</p>
                </div>
                
                <div className={styles.filters}>
                    <SelectCommon 
                        options={groupByOptions} 
                        value={groupBy} 
                        onChange={(e) => setGroupBy(e.target.value)} 
                        placeholder="Nhóm theo" 
                    />
                    <SelectCommon 
                        options={statusOptions} 
                        value={status} 
                        onChange={(e) => setStatus(e.target.value)} 
                        placeholder="Trạng thái" 
                    />
                    <input 
                        type="date" 
                        className={styles.date_input} 
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                    />
                    <span className={styles.separator}>-</span>
                    <input 
                        type="date" 
                        className={styles.date_input} 
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                    />
                </div>
            </div>

            <section className={styles.stats_grid}>
                {statsData.map((stat, index) => (
                    <StatsCard key={index} {...stat} />
                ))}
            </section>

            <div className={styles.chart_container}>
                {isLoading ? (
                    <div className={styles.loading_wrapper}><LoadingComponent /></div>
                ) : (
                    <RevenueChart reportData={chartData} />
                )}
            </div>
        </div>
    );
}
