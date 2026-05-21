import styles from './style.module.scss';
import classNames from 'classnames';
import { LuPenLine } from 'react-icons/lu';
import { RiDeleteBinLine } from 'react-icons/ri';
interface IDiscount {
    id: number;
    code: string;
    type: string;
    value: number;
    startDate: string;
    endDate: string;
    usedCount: number;
    usageLimit: number;
    status: string;
}

interface ITableDiscountProps {
    data: IDiscount[];
}

export default function TableDiscount({ data }: ITableDiscountProps) {
    return (
        <section className={styles.tableWrapper}>
            <div className={styles.tableHeader}>
                <div className={styles.col}>Mã Code</div>
                <div className={styles.col}>Loại</div>
                <div className={styles.col}>Giá trị</div>
                <div className={styles.col}>Hiệu lực</div>
                <div className={styles.col}>Sử dụng</div>
                <div className={styles.col}>Trạng thái</div>
                <div className={styles.col}>Hành động</div>
            </div>

            <div className={styles.tableBody}>
                {data.map((discount) => (
                    <div key={discount.id} className={styles.tableRow}>
                        <div className={classNames(styles.col, styles.mono)}>{discount.code}</div>
                        <div className={styles.col}>
                            <span className={styles.typeBadge}>
                                {discount.type === 'percentage' ? 'Phần trăm' : 'Cố định'}
                            </span>
                        </div>
                        <div className={classNames(styles.col, styles.mono)}>
                            {discount.type === 'percentage'
                                ? `${discount.value}%`
                                : `${discount.value.toLocaleString('vi-VN')}đ`}
                        </div>
                        <div className={classNames(styles.col, styles.mono)}>
                            {discount.startDate} <br />
                            <span className={styles.dimText}>đến</span> {discount.endDate}
                        </div>
                        <div className={classNames(styles.col, styles.mono)}>
                            {discount.usedCount} / {discount.usageLimit ? discount.usageLimit : '∞'}
                        </div>
                        <div className={styles.col}>
                            <span className={classNames(styles.statusPill, styles[discount.status])}>
                                {discount.status === 'active' ? 'Đang chạy' : 'Đã dừng'}
                            </span>
                        </div>
                        <div className={styles.col}>
                            <div className={styles.actionButtons}>
                                <button className={classNames(styles.btn, styles.btnEdit)}>
                                    <LuPenLine size={18} />
                                </button>
                                <button className={classNames(styles.btn, styles.btnDelete)}>
                                    <RiDeleteBinLine size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
