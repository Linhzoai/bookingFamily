import React from 'react';
import styles from './style.module.scss';
import CategoryCard from './components/CategoryCard';

const mockServices = [
    { id: 'SV-001', name: 'Dọn dẹp nhà cửa', category: 'Vệ sinh', price: '150.000đ/h', duration: '2-4 giờ', status: 'active', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDt8-w3J8M-H1Y_hYq_S6iY6-rG7O5T-X_Y7-g-P-H-j-P-S-f-w-W-P-H-v-G' },
    { id: 'SV-002', name: 'Chăm sóc trẻ em', category: 'Trông trẻ', price: '200.000đ/h', duration: '4-8 giờ', status: 'active', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDu8-w3J8M-H1Y_hYq_S6iY6-rG7O5T-X_Y7-g-P-H-j-P-S-f-w-W-P-H-v-G' },
    { id: 'SV-003', name: 'Sửa chữa điện nước', category: 'Kỹ thuật', price: '300.000đ/lần', duration: '1-3 giờ', status: 'inactive', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDv8-w3J8M-H1Y_hYq_S6iY6-rG7O5T-X_Y7-g-P-H-j-P-S-f-w-W-P-H-v-G' },
];

export default function ServiceManagement() {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h2 className={styles.title}>Quản lý Dịch vụ</h2>
                    <p className={styles.subtitle}>Thiết lập và điều chỉnh danh mục dịch vụ cung cấp.</p>
                </div>
                <button className={styles.add_btn}>
                    <span className="material-symbols-outlined">add</span>
                    Thêm dịch vụ mới
                </button>
            </div>

            <div className={styles.categories_grid}>
                <CategoryCard title="Vệ sinh" count={12} icon="cleaning_services" />
                <CategoryCard title="Trông trẻ" count={5} icon="child_care" />
                <CategoryCard title="Kỹ thuật" count={8} icon="engineering" />
                <CategoryCard title="Đi chợ" count={3} icon="shopping_basket" />
            </div>

            <div className={styles.table_card}>
                <div className={styles.table_header}>
                    <h3>Danh sách dịch vụ</h3>
                    <div className={styles.search_box}>
                        <span className="material-symbols-outlined">search</span>
                        <input type="text" placeholder="Tìm kiếm dịch vụ..." />
                    </div>
                </div>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Dịch vụ</th>
                            <th>Giá cơ bản</th>
                            <th>Thời lượng TB</th>
                            <th>Trạng thái</th>
                            <th className={styles.text_right}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockServices.map((sv) => (
                            <tr key={sv.id}>
                                <td>
                                    <div className={styles.service_info}>
                                        <img src={sv.image} alt={sv.name} />
                                        <div>
                                            <p className={styles.service_name}>{sv.name}</p>
                                            <p className={styles.service_cat}>{sv.category}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className={styles.price_text}>{sv.price}</td>
                                <td className={styles.time_text}>{sv.duration}</td>
                                <td>
                                    {sv.status === 'active' ? (
                                        <span className={styles.status_active}>
                                            <span className="material-symbols-outlined">check_circle</span>
                                            Đang bán
                                        </span>
                                    ) : (
                                        <span className={styles.status_inactive}>
                                            <span className="material-symbols-outlined">pause_circle</span>
                                            Tạm ngưng
                                        </span>
                                    )}
                                </td>
                                <td className={styles.action_btns}>
                                    <button className="material-symbols-outlined">edit</button>
                                    <button className="material-symbols-outlined">delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
