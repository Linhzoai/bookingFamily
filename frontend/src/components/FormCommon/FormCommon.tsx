import { useSideBarStore } from '@/stores/useSidebarStore';
import AssignmentBooking from './components/AssgnmentBooking/AssignmentBooking';
import styles from './style.module.scss';
import cls from 'clsx';
import FormBooking from './components/FormBooking/FormBooking';
import { BsShop } from 'react-icons/bs';
import FormService from './components/FormService/FormService';
import FormCustomer from './components/FormCustomer/FormCustomer';
const labelData = {
    assignment_booking: 'Phân công nhiệm vụ cho nhân viên',
    update_booking: 'Cập nhật đơn đặt lịch',
    create_booking: 'Tạo đơn đặt lịch',
    create_service: 'Thêm dịch vụ mới',
    update_service: 'Cập nhật dịch vụ',
    create_customer: 'Thêm khách hàng mới',
    update_customer: 'Cập nhật khách hàng'
};
export default function FormCommon() {
    const { container, active, form_header, form_body, form_common } = styles;
    const { type, isOpen, toggleSidebar, booking, service, customer } = useSideBarStore();
    const handleRenderForm = () => {
        switch (type) {
            case 'assignment_booking':
                return <AssignmentBooking />;
            case 'create_booking':
                return <FormBooking />;
            case 'update_booking':
                return <FormBooking booking={booking} />;
            case 'create_service':
                return <FormService />;
            case 'update_service':
                return <FormService service={service} />;
            case 'create_customer':
                return <FormCustomer />;
            case 'update_customer':
                return <FormCustomer customer={customer} />;
            default:
                return null;
        }
    };
    const handleClose = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        if (e.currentTarget === e.target) {
            toggleSidebar();
        }
    };
    return (
        <>
            {isOpen && (
                <div className={cls(container, isOpen && active)} onClick={handleClose}>
                    <div className={form_common}>
                        <div className={form_header}>
                            <span>
                                <BsShop />
                            </span>
                            <h3>{labelData[type]}</h3>
                        </div>
                        <div className={form_body}>{handleRenderForm()}</div>
                    </div>
                </div>
            )}
        </>
    );
}
