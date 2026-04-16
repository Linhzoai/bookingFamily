import React from 'react';
import styles from './style.module.scss';

const notifications = [
    { id: 1, text: 'Lịch đặt #BF-8902 bị trễ 15p', time: '2 phút trước', type: 'error' },
    { id: 2, text: 'Hoàn tất thanh toán #BF-8895', time: '45 phút trước', type: 'success' },
    { id: 3, text: 'Khách hàng mới: Trần Văn Phú', time: '1 giờ trước', type: 'info' },
];

export default function RecentNotifications() {
    return (
        <section className={styles.container}>
            <h3 className={styles.title}>Thông báo gần đây</h3>
            <div className={styles.list}>
                {notifications.map((n) => (
                    <div key={n.id} className={styles.item}>
                        <div className={`${styles.dot} ${styles[n.type]}`}></div>
                        <div className={styles.content}>
                            <p className={styles.text}>{n.text}</p>
                            <p className={styles.time}>{n.time}</p>
                        </div>
                    </div>
                ))}
            </div>
            <button className={styles.view_all}>Xem tất cả</button>
        </section>
    );
}
