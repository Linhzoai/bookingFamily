import type { Area } from '@/types/booking';
import styles from '../../style.module.scss';
import formatDate from '@/utils/formatDate';
interface AreaServiceProps {
    areas: Area[];
    handleOpenForm: (type: string) => void;
    handleAddAreaDate: (data: Area) => void;
}
export default function AreaSystem({ areas, handleOpenForm, handleAddAreaDate }: AreaServiceProps) {
    return (
        <div className={styles.table_section}>
            <div className={styles.section_header}>
                <div>
                    <h3 className={styles.section_title}>Quản lý Khu vực hoạt động</h3>
                    <p className={styles.section_subtitle}>Cấu hình và điều chỉnh phạm vi dịch vụ của hệ thống.</p>
                </div>
                <button className={styles.add_btn} onClick={() => handleOpenForm('create')}>
                    <span className="material-symbols-outlined">add</span>
                    Thêm khu vực mới
                </button>
            </div>

            <div className={styles.table_wrapper}>
                <div className={styles.table_head}>
                    <span>Mã Khu vực</span>
                    <span>Tên Khu vực</span>
                    <span className={styles.text_center}>Nhân sự</span>
                    <span>Trạng thái</span>
                    <span>Ngày tạo</span>
                    <span className={styles.text_right}>Thao tác</span>
                </div>
                <div className={styles.table_body}>
                    {(areas ?? []).slice(0, 5).map((area) => (
                        <div key={area.id} className={styles.row}>
                            <span className={styles.area_id}>{area.id}</span>
                            <span className={styles.area_name}>{area.name}</span>
                            <span className={styles.text_center}>Chưa cập nhật</span>
                            <div>
                                <span
                                    className={`${styles.status_badge} ${styles[area.isActive ? 'active' : 'inactive']}`}
                                >
                                    <span className={styles.dot}></span>
                                    {area.isActive ? 'Hoạt động' : 'Tạm ngưng'}
                                </span>
                            </div>
                            <span className={styles.date_text}>{formatDate(area.createdAt)}</span>
                            <div className={styles.actions}>
                                <button className="material-symbols-outlined" onClick={() => handleAddAreaDate(area)}>edit</button>
                                <button className="material-symbols-outlined delete">delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Map Hint */}
            <div className={styles.map_preview}>
                <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqNL0utEBr5CBSF6a4uRzXXsdE4gGnpvGzWkzReGj87SOb2LKN2yaNLWoE2DKqDQXGGPI5TSjjuO_23iH5ubdxxIAiUTurshgvayVbIgR3MxfIs0TClJevYaLP5IPGm8MTWO5dyfit1aDOMeyRJpL8WqIrVHEsFHGABt0VYfhSXb6eL7TfmcHGVVlx_LIyf1IZN6f1xNnhlZDlFX6Sb4AFYywLCzwTZQE5uxspMs-BENTsx1fhocqv3w1BapjEghQM7sYbHrH95Bg"
                    alt="Map visualization"
                />
                <div className={styles.map_overlay}>
                    <h4>Bản đồ khu vực dịch vụ</h4>
                    <p>Xem trực quan hóa độ phủ dịch vụ trên bản đồ thành phố.</p>
                </div>
            </div>
        </div>
    );
}
