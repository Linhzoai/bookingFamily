/* eslint-disable @typescript-eslint/no-unused-vars */

import styles from './style.module.scss';
import { useCreateQuery, useDeleteQuery, useGetQuery, useUpdateQuery } from '@/hooks/useQueryCustom';
import cls from 'classnames';
import { useState } from 'react';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import SelectSearch from '@/components/SelectSearch/SelectSearch';
import AreaSystem from './components/AreaService/AreaSystem';
import {AreaService} from '@/services/areaService';
import AreaManager from './components/AreaManeger/AreaManeger';
import type { Area } from '@/types/booking';
import Loading from '@/components/LoadingCommon/Loading';
const createSchema = () =>{
    return z.object({
        id: z.number().optional(),
        name: z.string().min(1, 'Tên khu vực không được để trống'),
        cityId: z.string().optional(),
        districtId: z.string().optional(),
    })
}
type FormData = z.infer<ReturnType<typeof createSchema>>;
export default function AreaManagement() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isActicve, setIsActive] = useState<boolean>(true);
    const [page,setPage] = useState<'maneger'|'system'>('maneger');
    const [isEdit, setIsEdit] = useState<'update'|'create'>('create');
    const {register, handleSubmit, formState: {errors}, reset, watch, setValue} = useForm<FormData>({
        resolver: zodResolver(createSchema()),
        defaultValues: {
            id: 0,
            name: '',
            cityId: '',
            districtId: ''
        }
    });
    const { data} = useGetQuery('areas', AreaService.getAllAreas);
    const cityId = watch('cityId');
    const districtId= watch('districtId');
    const {data: areaDistricts} = useGetQuery('areas', AreaService.getAllAreas, cityId ? `parentId=${cityId}` : undefined);
    const areas = data?.data;
    const formatAreas = (areas ?? []).map((area) => ({
        label: area.name,
        value: area.id
    }));
    const formatAreaDistricts = (areaDistricts?.data ?? []).map((areaDistrict) => ({
        label: areaDistrict.name,
        value: areaDistrict.id
    }));
    const {mutate: createArea, isPending} = useCreateQuery('areas',AreaService.createArea, 'Khu vực');
    const {mutate: updateArea} = useUpdateQuery('areas',AreaService.updateArea, 'Khu vực');

    const handleCreateArea = (data: FormData) => {
        
        const newData = {
            name: data.name,
            isActive: isActicve,
            parentId: null
        }
        if(isEdit === 'update'){
            const id = watch('id');
            if(data.districtId){
                newData.parentId = Number(data.districtId);
            }
            if(data.cityId && !data.districtId){
                newData.parentId = Number(data.cityId);
            }
            updateArea({id: Number(id),data:newData},{ onSuccess: () => { reset(); setIsOpen(false); } } );
        }
        else if(isEdit === 'create'){
            if(data.districtId && data.cityId){
                newData.parentId = Number(data.districtId);
            }
            if(data.cityId && !data.districtId){
                newData.parentId = Number(data.cityId);
            }
            createArea(newData,{ onSuccess: () => { reset(); setIsOpen(false); } } );
        }
    };
    const handleAddAreaDate = (data: Area) =>{
        setIsOpen(true);
        setValue('name', data.name);
        setIsEdit('update');
        setValue('id', data.id);
        setIsActive(data.isActive);
        const listParent = data.path.split('/').filter((item) => item !== '');
        if(listParent.length === 1){
            setValue('cityId', listParent[0]);
        }
        if(listParent.length > 1){
            setValue('cityId', listParent[0]);
            setValue('districtId', listParent[1]);
        }
    }
    const handleRenderPage = (type: string) =>{
        if(type === 'system'){
            return <AreaSystem areas={areas} handleOpenForm={handleOpenForm} handleAddAreaDate={handleAddAreaDate} />
        }
        if(type === 'maneger'){
            return <AreaManager handleOpenForm={handleOpenForm} handleAddAreaDate={handleAddAreaDate} />
        }
    }
    const handleOpenForm = (type: string)=>{
        if(type === 'create'){
            reset();
            setIsOpen(prev =>!prev);
            setIsEdit('create');
        }
        if(type === 'update'){
            setIsOpen(true);
            setIsEdit('update');
        }
    }

     return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>Cài đặt hệ thống</h2>
                <div className={styles.tabs}>
                    <button onClick={()=>setPage('maneger')} className={cls(page==='maneger' && styles.active)}>Chung</button>
                    <button onClick={()=>setPage('system')} className={cls(page==='system' && styles.active)}>Khu vực dịch vụ</button>
                    <button>Thông báo</button>
                </div>
            </div>
    
            <div className={styles.content_grid}>
                {/* Left Side: Areas Table */}
                {handleRenderPage(page)}
                {/* Right Side: Form */}
                <aside className={cls(styles.form_section, !isOpen && styles.form_closed)}>
                        {isPending && <Loading/>}
                    <div className={styles.form_card}>
                        <div className={styles.form_header}>
                            <p className={styles.label_tag}>Biểu mẫu</p>
                            <h3>Thêm/Chỉnh sửa Khu vực</h3>
                        </div>
                        <form className={styles.form} onSubmit={handleSubmit(handleCreateArea)}>
                            {/* 1. Tên khu vực */}
                            <div className={styles.form_group}>
                                <label>
                                    Tên khu vực <span className={styles.required}>*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="VD: Quận 1, Phường Bến Nghé..."
                                    {...register('name')}
                                />
                            </div>

                            {/* 2. Khu vực trực thuộc (Xác định cấp bậc) */}
                            <div className={styles.form_group}>
                                <label>Khu vực trực thuộc (Cấp Thành phố)</label>
                                    <SelectSearch placeholder='Khu vực trực thuộc' options={formatAreas} value={cityId} {...register('cityId')}/>
                                <span className={styles.help_text}>
                                    Để trống nếu đây là Tỉnh/Thành phố. Chọn Tỉnh/Thành phố nếu đây là Quận/Huyện.
                                </span>
                            </div>

                            <div className={styles.form_group}>
                                <label>Khu vực trực thuộc (Cấp Quận)</label>
                                    <SelectSearch placeholder='Khu vực trực thuộc' options={formatAreaDistricts} value={districtId} disabled={!cityId} {...register('districtId')}/>
                                <span className={styles.help_text}>
                                    Để trống nếu đây là Quận/Huyện. Chọn Quận/Huyện nếu đây là Phường/Xã.
                                </span>
                            </div>

                            {/* 3. Trạng thái hoạt động */}
                            <div className={styles.toggle_group}>
                                <div>
                                    <p className={styles.toggle_label}>Trạng thái hoạt động</p>
                                    <p className={styles.toggle_desc}>Cho phép diễn ra dịch vụ tại đây</p>
                                </div>
                                <div className={styles.toggle_switch} onClick={()=>setIsActive(prev=> !prev)}>
                                    <input type="checkbox"  checked={isActicve} />
                                    <span className={styles.slider} ></span>
                                </div>
                            </div>

                            <div className={styles.form_actions}>
                                <button type="submit" className={styles.save_btn} disabled={isPending}>
                                    {isEdit === 'update' ? 'Cập nhật' : 'Lưu'}
                                </button>
                                <button type="button" className={styles.cancel_btn} onClick={()=>{
                                    reset();
                                }}>
                                    Hủy
                                </button>
                            </div>
                        </form>

                        <div className={styles.info_footer}>
                            <span className="material-symbols-outlined">info</span>
                            <p>Thay đổi trạng thái khu vực sẽ ảnh hưởng đến khả năng tìm kiếm của khách hàng.</p>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
