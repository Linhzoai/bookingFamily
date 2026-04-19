/* eslint-disable @typescript-eslint/no-unused-vars */
import z from 'zod';
import styles from './style.module.scss';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { staffService } from '@/services/staffService';
import { useCreateQuery, useGetQuery } from '@/hooks/useQueryCustom';
import SelectSearch from '@/components/SelectSearch/SelectSearch';
import Button from '@/components/Button/Button';
import { useSideBarStore } from '@/stores/useSidebarStore';
import { assignBookingService } from '@/services/assignBookingService';
const createSchema = z.object({
    staffId: z.string().min(1, 'Nhân viên không được để trống'),
    bookingId: z.string().min(1, 'Booking không được để trống')
});
type FormData = z.infer<typeof createSchema>;
export default function AssignmentBooking() {
    const { form_body, form_footer } = styles;
    const { data: staffs } = useGetQuery('staff', staffService.getAllStaff);
    const { booking, toggleSidebar } = useSideBarStore();
    const dataStaff = (staffs?.data ?? []).map((item) => ({ label: item.name, value: item.id }));
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ 
        resolver: zodResolver(createSchema), 
        defaultValues: { staffId: '', bookingId: booking.id } 
    });
    const {mutate} = useCreateQuery('bookings', assignBookingService.createAssignBooking, 'Phân công việc')
    const handleAssignmentBooking = (data: FormData) => {
        mutate(data,{onSuccess: () => {toggleSidebar()}});
    };
    return (
            <form action="" onSubmit={handleSubmit(handleAssignmentBooking)}>
                <div className={form_body}>
                    <div className={styles.box_input}>
                        <label htmlFor="staffId">Nhân viên</label>
                        <SelectSearch options={dataStaff} placeholder="Chọn nhân viên" {...register('staffId')} />
                    </div>
                        {errors.staffId && <p className={styles.error}>{errors.staffId.message}</p>}
                </div>
                <div className={form_footer}>
                    <Button title="Phân công" type="submit" />
                </div>
            </form>
    );
}
