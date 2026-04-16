import styles from './style.module.scss';
import { NavItems } from './contains.tsx';
import Button from '../Button/Button.tsx';
import { IoHelpCircleOutline } from 'react-icons/io5';
import { IoIosLogOut } from 'react-icons/io';
import { useAuthStore } from '../../stores/useAuthStore.ts';
import { toast } from 'react-toastify';
import { useNavigate, NavLink } from 'react-router-dom';

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
        nav_menu_container,
        active_item
    } = styles;
    const { logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout()
            .then(() => {
                toast.success('Đăng xuất thành công');
                navigate('/auth');
            })
            .catch(() => {
                toast.error('Đăng xuất thất bại');
            });
    };

    return (
        <aside className={container}>
            <div className={nav_menu_container}>
                <h1 className={title}>Booking Family</h1>
                <nav className={nav_menu}>
                    {NavItems.map((item, index) => (
                        <NavLink
                            key={index}
                            to={item.path}
                            className={({ isActive }) => `${nav_item} ${isActive ? active_item : ''}`}
                        >
                            <span className={`material-symbols-outlined ${nav_icon}`}>{item.iconName}</span>
                            <span className={nav_label}>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
                <div style={{ width: '90%', margin: '0 auto' }}>
                    <Button
                        title="+ Tạo đơn mới"
                        onClick={() => {
                            console.log('Tạo đơn mới');
                        }}
                    />
                </div>
            </div>

            <div className={nav_footer}>
                <div className={footer_info}>
                    <div className={footer_info_item}>
                        <IoHelpCircleOutline size={20} />
                        <span>Hỗ trợ</span>
                    </div>
                    <div className={footer_info_item} onClick={handleLogout}>
                        <IoIosLogOut size={20} />
                        <span>Đăng xuất</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}
