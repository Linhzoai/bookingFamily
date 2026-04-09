import type React from "react";
import styles from "./style.module.scss";
interface ButtonProps {
    title: string;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
}

export default function Button({ title, onClick }: ButtonProps) {
    const { container } = styles;
    return (
        <button className={container} onClick={onClick}>
           {title}
        </button>
    )
}