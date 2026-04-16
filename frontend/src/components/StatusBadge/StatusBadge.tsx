import React from 'react';
import styles from './style.module.scss';

interface StatusBadgeProps {
    status: string; // 'pending' | 'in_progress' | 'completed' | 'canceled'
    text: string;
}

export default function StatusBadge({ status, text }: StatusBadgeProps) {
    const statusClass = status.toLowerCase().replace(' ', '_');
    return (
        <span className={`${styles.badge} ${styles[statusClass] || styles.default}`}>
            <span className={styles.dot}></span>
            {text}
        </span>
    );
}
