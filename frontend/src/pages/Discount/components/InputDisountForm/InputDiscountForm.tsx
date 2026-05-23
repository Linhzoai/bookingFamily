import { Info } from 'lucide-react';
import cls from 'classnames';
import styles from './style.module.scss';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useCreateQuery, useUpdateQuery } from '@/hooks/useQueryCustom';
import { discountService } from '@/services/discountService';
import type { Discount } from '@/types/booking';
import Loading from '@/components/LoadingCommon/Loading';
import { useEffect } from 'react';

interface InputDiscountFormProps {
    isOpen: boolean;
    handleClose: () => void;
    discount?: Discount;
}

const createSchema = () => {
    return z.object({
        code: z.string().min(1, 'Mã code không được để trống'),
        discountType: z.string().min(1, 'Loại giảm giá không được để trống'),
        
        // Trường bắt buộc
        discountValue: z.number({ 
            message: 'Giá trị giảm không được để trống' 
        }).min(1, 'Giá trị giảm phải lớn hơn 0'),

        // Các trường không bắt buộc (optional)
        minBookingAmount: z.union([z.number(), z.nan()])
            .optional()
            .transform(v => Number.isNaN(v) ? undefined : v),
            
        maxDiscountAmount: z.union([z.number(), z.nan()])
            .optional()
            .transform(v => Number.isNaN(v) ? undefined : v),
            
        startDate: z.string().min(1, 'Thời gian bắt đầu không được để trống'),
        
        usageLimit: z.union([z.number(), z.nan()])
            .optional()
            .transform(v => Number.isNaN(v) ? undefined : v),
            
        endDate: z.string().optional(),
        isActive: z.boolean()
    });
};

type FormData = z.infer<ReturnType<typeof createSchema>>;

