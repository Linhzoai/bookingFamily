import { useSideBarStore } from '@/stores/useSidebarStore';
import AssignmentBooking from './components/AssgnmentBooking/AssignmentBooking';
import styles from './style.module.scss';
import cls from 'clsx';
import FormBooking from './components/FormBooking/FormBooking';
import { BsShop } from 'react-icons/bs';
import FormService from './components/FormService/FormService';
const labelData = {
    assignment_booking: 'Phân công nhiệm vụ cho nhân viên',
    update_booking: 'Cập nhật đơn đặt lịch',
    create_booking: 'Tạo đơn đặt lịch',
    create_service: 'Thêm dịch vụ mới',
    update_service: 'Cập nhật dịch vụ'
};
export default function FormCommon() {
    const { container, active, form_header, form_body, form_common } = styles;
    const { type, isOpen, toggleSidebar, booking, service } = useSideBarStore();
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
            default:
                return null;
        }
    };
    const handleRender = () => {
        switch (type) {
            case 'aSSIGNT':
                return (
                    <>
                        <button>
                            Chấp nhận<nav></nav>
                            {/* Api staff/id/update-job --body: {status=='accepted'} */}
                        </button>
                        <button>
                            Từ chối<nav></nav>
                            {/* Api staff/id/update-job --body: {status=='rejected'} */}
                        </button>
                    </>
                );
            case 'accept':
                return <button>Di chuyển đến nhà khách hàng</button>;
                // Gửi api /progerss --status is_comming
            case 'is_cooming':
                return <button>Đã đén</button>;
                // Gửi api /progerss --status  arrived;
            case 'arrived':
                return <button>Bắt đầu công việc</button>;
                // Gửi api /progerss --status  is_working;
            case 'is_working':
                return <button>Hoàn thành công việc</button>;
                // Gửi api /progerss --status  completed;
            case 'completed':
                return <div>Đã hoàn thành</div>;
                // Gửi api /progerss --status  completed;
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
