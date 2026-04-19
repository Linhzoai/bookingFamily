/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Service } from '@/types/booking';
import styles from './style.module.scss';
import Button from '@/components/Button/Button';
import { useSideBarStore } from '@/stores/useSidebarStore';
import InputCommon from '@/components/InputCommon/InputCommon';
import SelectSearch from '@/components/SelectSearch/SelectSearch';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import cls from 'clsx';
import z from 'zod';
import { formatOption } from '@/utils/formatOption';
import { categoriesService } from '@/services/categoriesService';
import { useCreateQuery, useGetQuery, useUpdateQuery } from '@/hooks/useQueryCustom';
import { serviceService } from '@/services/serviceService';
interface FormServiceProps {
    service?: Service | null;
}
const createSchema = z.object({
    name: z.string().min(1, 'Vui lòng nhập tên dịch vụ'),
    description: z.string().min(1, 'Vui lòng nhập mô tả dịch vụ'),
    price: z.number().min(1, 'Vui lòng nhập giá dịch vụ'),
    duration: z.number().min(1, 'Vui lòng nhập thời gian thực hiện'),
    categoryId: z.number().min(1, 'Vui lòng chọn danh mục dịch vụ'),
    image: z.any().optional(),
    status: z.boolean(),
})
type FormValues = z.infer<typeof createSchema>
export default function FormService({ service }: FormServiceProps) {
    const { container, form_body, form_footer, box_name, box_description, box_price_time, box_category, box_image, box_status, box_status_title, box_status_content ,box_input,active,box_price,box_duration, error} = styles;
    const { toggleSidebar } = useSideBarStore();
    const {register, handleSubmit, formState: {errors}, watch, setValue} = useForm<FormValues>({
        resolver: zodResolver(createSchema),
        defaultValues: {
            name: service?.name || '',
            description: service?.description || '',
            price: service?.price || 0,
            duration: service?.duration || 0,
            categoryId: service?.category.id || 0,
            status: service?.active || true,
        }
    })
    const {data: categories} = useGetQuery('categories', categoriesService.getAllCategories);
    const {mutate: createService} = useCreateQuery('services', serviceService.createService);
    const {mutate: updateService} = useUpdateQuery('services', serviceService.updateService);
    const onSubmit = (data: FormValues) => {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('price', String(data.price));
        formData.append('duration', String(data.duration));
        formData.append('categoryId', String(data.categoryId));
        formData.append('active', String(data.status));
        
        if (data.image && data.image.length > 0) {
            formData.append('image', data.image[0]);
        }
        if(service){
            updateService({id: service.id, data: formData as any}, {
                onSuccess: () => {
                    toggleSidebar();
                }
            });
        }
        else{
            createService(formData as any, {
                onSuccess: () => {
                    toggleSidebar();
                }
            });
        }
    }
    return (
        <div className={container}>
            <form action="" encType="multipart/form-data" onSubmit={handleSubmit(onSubmit)}>
                <div className={form_body}>
                    <div className={box_name}>
                        <label htmlFor="name">Tên dịch vụ</label>
                        <InputCommon placeholder="Nhập tên dịch vụ" {...register('name')} />
                        {errors.name && <span className={error}>{errors.name.message}</span>}
                    </div>
                    <div className={box_description}>
                        <label htmlFor="price">Mô tả dịch vụ</label>
                        <textarea className={box_input} placeholder="Nhập mô tả dịch vụ" {...register('description')}></textarea>
                        {errors.description && <span className={error}>{errors.description.message}</span>}
                    </div>
                    <div className={box_price_time}>
                        <div className={box_price}>
                            <label htmlFor="price">Giá dịch vụ</label>
                            <InputCommon type="number" placeholder="Nhập giá dịch vụ" {...register('price', { valueAsNumber: true })} />
                            {errors.price && <span className={error}>{errors.price.message}</span>}
                        </div>
                        <div className={box_duration}>
                            <label htmlFor="price">Thời gian thực hiện</label>
                            <InputCommon type="number" placeholder="Nhập thời gian thực hiện" {...register('duration', { valueAsNumber: true })} />
                            {errors.duration && <span className={error}>{errors.duration.message}</span>}
                        </div>
                    </div>
                    <div className={box_category}>
                        <label htmlFor="categoryId">Danh mục dịch vụ</label>
                        <SelectSearch placeholder="Chọn danh mục" options={formatOption(categories?.data)} {...register('categoryId', { valueAsNumber: true })}/>
                        {errors.categoryId && <span className={error}>{errors.categoryId.message}</span>}
                    </div>
                    <div className={box_image}>
                        <label htmlFor="image">Hình ảnh</label>
                        <input type="file" placeholder="Chọn hình ảnh dịch vụ"  {...register('image')}/>
                    </div>
                    <div className={box_status}>
                        <span className={box_status_title}>Trạng thái dịch vụ còn hoạt động/ngừng hoạt động</span>
                        <span className={cls(box_status_content, watch('status') && active)} onClick={()=>setValue('status', !watch('status'))}></span>
                        {errors.status && <span className={error}>{errors.status.message}</span>}
                    </div>
                </div>
                <div className={form_footer}>
                    <Button title={service ? 'Cập nhật' : 'Thêm dịch vụ mới'} type="submit" />
                    <Button title="Hủy" type="button" onClick={() => toggleSidebar()} />
                </div>
            </form>
        </div>
    );
}
