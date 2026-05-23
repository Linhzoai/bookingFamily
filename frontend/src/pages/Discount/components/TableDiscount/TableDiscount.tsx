import type { Discount } from '@/types/booking';
import styles from './style.module.scss';
import classNames from 'classnames';
import { LuPenLine } from 'react-icons/lu';
import { RiDeleteBinLine } from 'react-icons/ri';
import { useDeleteQuery } from '@/hooks/useQueryCustom';
import { discountService } from '@/services/discountService';
import Loading from '@/components/LoadingCommon/Loading';
interface ITableDiscountProps {
    data: Discount[];
    onEdit: (discount: Discount) => void;
    isLoading: boolean;
}

export default function TableDiscount({ data, onEdit, isLoading }: ITableDiscountProps) {
    const {mutate: deletefn, isPending: isDeleting} = useDeleteQuery('discounts', discountService.deleteDiscount, 'Xóa discount');
    const handleDelete = (id: string)=>{
        deletefn(id);
    }
    return (
        <section className={styles.tableWrapper}>
            {(isDeleting || isLoading) && <Loading/>}
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
                                {discount.discountType === 'percentage' ? 'Phần trăm' : 'Cố định'}
                            </span>
                        </div>
                        <div className={classNames(styles.col, styles.mono)}>
                            {discount.discountType === 'percentage'
                                ? `${discount.discountValue}%`
                                : `${discount.discountValue.toLocaleString('vi-VN')}đ`}
                        </div>
                        <div className={classNames(styles.col, styles.mono)}>
                            {new Date(discount.startDate).toLocaleDateString('vi-VN')} <br />
                            <span className={styles.dimText}>đến</span> {new Date(discount.endDate).toLocaleDateString('vi-VN')}
                        </div>
                        <div className={classNames(styles.col, styles.mono)}>
                            {discount.usedCount} / {discount.usageLimit ? discount.usageLimit : '∞'}
                        </div>
                        <div className={styles.col}>
                            <span className={classNames(styles.statusPill, styles[discount.isActive ? 'active' : 'inactive'])}>
                                {discount.isActive  ? 'Đang hoạt động' : 'Không hoạt động'}
                            </span>
                        </div>
                        <div className={styles.col}>
                            <div className={styles.actionButtons}>
                                <button className={classNames(styles.btn, styles.btnEdit)} onClick={()=>onEdit(discount)}>
                                    <LuPenLine size={18} />
                                </button>
                                <button className={classNames(styles.btn, styles.btnDelete)} onClick={()=> handleDelete(discount.id)}>
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
