/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/incompatible-library */

import { useSideBarStore } from '@/stores/useSidebarStore';
import type { Customer } from '@/types/auth';
import styles from './style.module.scss';
import Button from '@/components/Button/Button';
import InputCommon from '@/components/InputCommon/InputCommon';
import SelectSearch from '@/components/SelectSearch/SelectSearch';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { useCreateQuery, useGetQuery, useUpdateQuery } from '@/hooks/useQueryCustom';
import { AreaService } from '@/services/areaService';
import { formatOption } from '@/utils/formatOption';
import { authService } from '@/services/authService';
interface FormCustomerProps {
    customer?: Customer | null;
}
const schema = z.object({
    name: z.string().min(1, 'Tên không được để trống'),
    phone: z
        .string()
        .min(1, 'Số điện thoại không được để trống')
        .regex(/^[0-9]{10}$/, 'Số điện thoại không đúng định dạng'),
    email: z.string().min(1, 'Email không được để trống').email('Email không đúng định dạng'),
    gender: z
        .string()
        .min(1, 'Giới tính không được để trống')
        .refine((value) => ['male', 'female'].includes(value), 'Giới tính không hợp lệ'),
    city: z.number().min(1, 'Thành phố không được để trống').optional(),
    district: z.number().optional().nullable(),
    ward: z.number().optional().nullable(),
    address: z.string().min(1, 'Địa chỉ không được để trống'),
    avatar: z.any().optional(),
    password: z
        .string()
        .min(1, 'Password không được để trống')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            'Password phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt'
        )
        .optional()
});
type FormData = z.infer<typeof schema>;

export default function FormCustomer({ customer }: FormCustomerProps) {
    const { toggleSidebar } = useSideBarStore();
    const defauleArea = customer?.area?.path.split('/').filter((item) => item !== '');
    const { container, form_footer, form_body, box_info, box_area, box_input, box_radio, error } = styles;
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: customer?.name || '',
            phone: customer?.phone || '',
            email: customer?.email || '',
            gender: customer?.gender || 'male',
            address: customer?.address.split(',')[0] || '',
            city: Number(defauleArea?.[0]) || null,
            district: Number(defauleArea?.[1]) || null,
            ward: Number(defauleArea?.[2]) || null
        }
    });
    const { data: cities } = useGetQuery('areas', AreaService.getAllAreas);
    const { data: districts } = useGetQuery('areas', AreaService.getAllAreas, `parentId=${watch('city')}&limit=999`, {
        enabled: !!watch('city')
    });
    const { data: wards } = useGetQuery('areas', AreaService.getAllAreas, `parentId=${watch('district')}&limit=999`, {
        enabled: !!watch('district')
    });
    const { mutate: createCustomer } = useCreateQuery('customers', authService.signUp);
    const { mutate: updateCustomer } = useUpdateQuery('customers', authService.updateCustomer);
    const onSubmit = (_data: FormData) => {
        const formData = new FormData();
        formData.append('name', _data.name);
        formData.append('phone', _data.phone);
        formData.append('email', _data.email);
        formData.append('gender', _data.gender);
        formData.append('areaId', _data.ward?.toString() || _data.district?.toString() || _data.city.toString());
        formData.append('address', _data.address);
        if (!customer && !_data.password) {
            return;
        }
        if (!customer && _data.password) {
            formData.append('password', _data.password);
        }
        formData.append('role', 'customer');
        if (_data.avatar && _data.avatar.length > 0) {
            formData.append('avatar', _data.avatar[0]);
        }
        console.log(formData);
        if (customer) {
            updateCustomer(
                { id: customer.id, data: formData },
                {
                    onSuccess: () => {
                        toggleSidebar();
                    }
                }
            );
        } else {
            createCustomer(formData, {
                onSuccess: () => {
                    toggleSidebar();
                }
            });
        }
    };
    return (
        <div className={container}>
            <form action="" encType="multipart/form-data" onSubmit={handleSubmit(onSubmit)}>
                <div className={form_body}>
                    <div className={box_info}>
                        <div className={box_input}>
                            <label htmlFor="name">Họ và tên</label>
                            <InputCommon placeholder="Nhập họ và tên" {...register('name')} />
                            {errors.name && <p className={error}>{errors.name.message}</p>}
                        </div>
                        <div className={box_input}>
                            <label htmlFor="phone">Số điện thoại</label>
                            <InputCommon placeholder="Nhập số điện thoại" {...register('phone')} />
                            {errors.phone && <p className={error}>{errors.phone.message}</p>}
                        </div>
                        <div className={box_input}>
                            <label htmlFor="email">Email</label>
                            <InputCommon placeholder="Nhập email" {...register('email')} />
                            {errors.email && <p className={error}>{errors.email.message}</p>}
                        </div>
                        {!customer && (
                            <div className={box_input}>
                                <label htmlFor="password">Password</label>
                                <InputCommon placeholder="Nhập password" {...register('password')} />
                                {errors.password && <p className={error}>{errors.password.message}</p>}
                            </div>
                        )}
                        <div className={box_input}>
                            <label htmlFor="gender">Giới tính</label>
                            <div className={box_radio}>
                                <input type="radio" name="gender" id="male" value="male" {...register('gender')} />
                                <label htmlFor="male">Nam</label>
                                <input type="radio" name="gender" id="female" value="female" {...register('gender')} />
                                <label htmlFor="female">Nữ</label>
                            </div>
                        </div>
                    </div>
                    <div className={box_area}>
                        <div className={box_input}>
                            <label htmlFor="city">Thành Phố</label>
                            <SelectSearch
                                value={watch('city')}
                                options={formatOption(cities?.data)}
                                placeholder="Thành Phố"
                                {...register('city')}
                            />
                            {errors.city && <p className={error}>{errors.city.message}</p>}
                        </div>
                        <div className={box_input}>
                            <label htmlFor="district">Quận</label>
                            <SelectSearch
                                value={watch('district')}
                                options={formatOption(districts?.data)}
                                placeholder="Quận"
                                {...register('district')}
                                enabled={!watch('city')}
                            />
                            {errors.district && <p className={error}>{errors.district.message}</p>}
                        </div>
                        <div className={box_input}>
                            <label htmlFor="ward">Phường</label>
                            <SelectSearch
                                value={watch('ward')}
                                options={formatOption(wards?.data)}
                                placeholder="Phường"
                                {...register('ward')}
                                enabled={!watch('district')}
                            />
                            {errors.ward && <p className={error}>{errors.ward.message}</p>}
                        </div>
                        <div className={box_input}>
                            <label htmlFor="address">Địa chỉ</label>
                            <InputCommon
                                placeholder="Nhập địa chỉ cụ thể (Số nhà + tên đường)"
                                {...register('address')}
                            />
                            {errors.address && <p className={error}>{errors.address.message}</p>}
                        </div>
                    </div>
                    <div className={box_input}>
                        <label htmlFor="file">Ảnh đại diện</label>
                        <input type="file" name="avatar" id="avatar" {...register('avatar')} />
                    </div>
                </div>
                <div className={form_footer}>
                    <Button title={customer ? 'Cập nhật' : 'Thêm mới'} type="submit" />
                    <Button title="Hủy" type="button" onClick={() => toggleSidebar()} />
                </div>
            </form>
        </div>
    );
}
