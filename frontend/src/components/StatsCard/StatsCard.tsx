import React from 'react';
import styles from './style.module.scss';

interface StatsCardProps {
    icon: string;
    title: string;
    value: string;
    trend?: string;
    trendType?: 'positive' | 'negative' | 'neutral';
}

export default function StatsCard({ icon, title, value, trend, trendType = 'neutral' }: StatsCardProps) {
    return (
        <div className={styles.card}>
            <div className={styles.content}>
                <p className={styles.label}>{title}</p>
                <h3 className={styles.value}>{value}</h3>
                {trend && (
                    <div className={`${styles.trend} ${styles[trendType]}`}>
                        <span className="material-symbols-outlined">
                            {trendType === 'positive' ? 'trending_up' : trendType === 'negative' ? 'trending_down' : 'trending_flat'}
                        </span>
                        {trend}
                    </div>
                )}
            </div>
            <div className={styles.icon_box}>
                <span className="material-symbols-outlined">{icon}</span>
            </div>
        </div>
    );
}
