import { Outlet } from 'react-router-dom';
import styles from './style.module.scss';
import Header from '@components/Header/Header';
import Navbar from '@components/Navbar/Navbar';
export default function Layout() {
    const { container, container_child, container_right, container_left } = styles;
    return (
        <div className={container}>
            <div className={container_left}>
                <Navbar />
            </div>
            <div className={container_right}>
                <Header />
                <div className={container_child}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
