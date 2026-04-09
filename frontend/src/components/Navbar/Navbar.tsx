import styles from './style.module.scss';
import { NavItems } from './contains.tsx';
import Button from '../Button/Button.tsx';
import { IoHelpCircleOutline } from 'react-icons/io5';
import { IoIosLogOut } from 'react-icons/io';
import { authStore } from '../../stores/useAuthStore.ts';
export default function Navbar() {
    const {
        container,
        title,
        nav_menu,
        nav_item,
        nav_icon,
        nav_label,
        nav_footer,
        footer_info,
        footer_info_item,
        nav_menu_container
    } = styles;
    const {logout} = authStore();

    const handleLogout = () => {
        logout();
    }
    return (
        <div className={container}>
            <div className={nav_menu_container}>
                <h1 className={title}>Booking family</h1>
                <div className={nav_menu}>
                    {NavItems.map((item, index) => (
                        <div key={index} className={nav_item}>
                            <div className={nav_icon}>{item.icon}</div>
                            <div className={nav_label}>{item.label}</div>
                        </div>
                    ))}
                </div>
                <Button title="Tạo đơn mới" onClick={() => { console.log('Tạo đơn mới'); }} />
            </div>

            <div className={nav_footer}>

                <div className={footer_info}>
                    <div className={footer_info_item}>
                        <IoHelpCircleOutline />
                        <span>Hỗ trợ</span>
                    </div>
                    <div className={footer_info_item} onClick={handleLogout}>
                        <IoIosLogOut />
                        <span>Đăng xuất</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
