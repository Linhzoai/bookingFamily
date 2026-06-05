import React from 'react';
import styles from './style.module.scss';

interface IProps {
    reportData: Array<{ label: string, value: number }>;
    cancelRate: number;
}

export default function BookingChart({ reportData, cancelRate }: IProps) {
    const maxBooking = Math.max(...reportData.map(item => item.value)) || 0;
    return (
        <section className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>Lượt đặt tuần này</h2>
                <div className={styles.tabs}>
                    <button className={styles.active}>Tuần</button>
                    <button>Tháng</button>
                </div>
            </div>

            <div className={styles.chart_area}>
                <div className={styles.bars}>
                    {reportData.map((day, index) => (
                        <div key={index} className={styles.bar_wrapper}>
                            <div 
                                className={styles.bar} 
                                style={{ height: `${(day.value / maxBooking) * 100}%` }}
                            >
                                <div className={styles.tooltip}>{day.value}</div>
                            </div>
                            <span className={styles.label}>{day.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.stats}>
                <div className={styles.stat_item}>
                    <div>
                        <p className={styles.stat_label}>Tổng lượt đặt</p>
                        <p className={styles.stat_value}>{reportData.reduce((a,b) => a + b.value, 0)}</p>
                    </div>
                    <div className={styles.stat_change_pos}></div>
                </div>
                <div className={styles.stat_item}>
                    <div>
                        <p className={styles.stat_label}>Tỷ lệ hủy</p>
                        <p className={styles.stat_value}>{cancelRate}%</p>
                    </div>
                    <div className={styles.stat_change_neg}></div>
                </div>
            </div>
        </section>
    );
}
