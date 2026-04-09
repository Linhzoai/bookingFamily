import styles from './style.module.scss';
import { NavItems } from './contains.tsx';
import Button from '../Button/Button.tsx';
import { IoHelpCircleOutline } from 'react-icons/io5';
import { IoIosLogOut } from 'react-icons/io';
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
        footer_info_support,
        footer_info_logout,
        nav_menu_container
    } = styles;
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
                    <div className={footer_info_support}>
                        <IoHelpCircleOutline />
                        <span>Hỗ trợ</span>
                    </div>
                    <div className={footer_info_logout}>
                        <IoIosLogOut />
                        <span>Đăng xuất</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
