/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import Button from "@/components/Button/Button";
import style from "./style.module.scss"
import InputCommon from "@/components/InputCommon/InputCommon";
import SelectSearch from "@/components/SelectSearch/SelectSearch";
import SelectSearchMulti from "@/components/SelectSearchMulti/SelectSearchMulti";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useCreateQuery, useGetQuery, useUpdateQuery } from "@/hooks/useQueryCustom";
import { customerService } from "@/services/customerService";
import type { Customer } from "@/types/auth";
import type { Area, Booking, Service } from "@/types/booking";
import { AreaService } from "@/services/areaService";
import { serviceService } from "@/services/serviceService";
import { useEffect } from "react";
import { bookingService } from "@/services/bookingService";
import { useSideBarStore } from "@/stores/useSidebarStore";
import Loading from "@/components/LoadingCommon/Loading";
const createSchema = z.object({
    customerId: z.string().min(1, 'Vui lòng chọn khách hàng'),
    cityId: z.number().min(1, 'Vui lòng chọn thành phố'),
    districtId: z.number(),
    wardId: z.number(),
    address: z.string().min(1, 'Vui lòng nhập địa chỉ cụ thể'),
    scheduledTime: z.string().refine(value =>{
        const selectedTime = new Date(value).getTime();
        const now = new Date().getTime();
        return selectedTime > now;
    }, 'Thời gian làm việc phải lớn hơn thời gian hiện tại'),
    discountCodeId: z.string().optional(),
    note: z.string().optional(),
    serviceIds: z.array(z.number()).min(1, 'Vui lòng chọn ít nhất 1 dịch vụ'),
    
})

