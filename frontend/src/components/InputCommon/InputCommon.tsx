import React from 'react';
import styles from './style.module.scss';
import cls from 'clsx';

interface InputCommonProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string;
}

export default function InputCommon({ error, className, ...props }: InputCommonProps) {
    const { container, input, input_error, icon_left, error_text, input_wrapper } = styles;

    return (
        <div className={cls(container, className)}>
            <div className={input_wrapper}>
                <div className={cls('material-symbols-outlined',icon_left)}>search</div>
                
                <input 
                    className={cls(input, error && input_error)} 
                    {...props} 
                />
            </div>
            
            {error && <span className={error_text}>{error}</span>}
        </div>
    );
}