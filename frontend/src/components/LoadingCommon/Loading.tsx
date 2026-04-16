import { AiOutlineLoading3Quarters } from "react-icons/ai";
import styles from './style.module.scss';
import cls from "classnames";
interface LoadingProps {
    className?: string;
}
export default function Loading({ className }: LoadingProps) {
    const { loading, loading_icon } = styles;
    return (
        <>
            <div className={cls(loading, className)}>
                <AiOutlineLoading3Quarters className={loading_icon} />
            </div>
        </>
    )
}