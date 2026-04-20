import { useSideBarStore } from '@/stores/useSidebarStore';
import type { Customer } from '@/types/auth';
import styles from './style.module.scss';
import Button from '@/components/Button/Button';
import InputCommon from '@/components/InputCommon/InputCommon';
import SelectSearch from '@/components/SelectSearch/SelectSearch';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { useGetQuery } from '@/hooks/useQueryCustom';
import { AreaService } from '@/services/areaService';
import { formatOption } from '@/utils/formatOption';
interface FormCustomerProps {
    customer?: Customer | null;
}
const createSchema = z.object({     
    name: z.string().min(1, "Tên không được để trống"),
    phone: z.string().min(1, "Số điện thoại không được để trống").regex(/^[0-9]{10}$/, "Số điện thoại không đúng định dạng"),
    email: z.string().min(1, "Email không được để trống").email("Email không đúng định dạng"),
    gender: z.string().min(1, "Giới tính không được để trống").refine((value) => ['male', 'female'].includes(value), "Giới tính không hợp lệ"),
    city: z.string().min(1, "Thành phố không được để trống"),
    district: z.string().optional(),
    ward: z.string().optional(),
    address: z.string().min(1, "Địa chỉ không được để trống"),
})

type FormData = z.infer<typeof createSchema>;
export default function FormCustomer({ customer }: FormCustomerProps) {
    const { toggleSidebar } = useSideBarStore();
    const { container, form_footer, form_body, box_info, box_area, box_input, box_radio, error } = styles;
    const {register, handleSubmit, formState: {errors}, watch}  = useForm<FormData>({
        resolver: zodResolver(createSchema),
        defaultValues: {
            name: '',
            phone: '',
            email: '',
            gender: '',
            city: '',
            address: '',
        }
    })
    const {data: cities} = useGetQuery('areas', AreaService.getAllAreas);
    const {data: districts} = useGetQuery('areas', AreaService.getAllAreas, `parentId=${watch('city')}&limit=999`, {enabled: !!watch('city')});
    const {data: wards} = useGetQuery('areas', AreaService.getAllAreas, `parentId=${watch('district')}&limit=999`, {enabled: !!watch('district')});
    
    const onSubmit = (data: FormData) => {
        console.log(data);
    }
    return (
        <div className={container}>
            <form action="" onSubmit={handleSubmit(onSubmit)}>
                <div className={form_body}>
                    <div className={box_info}>
                        <div className={box_input}>
                            <label htmlFor="name">Họ tên</label>
                            <InputCommon placeholder='Nhập họ tên' {...register('name')}/>
                            {errors.name && <p className={error}>{errors.name.message}</p>}
                        </div>
                        <div className={box_input}>
                            <label htmlFor="phone">Số điện thoại</label>
                            <InputCommon placeholder='Nhập số điện thoại' {...register('phone')}/>
                            {errors.phone && <p className={error}>{errors.phone.message}</p>}
                        </div>
                        <div className={box_input}>
                            <label htmlFor="email">Email</label>
                            <InputCommon placeholder='Nhập email' {...register('email')}/>
                            {errors.email && <p className={error}>{errors.email.message}</p>}
                        </div>
                        <div className={box_input}>
                            <label htmlFor="gender">Giới tính</label>
                            <div className={box_radio}>
                                <input type="radio" name="gender" id="male" value="male" {...register('gender')}/>
                                <label htmlFor="male">Nam</label>
                                <input type="radio" name="gender" id="female" value="female" {...register('gender')}/>
                                <label htmlFor="female">Nữ</label>
                            </div>
                        </div>
                    </div>
                    <div className={box_area}>
                        <div className={box_input}>
                            <label htmlFor="city">Thành Phố</label>
                            <SelectSearch options={formatOption(cities?.data)} placeholder='Thành Phố' {...register('city')}/>
                            {errors.city && <p className={error}>{errors.city.message}</p>}
                        </div>
                        <div className={box_input}>
                            <label htmlFor="district">Quận</label>
                            <SelectSearch options={formatOption(districts?.data)} placeholder='Quận' {...register('district')} enabled={!watch('city')}/>
                            {errors.district && <p className={error}>{errors.district.message}</p>}
                        </div>
                        <div className={box_input}>
                            <label htmlFor="ward">Phường</label>
                            <SelectSearch options={formatOption(wards?.data)} placeholder='Phường' {...register('ward')} enabled={!watch('district')}/>
                            {errors.ward && <p className={error}>{errors.ward.message}</p>}
                        </div>
                        <div className={box_input}>
                            <label htmlFor="address">Địa chỉ</label>
                            <InputCommon placeholder='Nhập địa chỉ cụ thể (Số nhà + tên đường)' {...register('address')}/>
                            {errors.address && <p className={error}>{errors.address.message}</p>}
                        </div>
                    </div>
                    <div className={box_input}>
                        <label htmlFor="file">Ảnh đại diện</label>
                        <input type="file" name="file" id="file" />
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
