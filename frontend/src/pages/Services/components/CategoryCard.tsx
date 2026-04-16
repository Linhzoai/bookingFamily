import React from 'react';
import styles from './style.module.scss';

interface CategoryCardProps {
    title: string;
    count: number;
    icon: string;
}

export default function CategoryCard({ title, count, icon }: CategoryCardProps) {
    return (
        <div className={styles.card}>
            <div className={styles.icon_box}>
                <span className="material-symbols-outlined">{icon}</span>
            </div>
            <div className={styles.info}>
                <h4 className={styles.title}>{title}</h4>
                <p className={styles.count}>{count} dịch vụ</p>
            </div>
        </div>
    );
}
