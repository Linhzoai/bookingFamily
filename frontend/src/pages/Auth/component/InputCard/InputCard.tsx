import styles from './style.module.scss';

interface InputCardProps {
    title: string;
    type: string;
    icon: React.ReactNode;
    err?: string
    setShowPassword?: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function InputCard({ title, type, icon, setShowPassword, err, ...props }: InputCardProps) {
    const { container, boxIcon,err_title,boxInput } = styles;
    return (
        <div className={container}>
            <div className={boxInput}>
                <div className={boxIcon} onClick={() => setShowPassword((prev) => !prev)}>{icon}</div>
                <input autoComplete="off" type={type} name={title} id={title} placeholder={title} required {...props}/>
            </div>
            <p className={err_title}>{err}</p>
        </div>
    );
}
