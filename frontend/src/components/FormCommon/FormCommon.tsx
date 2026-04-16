import styles from './style.module.scss'
interface FormCommonProps {
    title: string;
}
export default function FormCommon({title}: FormCommonProps){
    const {container} = styles
    return(
        <div className={container}>
           <form action="">
            <div className={styles.form_header}>
                <p className={styles.label_tag}>Đăng ký</p>
                <h3>{title}</h3>
            </div>
           </form>
        </div>
    )
}