import {Info} from "lucide-react";
import cls from "classnames";
import styles from "./style.module.scss";
import { useState } from "react";

interface InputDiscountFormProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export default function InputDiscountForm({ isOpen, setIsOpen, }: InputDiscountFormProps) {
    const [isActive, setIsActive] = useState(true);
    return (
        <aside className={cls(styles.form_section, !isOpen && styles.form_closed)}>
            <div className={styles.form_card}>
                <div className={styles.form_header}>
                    <p className={styles.label_tag}>Biểu mẫu</p>
                    <h3>Thêm Mã Giảm Giá</h3>
                </div>

                <form className={styles.form} onSubmit={(e) => { e.preventDefault(); setIsOpen(false); }} >
                    <div className={styles.form_group}>
                        <label>
                            Mã Code <span className={styles.required}>*</span>
                        </label>
                        <input type="text" placeholder="VD: SUMMER2026..." className={styles.uppercase_input} />
                    </div>

                    <div className={styles.form_group}>
                        <label>
                            Loại giảm giá <span className={styles.required}>*</span>
                        </label>
                        <select className={styles.select_input}>
                            <option value="percentage">Phần trăm (%)</option>
                            <option value="fixed">Số tiền cố định (VNĐ)</option>
                        </select>
                    </div>

                    <div className={styles.form_group}>
                        <label>
                            Giá trị giảm <span className={styles.required}>*</span>
                        </label>
                        <input type="number" placeholder="Nhập giá trị..." />
                    </div>

                    <div className={styles.form_group}>
                        <label>
                            Thời gian bắt đầu <span className={styles.required}>*</span>
                        </label>
                        <input type="date" />
                    </div>

                    <div className={styles.form_group}>
                        <label>Thời gian kết thúc</label>
                        <input type="date" />
                        <span className={styles.help_text}>Để trống nếu không có thời hạn kết thúc.</span>
                    </div>

                    <div className={styles.toggle_group}>
                        <div>
                            <p className={styles.toggle_label}>Trạng thái hoạt động</p>
                            <p className={styles.toggle_desc}>Cho phép sử dụng mã này ngay lập tức</p>
                        </div>
                        <div className={styles.toggle_switch} onClick={() => setIsActive(!isActive)}>
                            <input type="checkbox" checked={isActive} readOnly />
                            <span className={styles.slider}></span>
                        </div>
                    </div>

                    <div className={styles.form_actions}>
                        <button type="submit" className={styles.save_btn}>
                            Tạo mã
                        </button>
                        <button type="button" className={styles.cancel_btn} onClick={() => setIsOpen(false)}>
                            Hủy
                        </button>
                    </div>
                </form>

                <div className={styles.info_footer}>
                    <Info size={20} />
                    <p>
                        Các mã giảm giá đang hoạt động sẽ có thể được áp dụng trực tiếp tại màn hình tạo lịch đặt dịch
                        vụ.
                    </p>
                </div>
            </div>
        </aside>
    );
}