export default function InputDiscountForm({ isOpen, handleClose, discount }: InputDiscountFormProps) {
    const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm<FormData>({
        resolver: zodResolver(createSchema()),
        defaultValues: {
            code: '',
            discountType: 'percentage',
            discountValue: 1,
            maxDiscountAmount: null,
            usageLimit: 9999999,
            isActive: true
        }
    });
    const { mutate: createDiscounts, isPending: isCreating } = useCreateQuery('discounts', discountService.createDiscount, 'Tạo discount');
    const { mutate: updateDiscounts, isPending: isUpdating } = useUpdateQuery('discounts', discountService.updateDiscount, 'Cập nhật discount');
    const handleCreateDiscount =async (data: FormData) => {
        const payload: Partial<Discount> = {
            ...data,
            discountType: data.discountType as 'percentage' | 'fixed',
            startDate: new Date(data.startDate),
            endDate: data.endDate ? new Date(data.endDate) : undefined
        };
        if (discount) {
            await updateDiscounts({ id: discount.id, data: payload })
        } else {
            await createDiscounts(payload);
        }
        reset();
        handleClose();
    };
    useEffect(() => {
        if(discount){
            reset({
                code: discount.code,
                discountType: discount.discountType,
                discountValue: Number(discount.discountValue),
                minBookingAmount: Number(discount.minBookingAmount),
                maxDiscountAmount: Number(discount.maxDiscountAmount),
                startDate: discount.startDate? new Date(discount.startDate).toISOString().split('T')[0] : '',
                usageLimit: Number(discount.usageLimit),
                endDate: discount.endDate? new Date(discount.endDate).toISOString().split('T')[0] : '',
                isActive: discount.isActive
            })
        }else{
            reset()
        }
    }, [discount,reset])
    return (
        <aside className={cls(styles.form_section, !isOpen && styles.form_closed)}>
            {(isCreating || isUpdating) && <Loading />}
            <div className={styles.form_card}>
                <div className={styles.form_header}>
                    <p className={styles.label_tag}>Biểu mẫu</p>
                    <h3>Thêm Mã Giảm Giá</h3>
                </div>

                <form className={styles.form} onSubmit={handleSubmit(handleCreateDiscount)}>
                    <div className={styles.form_group}>
                        <label>
                            Mã Code <span className={styles.required}>*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="VD: SUMMER2026..."
                            className={styles.uppercase_input}
                            {...register('code')}
                        />
                        {errors.code && <span className={styles.error_text}>{errors.code.message}</span>}
                    </div>

                    <div className={styles.form_group}>
                        <label>
                            Loại giảm giá <span className={styles.required}>*</span>
                        </label>
                        <select className={styles.select_input} {...register('discountType')}>
                            <option value="percentage">Phần trăm (%)</option>
                            <option value="fixed">Số tiền cố định (VNĐ)</option>
                        </select>
                    </div>

                    <div className={styles.form_group}>
                        <label>
                            Giá trị giảm <span className={styles.required}>*</span>
                        </label>
                        <input
                            type="number"
                            placeholder="Nhập giá trị..."
                            {...register('discountValue', { valueAsNumber: true })}
                        />
                        {errors.discountValue && (
                            <span className={styles.error_text}>{errors.discountValue.message}</span>
                        )}
                    </div>
                    <div className={styles.form_group}>
                        <label>
                            Số lượng giới hạn <span className={styles.required}>*</span>
                        </label>
                        <input
                            type="number"
                            placeholder="Nhập giới hạn sử dụng..."
                            {...register('usageLimit', { valueAsNumber: true })}
                        />
                        {errors.usageLimit && <span className={styles.error_text}>{errors.usageLimit.message}</span>}
                    </div>
                    <div className={styles.form_group}>
                        <label>
                            Giá trị tối thiểu được áp dụng mã <span className={styles.required}>*</span>
                        </label>
                        <input
                            type="number"
                            placeholder="Nhập giá trị..."
                            {...register('minBookingAmount', { valueAsNumber: true })}
                        />
                        {errors.minBookingAmount && (
                            <span className={styles.error_text}>{errors.minBookingAmount.message}</span>
                        )}
                    </div>
                    <div className={styles.form_group}>
                        <label>
                            Giá trị tối đa được áp dụng mã <span className={styles.required}>*</span>
                        </label>
                        <input
                            type="number"
                            placeholder="Nhập giá trị..."
                            {...register('maxDiscountAmount', { valueAsNumber: true })}
                        />
                        {errors.maxDiscountAmount && (
                            <span className={styles.error_text}>{errors.maxDiscountAmount.message}</span>
                        )}
                    </div>

                    <div className={styles.form_group}>
                        <label>
                            Thời gian bắt đầu <span className={styles.required}>*</span>
                        </label>
                        <input type="date" {...register('startDate')} />
                        {errors.startDate && <span className={styles.error_text}>{errors.startDate.message}</span>}
                    </div>

                    <div className={styles.form_group}>
                        <label>Thời gian kết thúc</label>
                        <input type="date" {...register('endDate')} />
                        <span className={styles.help_text}>Để trống nếu không có thời hạn kết thúc.</span>
                        {errors.endDate && <span className={styles.error_text}>{errors.endDate.message}</span>}
                    </div>

                    <div className={styles.toggle_group}>
                        <div>
                            <p className={styles.toggle_label}>Trạng thái hoạt động</p>
                            <p className={styles.toggle_desc}>Cho phép sử dụng mã này ngay lập tức</p>
                        </div>
                        <div className={styles.toggle_switch} onClick={() => setValue('isActive', !watch('isActive'))}>
                            <input type="checkbox" checked={watch('isActive')} {...register('isActive')} />
                            <span className={styles.slider}></span>
                            {errors.isActive && <span className={styles.error_text}>{errors.isActive.message}</span>}
                        </div>
                    </div>

                    <div className={styles.form_actions}>
                        <button type="submit" className={styles.save_btn}>
                            {discount ? 'Cập nhật' : 'Tạo mã'}
                        </button>
                        <button type="button" className={styles.cancel_btn} onClick={handleClose}>
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
