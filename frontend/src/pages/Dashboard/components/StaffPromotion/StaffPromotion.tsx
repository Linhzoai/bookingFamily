import React from 'react';
import styles from './style.module.scss';

export default function StaffPromotion() {
    return (
        <section className={styles.container}>
            <div className={styles.content}>
                <h3 className={styles.title}>Đội ngũ kỹ thuật ưu tú</h3>
                <p className={styles.description}>
                    Booking Family đang có 5 nhân viên xuất sắc được khách hàng đánh giá 5 sao trong tháng này. 
                    Hãy xem xét thưởng KPI!
                </p>
                <button className={styles.button}>Xem Danh Sách</button>
            </div>
            <div className={styles.image_wrapper}>
                <img 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAlbxzYWujVSzsgpgSah0GJisDmmF4gxXxK94H_2sExlmo11BmgfUFWqAa617C-SI4_7FB9-dmBNxZA8iGyBaoktXY_tztKCPySER8rUtCrMJuG_jchnADFMBGxb6jwUxEG_GSXeH_-2AcNOJeiuV-E5bfxnNiX2cMvcn1KJVRA4NBsPjEME2p7FNnju-vZRg0kUpBbFa0LOOM1r3wMaI18fZudQpsqyCx-SV-yFcnek3pwxaffPAOToa4YcuAvfVaASCvALyj_8_s" 
                    alt="Engineers" 
                />
            </div>
            <div className={styles.circle_bottom}></div>
        </section>
    );
}