type FormData = z.infer<typeof createSchema>
interface FormBookingProps {
    booking?: Booking;
}
export default function FormBooking({booking}: FormBookingProps){
    const {container, box_area, box_input, box_customer, box_extend,list_service,service_item, error} = style;
    const {toggleSidebar} = useSideBarStore();
    const {register, handleSubmit, formState: {errors}, watch, setValue} = useForm<FormData>({
        resolver: zodResolver(createSchema),
        defaultValues: {
            customerId: '',
            address: '',
            scheduledTime: '',
            discountCodeId: '',
            note: '',
            serviceIds: [],
        }
    })
    //Láy danh sách khách hàng
    const {data: customerData} = useGetQuery('Customer', customerService.getAllCustomers);
    const optionsCustomer = customerData?.data?.map((item: Customer) => ({
        value: item.id,
        label: item.name,
    })) || []

    //Lấy danh sách tỉnh thành phố
    const cityId = watch('cityId');
    const districtId = watch('districtId');
    const wardId = watch('wardId');
    const {data: cities} = useGetQuery('area', AreaService.getAllAreas, 'limit=999', {staleTime: Infinity} )
    const {data: districts} = useGetQuery('area', AreaService.getAllAreas,`parentId=${cityId}&limit=999` , {enabled: !!cityId} );
    const {data: wards} = useGetQuery('area', AreaService.getAllAreas, `parentId=${districtId}&limit=999`, {enabled: !!districtId} );
    const {mutate, isPending} = useCreateQuery('bookings', bookingService.createBooking);
    const {mutate: updateMutate, isPending: updatePending} = useUpdateQuery('bookings', bookingService.updateBooking);
    useEffect(() => {
        setValue('districtId', 0)
        setValue('wardId',0)
    }, [cities]);
    useEffect(() => {
        setValue('wardId', 0)
    }, [districts]);
    useEffect(() => {
        if(booking){
            setValue('customerId', booking.customer.id)
            setValue('address', booking.address)
            setValue('scheduledTime', new Date(booking.scheduledTime).toISOString().slice(0, 16))
            setValue('discountCodeId', booking?.discountId || '')
            setValue('note', booking.note)
            setValue('serviceIds', booking.bookingDetails.map((item) => Number(item.service.id)))
            const areas = booking.area.path.split('/').filter((item) => item !== '');
            setValue('cityId', Number(areas[0]) || 0);
            setValue('districtId', Number(areas[1]) || 0);
            setValue('wardId', Number(areas[2]) || 0);
        }
    }, [booking]);
    //Lấy danh sách dịch vụ
    const {data: serviceData} = useGetQuery('Service', serviceService.getAllServices, 'limit=999');
    const formatOptionArea = (data: Area[] | Service[]) =>{
        return data?.map((item) => ({
            value: Number(item.id),
            label: item.name,
        })) || []
    }
    
    const onSubmit = (data: FormData) => {
        const payload = {
            customerId: data.customerId,
            areaId: wardId ? Number(wardId) : districtId ? Number(districtId) : Number(cityId),
            address: data.address,
            scheduledTime: data.scheduledTime,
            discountCodeId: data.discountCodeId,
            note: data.note,
            serviceId: data.serviceIds.map((item) => Number(item)),
        }
        if(booking){
            updateMutate({
                id: booking.id,
                data: payload as any,
            }, {
                onSuccess: () => {
                    toggleSidebar();
                }
            });
        }
        else{
            mutate(payload as any, {
            onSuccess: () => {
                toggleSidebar();
            }
        });
        }
        
    }
    
    return (
        <div className={container}>
            {(isPending || updatePending) && <Loading/>}
            <form action="" onSubmit={handleSubmit(onSubmit)}>
                <div className={style.form_body}>
                    <div className={box_area}>
                        <div className={box_input}>
                            <label htmlFor="">Tính/Thành Phố</label>
                            <SelectSearch options ={formatOptionArea(cities?.data || [])} placeholder="Chọn thành phố" {...register('cityId')} value={cityId}/>
                            {errors.cityId && <p className={error}>{errors.cityId.message}</p>}
                        </div>
                        <div className={box_input}>
                            <label htmlFor="">Quận/Huyện</label>
                            <SelectSearch options ={formatOptionArea(districts?.data || [])} placeholder="Chọn quận/huyện" {...register('districtId')} value={districtId}/>
                            {errors.districtId && <p className={error}>{errors.districtId.message}</p>}
                        </div>
                        <div className={box_input}>
                            <label htmlFor="">Phường/Xã</label>
                            <SelectSearch options ={formatOptionArea(wards?.data || [])} placeholder="Chọn phường/xã" {...register('wardId')} value={wardId}/>
                            {errors.wardId && <p className={error}>{errors.wardId.message}</p>}
                        </div>
                        <div className={box_input}>
                            <label htmlFor="">Địa chỉ</label>
                            <InputCommon placeholder="Địa chỉ chi tiết (Số nhà, tên đường, ...)" {...register('address')}/>
                            {errors.address && <p className={error}>{errors.address.message}</p>}
                        </div>
                    </div>
                    <div className={box_customer}>
                        <div className={box_input}>
                            <label htmlFor="">Khách hàng</label>
                            <SelectSearch options={optionsCustomer} placeholder="Chọn khách hàng" {...register('customerId')} value={watch('customerId')}/>
                            {errors.customerId && <p className={error}>{errors.customerId.message}</p>}
                        </div>
                        <div className={box_input}>
                            <label htmlFor="">Thời gian làm việc</label>
                            <input type="datetime-local" {...register('scheduledTime')} />
                            {errors.scheduledTime && <p className={error}>{errors.scheduledTime.message}</p>}
                        </div>
                    </div>
                    <div className={list_service}>
                        <div className={service_item}>
                            
                        </div>
                        <div className={box_input}>
                            <label htmlFor="">Dịch vụ</label>
                            <SelectSearchMulti options={formatOptionArea(serviceData?.data)} placeholder="Chọn dịch vụ" {...register('serviceIds')} value={watch('serviceIds')}/>
                            {errors.serviceIds && <p className={error}>{errors.serviceIds.message}</p>}
                        </div>
                    </div>
                    <div className={box_extend}>
                        <div className={box_input}>
                            <label htmlFor="">Mã giảm giá</label>
                            <InputCommon placeholder="Nhập mã giảm giá"/>
                        </div>
                        <div className={box_input}>
                            <label htmlFor="">Ghi chú</label>
                            <textarea {...register('note')}  cols={30} rows={10}></textarea>
                        </div>
                        
                    </div>
                </div>
                <div className={style.form_footer}>
                    <Button title={booking ? 'Cập nhật' : 'Tạo đơn đặt lịch'} type="submit" />
                    <Button title="Hủy" type="button" onClick={() => toggleSidebar()}/>
                </div>
            </form>
        </div>
    )
}