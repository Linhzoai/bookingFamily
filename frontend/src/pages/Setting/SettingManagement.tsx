import { useState, useRef } from 'react';
import styles from './style.module.scss';
import { useAuthStore } from '@/stores/useAuthStore';
import { useUpdateQuery } from '@/hooks/useQueryCustom';
import { authService } from '@/services/authService';
import { TiCameraOutline } from 'react-icons/ti';
import cls from 'classnames';
import SelectCommon from '@/components/SelectCommon/SelectCommon';

type SettingTab = 'profile' | 'business' | 'notifications' | 'security' | 'payment' | 'integrations';

interface TabItem {
    key: SettingTab;
    label: string;
    icon: string;
    description: string;
}

const TABS: TabItem[] = [
    { key: 'profile', label: 'Hồ sơ cá nhân', icon: 'person', description: 'Quản lý thông tin và ảnh đại diện' },
    { key: 'business', label: 'Thông tin doanh nghiệp', icon: 'business', description: 'Cập nhật thông tin công ty' },
    { key: 'notifications', label: 'Thông báo', icon: 'notifications', description: 'Tuỳ chỉnh cảnh báo hệ thống' },
    { key: 'security', label: 'Bảo mật', icon: 'shield', description: 'Mật khẩu và xác thực' },
    { key: 'payment', label: 'Thanh toán', icon: 'payments', description: 'Phương thức thanh toán' },
    { key: 'integrations', label: 'Tích hợp', icon: 'extension', description: 'Kết nối dịch vụ bên thứ ba' },
];

