import React from 'react';
import styles from './style.module.scss';

const mockCustomers = [
    { id: 'KH-001', name: 'Nguyễn Văn An', joinDate: '12/10/2023', phone: '0901.234.567', email: 'an.nv@gmail.com', bookings: 12, totalSpent: '5.400.000đ', rank: 'Premium', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAAlC2_RZce5XvzB8JMwL2SoQA4HThO3FjPQXxVnlrIqSghpFWfpKyOFecHNG5cibrzIqX-s6_W8-1HfBBj3NJsWIYjYyF18DRIAYTbb32Erg_ABKSX0GEVcqWzDc8LfH6Cb8o2MhbOCve9SpMUv_hflOwKZfU4jNOLavCrsCiauCAdujO7MKkU4m0-Gb3a45q0xcfgto9paZejok2GDpvhGV8VV89-vP5GOz0trgbnw3MocoG-wxOkyKJ4HbWYdab8-9vb4xdHEK4' },
    { id: 'KH-002', name: 'Trần Thị Lan', joinDate: '05/11/2023', phone: '0988.776.655', email: 'lan.tt@yahoo.com', bookings: 4, totalSpent: '1.250.000đ', rank: 'Standard', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAuItfAnoM55O54vxRsn9RLEKRAZcTb9Roz7X1GiMZwETKR-i65996nR3tZbCIh0sh4gcE0GFvVS6sen9hVNSfTXw-W2guT8ehpVUlPYlLVpGANAO5iH_5sdloiLtPDTpz7iVD3pfez-wSKZQcL_g2sPPYJ-aLCDHs4OrIdDecLcgheWt6tSph72s_fCp2VPDD_4UUylicE2bpw-mo_DAlHYgfW21WcSwOE52z-9PCXEQaYhXRdijvn55w9mWdr1PO7z7Pb5sit1qo' },
    { id: 'KH-003', name: 'Lê Hoàng Nam', joinDate: '01/01/2024', phone: '0912.333.444', email: 'namle@fpt.com.vn', bookings: 48, totalSpent: '24.600.000đ', rank: 'VIP', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSMXyKmqtw2L_ProdjfFP6IHQIkeKQvR8mlIsvqq4t-CrCh0dkrkFFM_idHPHh0lmguWuwfz6NDuwnG2idTca3ZHPAE0x6smaw6RMtVUFNsIT1-UsIvMlj3AKi2QTwDmCtNIrfpxw5lncqWIBsKvvRxnlOzOLzzAUxp4pwmow7UgIGiNSffecR_rUd307uy7fAv2Fh6HQHTOzLCndPDg4k7f5JNvNnMXUlEhAP-BUtlE5vvn9w61RrndAhw7NSkg6VdO8dX1ULRrg' },
];

export default function CustomerManagement() {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h2 className={styles.title}>Quản lý Khách hàng</h2>
                    <p className={styles.subtitle}>Theo dõi và quản lý dữ liệu thành viên trong hệ thống.</p>
                </div>
                <div className={styles.actions}>
                    <button className={styles.export_btn}>
                        <span className="material-symbols-outlined">download</span>
                        Xuất báo cáo
                    </button>
                    <button className={styles.add_btn}>
                        <span className="material-symbols-outlined">add</span>
                        Thêm Khách hàng
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className={styles.stats_grid}>
                <div className={styles.stat_card}>
                    <p className={styles.stat_label}>Tổng khách hàng</p>
                    <h3 className={styles.stat_value}>1,284</h3>
                    <div className={styles.stat_trend_pos}>+12% tháng này</div>
                </div>
                <div className={styles.stat_card}>
                    <p className={styles.stat_label}>Thành viên VIP</p>
                    <h3 className={styles.stat_value}>156</h3>
                    <div className={styles.stat_trend_info}>Premium chiếm 12%</div>
                </div>
                <div className={styles.stat_card_wide}>
                    <div className={styles.wide_content}>
                        <p className={styles.stat_label_light}>Doanh thu tích lũy</p>
                        <h3 className={styles.stat_value_large}>2.480.000.000₫</h3>
                        <p className={styles.stat_info_light}>Trung bình 1.9M / KH</p>
                    </div>
                    <div className={styles.badge}>Đã tối ưu</div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className={styles.filter_bar}>
                <div className={styles.search_box}>
                    <span className="material-symbols-outlined">person_search</span>
                    <input type="text" placeholder="Tìm theo Tên hoặc Số điện thoại..." />
                </div>
                <div className={styles.select_box}>
                    <label>Hạng:</label>
                    <select><option>Tất cả</option></select>
                </div>
                <div className={styles.date_box}>
                    <span className="material-symbols-outlined">calendar_month</span>
                    <input type="date" />
                </div>
            </div>

            {/* Table */}
            <div className={styles.table_card}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Mã KH</th>
                            <th>Khách hàng</th>
                            <th>Liên hệ</th>
                            <th className={styles.text_center}>Booking</th>
                            <th>Tổng chi tiêu</th>
                            <th>Hạng</th>
                            <th className={styles.text_right}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockCustomers.map((cust) => (
                            <tr key={cust.id}>
                                <td className={styles.mono_text}>{cust.id}</td>
                                <td>
                                    <div className={styles.cust_info}>
                                        <img src={cust.avatar} alt={cust.name} />
                                        <div>
                                            <p className={styles.cust_name}>{cust.name}</p>
                                            <p className={styles.cust_date}>Tham gia: {cust.joinDate}</p>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className={styles.contact_info}>
                                        <p>{cust.phone}</p>
                                        <p className={styles.email}>{cust.email}</p>
                                    </div>
                                </td>
                                <td className={styles.text_center}>
                                    <span className={styles.booking_count}>{cust.bookings}</span>
                                </td>
                                <td className={styles.amount_text}>{cust.totalSpent}</td>
                                <td>
                                    <span className={`${styles.rank_badge} ${styles[cust.rank.toLowerCase()]}`}>
                                        {cust.rank}
                                    </span>
                                </td>
                                <td className={styles.action_cell}>
                                    <div className={styles.action_btns}>
                                        <button className="material-symbols-outlined">visibility</button>
                                        <button className="material-symbols-outlined">notifications_active</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
