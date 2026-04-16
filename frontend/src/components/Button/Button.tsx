import type React from "react";
import styles from "./style.module.scss";
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    title: string;
}

export default function Button({ title, ...props }: ButtonProps) {
    const { container } = styles;
    return (
        <button className={container} {...props}>
           {title}
        </button>
    )
}