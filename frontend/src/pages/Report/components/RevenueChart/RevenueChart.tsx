import React from 'react';
import styles from './style.module.scss';

interface IProps {
    reportData: Array<{ label: string, value: number, totalBooking: number }>;
}

export default function RevenueChart({ reportData }: IProps) {
    const maxRevenue = Math.max(...reportData.map(item => item.value)) || 0;
    
    // Format currency VND
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    return (
        <section className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>Biểu đồ doanh thu</h2>
            </div>

            <div className={styles.chart_area}>
                <div className={styles.bars}>
                    {reportData.map((item, index) => (
                        <div key={index} className={styles.bar_wrapper}>
                            <div 
                                className={styles.bar} 
                                style={{ height: maxRevenue > 0 ? `${(item.value / maxRevenue) * 100}%` : '0%' }}
                            >
                                <div className={styles.tooltip}>
                                    <p>{formatCurrency(item.value)}</p>
                                    <p>{item.totalBooking} Đơn</p>
                                </div>
                            </div>
                            <span className={styles.label}>{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