export default function SettingManagement() {
    const {
        container,
        header,
        title,
        subtitle,
        setting_layout,
        sidebar_nav,
        nav_item,
        nav_item_active,
        nav_icon,
        nav_text,
        nav_label,
        nav_desc,
        active_indicator,
        content_area,
        section_card,
        section_title,
        section_subtitle,
        avatar_section,
        avatar_wrapper,
        avatar_img,
        avatar_overlay,
        avatar_info,
        avatar_name,
        avatar_role,
        avatar_hint,
        form_grid,
        form_group,
        form_label,
        form_input,
        form_select,
        preferences_row,
        pref_item,
        pref_label,
        pref_desc,
        toggle_switch,
        toggle_slider,
        action_bar,
        cancel_btn,
        save_btn,
        badge_version,
        security_row,
        security_item,
        security_icon,
        security_info,
        security_title_text,
        security_desc,
        security_action,
        notif_grid,
        notif_item,
        notif_header,
        notif_toggle,
        notif_label,
        notif_sublabel,
        integration_grid,
        integration_card,
        integration_icon_box,
        integration_name,
        integration_status,
        integration_btn,
        connected,
        payment_card,
        payment_icon,
        payment_info,
        payment_name,
        payment_detail,
        payment_badge,
        business_logo,
        logo_placeholder,
    } = styles;

    const [activeTab, setActiveTab] = useState<SettingTab>('profile');
    const user = useAuthStore((state) => state.user);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { mutate: updateProfile } = useUpdateQuery('user', authService.updateCustomer, 'Hồ sơ');

    // Form states
    const [profileForm, setProfileForm] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        gender: user?.gender || 'male',
    });

    const [preferences, setPreferences] = useState({
        language: 'vi',
        timezone: 'Asia/Ho_Chi_Minh',
        darkMode: false,
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
    });

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const formData = new FormData();
            formData.append('avatar', file);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            updateProfile({ id: user?.id || '', data: formData as any }, {
                onSuccess: async () => {
                    await useAuthStore.getState().fetchMe();
                }   
            });
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setProfileForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        const formData = new FormData();
        formData.append('name', profileForm.name);
        formData.append('phone', profileForm.phone);
        formData.append('gender', profileForm.gender);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        updateProfile({ id: user?.id || '', data: formData as any }, {
            onSuccess: async () => {
                await useAuthStore.getState().fetchMe();
            }
        });
    };

    const handleCancel = () => {
        setProfileForm({
            name: user?.name || '',
            email: user?.email || '',
            phone: user?.phone || '',
            gender: user?.gender || 'male',
        });
    };

    const renderProfileTab = () => (
        <>
            {/* Avatar Section */}
            <div className={section_card}>
                <div className={avatar_section}>
                    <div className={avatar_wrapper} onClick={() => fileInputRef.current?.click()}>
                        <img
                            className={avatar_img}
                            src={user?.avatarUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKE3MHLibbgDP4xf43enk8h_nKSBOpaByynGDK-23Ag2a8bk5zvkUvf7iHS4W44LDmyKloELqjV-VmQB9K02A-RkOBR3XAIjulGVR9q6saD6VOuSmpwLK5WanyDSmv6FYwRMycrWTCe9Bc3c6cMTgm51sRvg9WUQFtVzYLctliS7Ae5oEsAuR_DqUBXrlOUPzg69S3MrRF8eL8HVakQeqAM2-g0EZ607xcpruLbWUWwEDWSFt9DmrcWdSWJV5SUGX8KwHYEz5CIEE'}
                            alt="Avatar"
                        />
                        <div className={avatar_overlay}>
                            <TiCameraOutline size={24} />
                            <span>Thay đổi</span>
                        </div>
                        <input type="file" hidden ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" />
                    </div>
                    <div className={avatar_info}>
                        <h3 className={avatar_name}>{user?.name || 'Admin Atelier'}</h3>
                        <p className={avatar_role}>{user?.role === 'admin' ? 'Quản trị viên' : user?.role === 'staff' ? 'Nhân viên' : 'Người dùng'}</p>
                        <p className={avatar_hint}>Nhấp vào ảnh để thay đổi ảnh đại diện</p>
                    </div>
                </div>
            </div>

            {/* Personal Info */}
            <div className={section_card}>
                <h3 className={section_title}>
                    <span className="material-symbols-outlined">badge</span>
                    Thông tin cá nhân
                </h3>
                <p className={section_subtitle}>Cập nhật thông tin cá nhân của bạn tại đây.</p>
                <div className={form_grid}>
                    <div className={form_group}>
                        <label className={form_label}>Họ và tên</label>
                        <input
                            className={form_input}
                            type="text"
                            value={profileForm.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            placeholder="Nhập họ và tên..."
                        />
                    </div>
                    <div className={form_group}>
                        <label className={form_label} >Email</label>
                        <input
                            className={cls(form_input, styles.disabled)}
                            type="email"
                            value={profileForm.email}
                            disabled
                            placeholder="email@example.com"
                        />
                    </div>
                    <div className={form_group}>
                        <label className={form_label}>Số điện thoại</label>
                        <input
                            className={form_input}
                            type="tel"
                            value={profileForm.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            placeholder="0912 345 678"
                        />
                    </div>
                    <div className={form_group}>
                        <label className={form_label}>Giới tính</label>
                        <select
                            className={form_select}
                            value={profileForm.gender}
                            onChange={(e) => handleInputChange('gender', e.target.value)}
                        >
                            <option value="male">Nam</option>
                            <option value="female">Nữ</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Preferences */}
            <div className={section_card}>
                <h3 className={section_title}>
                    <span className="material-symbols-outlined">tune</span>
                    Tuỳ chỉnh giao diện
                </h3>
                <p className={section_subtitle}>Cá nhân hoá trải nghiệm sử dụng hệ thống.</p>
                <div className={preferences_row}>
                    <div className={pref_item}>
                        <div>
                            <p className={pref_label}>Ngôn ngữ</p>
                            <p className={pref_desc}>Chọn ngôn ngữ hiển thị</p>
                        </div>
                        <SelectCommon 
                            options={[
                                { value: 'vi', label: 'Tiếng Việt' },
                                { value: 'en', label: 'English' },
                                { value: 'ja', label: '日本語' },
                            ]} 
                            value={preferences.language}
                            placeholder='Chọn ngôn ngữ'
                            onChange={(e) => setPreferences(p => ({ ...p, language: e.target.value }))} 
                        />
                    </div>
                    <div className={pref_item}>
                        <div>
                            <p className={pref_label}>Múi giờ</p>
                            <p className={pref_desc}>Múi giờ hiển thị trong hệ thống</p>
                        </div>
                        <SelectCommon 
                            options={[
                                { value: 'Asia/Ho_Chi_Minh', label: 'UTC+7 (Việt Nam)' },
                                { value: 'Asia/Tokyo', label: 'UTC+9 (Tokyo)' },
                                { value: 'America/New_York', label: 'UTC-5 (New York)' },
                            ]} 
                            value={preferences.timezone}
                            placeholder='Chọn múi giờ'
                            onChange={(e) => setPreferences(p => ({ ...p, timezone: e.target.value }))} 
                        />
                    </div>
                    <div className={pref_item}>
                        <div>
                            <p className={pref_label}>Chế độ tối</p>
                            <p className={pref_desc}>Chuyển giao diện sang dark mode</p>
                        </div>
                        <label className={toggle_switch}>
                            <input
                                type="checkbox"
                                checked={preferences.darkMode}
                                onChange={(e) => setPreferences(p => ({ ...p, darkMode: e.target.checked }))}
                            />
                            <span className={toggle_slider}></span>
                        </label>
                    </div>
                </div>
            </div>
        </>
    );

    const renderSecurityTab = () => (
        <div className={section_card}>
            <h3 className={section_title}>
                <span className="material-symbols-outlined">shield</span>
                Bảo mật tài khoản
            </h3>
            <p className={section_subtitle}>Quản lý mật khẩu và phương thức xác thực.</p>
            <div className={security_row}>
                <div className={security_item}>
                    <div className={security_icon}>
                        <span className="material-symbols-outlined">lock</span>
                    </div>
                    <div className={security_info}>
                        <p className={security_title_text}>Mật khẩu</p>
                        <p className={security_desc}>Cập nhật lần cuối: 30 ngày trước</p>
                    </div>
                    <button className={security_action}>Đổi mật khẩu</button>
                </div>
                <div className={security_item}>
                    <div className={security_icon}>
                        <span className="material-symbols-outlined">smartphone</span>
                    </div>
                    <div className={security_info}>
                        <p className={security_title_text}>Xác thực hai yếu tố (2FA)</p>
                        <p className={security_desc}>Chưa kích hoạt — Khuyến nghị bật để tăng bảo mật</p>
                    </div>
                    <button className={security_action}>Kích hoạt</button>
                </div>
                <div className={security_item}>
                    <div className={security_icon}>
                        <span className="material-symbols-outlined">devices</span>
                    </div>
                    <div className={security_info}>
                        <p className={security_title_text}>Phiên đăng nhập</p>
                        <p className={security_desc}>2 thiết bị đang hoạt động</p>
                    </div>
                    <button className={security_action}>Quản lý</button>
                </div>
                <div className={security_item}>
                    <div className={security_icon}>
                        <span className="material-symbols-outlined">history</span>
                    </div>
                    <div className={security_info}>
                        <p className={security_title_text}>Nhật ký hoạt động</p>
                        <p className={security_desc}>Xem lịch sử đăng nhập và thao tác</p>
                    </div>
                    <button className={security_action}>Xem log</button>
                </div>
            </div>
        </div>
    );

    const renderNotificationsTab = () => (
        <div className={section_card}>
            <h3 className={section_title}>
                <span className="material-symbols-outlined">notifications</span>
                Cài đặt thông báo
            </h3>
            <p className={section_subtitle}>Chọn cách bạn muốn nhận thông báo từ hệ thống.</p>
            <div className={notif_grid}>
                {[
                    { label: 'Thông báo qua Email', sublabel: 'Nhận thông báo booking, cập nhật hệ thống qua email', key: 'emailNotifications' },
                    { label: 'Thông báo qua SMS', sublabel: 'Nhận tin nhắn SMS cho các sự kiện quan trọng', key: 'smsNotifications' },
                    { label: 'Thông báo đẩy', sublabel: 'Nhận thông báo real-time trên trình duyệt', key: 'pushNotifications' },
                ].map((item) => (
                    <div className={notif_item} key={item.key}>
                        <div className={notif_header}>
                            <div>
                                <p className={notif_label}>{item.label}</p>
                                <p className={notif_sublabel}>{item.sublabel}</p>
                            </div>
                            <label className={cls(toggle_switch, notif_toggle)}>
                                <input
                                    type="checkbox"
                                    checked={preferences[item.key as keyof typeof preferences] as boolean}
                                    onChange={(e) => setPreferences(p => ({ ...p, [item.key]: e.target.checked }))}
                                />
                                <span className={toggle_slider}></span>
                            </label>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderBusinessTab = () => (
        <div className={section_card}>
            <h3 className={section_title}>
                <span className="material-symbols-outlined">business</span>
                Thông tin doanh nghiệp
            </h3>
            <p className={section_subtitle}>Cập nhật thông tin doanh nghiệp hiển thị trên hệ thống.</p>

            <div className={business_logo}>
                <div className={logo_placeholder}>
                    <span className="material-symbols-outlined">apartment</span>
                </div>
                <div>
                    <p className={pref_label}>Logo doanh nghiệp</p>
                    <p className={pref_desc}>Tải lên logo với kích thước tối thiểu 256x256px</p>
                    <button className={cancel_btn} style={{ marginTop: 8, padding: '6px 16px', fontSize: 12 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>upload</span>
                        Tải lên
                    </button>
                </div>
            </div>

            <div className={form_grid}>
                <div className={form_group}>
                    <label className={form_label}>Tên doanh nghiệp</label>
                    <input className={form_input} type="text" defaultValue="Booking Family Corp." placeholder="Nhập tên doanh nghiệp..." />
                </div>
                <div className={form_group}>
                    <label className={form_label}>Mã số thuế</label>
                    <input className={cls(form_input, styles.mono)} type="text" defaultValue="0312345678" placeholder="Nhập MST..." />
                </div>
                <div className={form_group}>
                    <label className={form_label}>Email liên hệ</label>
                    <input className={form_input} type="email" defaultValue="contact@bookingfamily.vn" placeholder="email@domain.com" />
                </div>
                <div className={form_group}>
                    <label className={form_label}>Hotline</label>
                    <input className={form_input} type="tel" defaultValue="1900 6868" placeholder="Số hotline..." />
                </div>
                <div className={cls(form_group, styles.full_width)}>
                    <label className={form_label}>Địa chỉ trụ sở</label>
                    <input className={form_input} type="text" defaultValue="123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh" placeholder="Nhập địa chỉ..." />
                </div>
            </div>
        </div>
    );

    const renderPaymentTab = () => (
        <div className={section_card}>
            <h3 className={section_title}>
                <span className="material-symbols-outlined">payments</span>
                Phương thức thanh toán
            </h3>
            <p className={section_subtitle}>Quản lý các phương thức thanh toán và hoá đơn.</p>
            <div className={security_row}>
                {[
                    { icon: 'account_balance', name: 'Chuyển khoản ngân hàng', detail: 'Vietcombank ••• 4589', active: true },
                    { icon: 'credit_card', name: 'Thẻ tín dụng / Ghi nợ', detail: 'Visa ••• 7823', active: true },
                    { icon: 'qr_code_2', name: 'Ví điện tử (MoMo, ZaloPay)', detail: 'Chưa kết nối', active: false },
                ].map((item, index) => (
                    <div className={payment_card} key={index}>
                        <div className={payment_icon}>
                            <span className="material-symbols-outlined">{item.icon}</span>
                        </div>
                        <div className={payment_info}>
                            <p className={payment_name}>{item.name}</p>
                            <p className={cls(payment_detail, styles.mono)}>{item.detail}</p>
                        </div>
                        <span className={cls(payment_badge, item.active && connected)}>
                            {item.active ? 'Đã kết nối' : 'Chưa kết nối'}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderIntegrationsTab = () => (
        <div className={section_card}>
            <h3 className={section_title}>
                <span className="material-symbols-outlined">extension</span>
                Dịch vụ tích hợp
            </h3>
            <p className={section_subtitle}>Kết nối hệ thống với các nền tảng bên thứ ba.</p>
            <div className={integration_grid}>
                {[
                    { name: 'Google Calendar', icon: 'event', status: true, color: '#4285f4' },
                    { name: 'Zalo OA', icon: 'chat', status: false, color: '#0068ff' },
                    { name: 'Firebase', icon: 'cloud', status: true, color: '#ffca28' },
                    { name: 'Stripe', icon: 'payment', status: false, color: '#635bff' },
                    { name: 'Twilio SMS', icon: 'sms', status: false, color: '#f22f46' },
                    { name: 'Google Analytics', icon: 'analytics', status: true, color: '#e37400' },
                ].map((item, index) => (
                    <div className={integration_card} key={index}>
                        <div className={integration_icon_box} style={{ background: `${item.color}15` }}>
                            <span className="material-symbols-outlined" style={{ color: item.color }}>{item.icon}</span>
                        </div>
                        <p className={integration_name}>{item.name}</p>
                        <span className={cls(integration_status, item.status && connected)}>
                            {item.status ? 'Đã kết nối' : 'Chưa kết nối'}
                        </span>
                        <button className={integration_btn}>
                            {item.status ? 'Cấu hình' : 'Kết nối'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'profile': return renderProfileTab();
            case 'security': return renderSecurityTab();
            case 'notifications': return renderNotificationsTab();
            case 'business': return renderBusinessTab();
            case 'payment': return renderPaymentTab();
            case 'integrations': return renderIntegrationsTab();
            default: return renderProfileTab();
        }
    };

    return (
        <div className={container}>
            {/* Header */}
            <div className={header}>
                <div>
                    <h2 className={title}>Cài đặt hệ thống</h2>
                    <p className={subtitle}>Quản lý cấu hình và tuỳ chỉnh hệ thống Booking Family.</p>
                </div>
                <div className={badge_version}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>info</span>
                    v1.0.0
                </div>
            </div>

            {/* Main Layout */}
            <div className={setting_layout}>
                {/* Sidebar Navigation */}
                <nav className={sidebar_nav}>
                    {TABS.map((tab) => (
                        <button
                            key={tab.key}
                            className={cls(nav_item, activeTab === tab.key && nav_item_active)}
                            onClick={() => setActiveTab(tab.key)}
                        >
                            {activeTab === tab.key && <div className={active_indicator} />}
                            <span className={cls('material-symbols-outlined', nav_icon)}>{tab.icon}</span>
                            <div className={nav_text}>
                                <span className={nav_label}>{tab.label}</span>
                                <span className={nav_desc}>{tab.description}</span>
                            </div>
                        </button>
                    ))}
                </nav>

                {/* Content Area */}
                <div className={content_area}>
                    {renderContent()}
                </div>
            </div>

            {/* Action Bar */}
            <div className={action_bar}>
                <button className={cancel_btn} onClick={handleCancel}>
                    <span className="material-symbols-outlined">undo</span>
                    Huỷ thay đổi
                </button>
                <button className={save_btn} onClick={handleSave}>
                    <span className="material-symbols-outlined">save</span>
                    Lưu thay đổi
                </button>
            </div>
        </div>
    );
}
