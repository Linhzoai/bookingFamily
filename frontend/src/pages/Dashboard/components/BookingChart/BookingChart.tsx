import React from 'react';
import styles from './style.module.scss';

export default function BookingChart() {
    const days = [
        { label: 'T2', value: 40 },
        { label: 'T3', value: 55 },
        { label: 'T4', value: 75 },
        { label: 'T5', value: 95, active: true },
        { label: 'T6', value: 65 },
        { label: 'T7', value: 85 },
        { label: 'CN', value: 50 },
    ];

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
                    {days.map((day, index) => (
                        <div key={index} className={styles.bar_wrapper}>
                            <div 
                                className={`${styles.bar} ${day.active ? styles.bar_active : ''}`} 
                                style={{ height: `${day.value}%` }}
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
                        <p className={styles.stat_value}>153</p>
                    </div>
                    <div className={styles.stat_change_pos}>+12%</div>
                </div>
                <div className={styles.stat_item}>
                    <div>
                        <p className={styles.stat_label}>Tỷ lệ hủy</p>
                        <p className={styles.stat_value}>2.4%</p>
                    </div>
                    <div className={styles.stat_change_neg}>-0.5%</div>
                </div>
            </div>
        </section>
    );
}
