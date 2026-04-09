import styles from './style.module.scss';

interface InputCardProps {
    title: string;
    type: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    icon: React.ReactNode;
    setShowPassword?: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function InputCard({ title, type, value, onChange, icon, setShowPassword }: InputCardProps) {
    const { container, boxIcon } = styles;
    return (
        <div className={container}>
            <div className={boxIcon} onClick={() => setShowPassword((prev) => !prev)}>{icon}</div>
            <input type={type} name={title} id={title} placeholder={title} value={value} onChange={onChange}/>
        </div>
    );
}
