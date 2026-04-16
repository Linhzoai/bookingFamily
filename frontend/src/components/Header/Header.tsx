import { useAuthStore } from '@/stores/useAuthStore';
import styles from './style.module.scss';
import SearchCommon from '@components/SearchCommon/SearchCommon';

export default function Header() {
    const { container, container_box, box_left, box_right, box_actions, action_button, notification_btn, badge } =
        styles;
    const userInfor = useAuthStore((state) => state.user);

    return (
        <header className={container}>
            <div className={container_box}>
                <div className={box_left}>
                    <SearchCommon placeholder="Tìm kiếm hệ thống..." />
                </div>
                <div className={box_right}>
                    <div className={box_actions}>
                        <button className={action_button}>
                            <span className="material-symbols-outlined">add</span>+ Trực tiếp tạo Booking
                        </button>
                        <div className={notification_btn}>
                            <span className="material-symbols-outlined">notifications</span>
                            <span className={badge}></span>
                        </div>
                    </div>
                    <div className={styles.user_profile}>
                        <div className={styles.info}>
                            <p className={styles.name}>{userInfor?.name || 'Admin Atelier'}</p>
                            <p className={styles.role}>{userInfor?.role || 'Super Admin'}</p>
                        </div>
                        <div className={styles.avatar}>
                            <img
                                src={
                                    userInfor?.avatarUrl ||
                                    'https://lh3.googleusercontent.com/aida-public/AB6AXuBKE3MHLibbgDP4xf43enk8h_nKSBOpaByynGDK-23Ag2a8bk5zvkUvf7iHS4W44LDmyKloELqjV-VmQB9K02A-RkOBR3XAIjulGVR9q6saD6VOuSmpwLK5WanyDSmv6FYwRMycrWTCe9Bc3c6cMTgm51sRvg9WUQFtVzYLctliS7Ae5oEsAuR_DqUBXrlOUPzg69S3MrRF8eL8HVakQeqAM2-g0EZ607xcpruLbWUWwEDWSFt9DmrcWdSWJV5SUGX8KwHYEz5CIEE'
                                }
                                alt="Avatar"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
