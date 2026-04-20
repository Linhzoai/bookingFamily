import React, { useState, useRef, useEffect, forwardRef, type SelectHTMLAttributes } from 'react';
import styles from './style.module.scss';
import cls from 'classnames';

interface SelectSearchProps extends SelectHTMLAttributes<HTMLSelectElement> {
    options: { label: string; value: number | string }[];
    placeholder: string;
    enabled?: boolean;

}

const SelectSearch = forwardRef<HTMLSelectElement, SelectSearchProps>(
    ({ options, placeholder, onChange, value, defaultValue, disabled, enabled, ...props }, ref) => {
        const [isOpen, setIsOpen] = useState(false);
        const [searchTerm, setSearchTerm] = useState('');
        const [internalValue, setInternalValue] = useState<string | number>(
            (value as string | number) || (defaultValue as string | number) || ''
        );
        const wrapperRef = useRef<HTMLDivElement>(null);

        // Phù hợp chuẩn React >= 18: Derive state lúc render, tránh dùng useEffect sinh ra render thừa (cascading re-render)
        const [prevValueProp, setPrevValueProp] = useState(value);
        if (value !== prevValueProp) {
            setPrevValueProp(value);
            if (value !== undefined) {
                setInternalValue(value as string | number);
            }
        }

        // Đóng dropdown khi click ra ngoài
        useEffect(() => {
            const handleClickOutside = (e: MouseEvent) => {
                if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                    setIsOpen(false);
                    setSearchTerm(''); // Reset text search
                }
            };
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }, []);
        const handleSelect = (val: string | number) => {
            setInternalValue(val);
            setIsOpen(false);
            setSearchTerm('');

            if (onChange) {
                // Giả lập event native để tương thích 100% với react-hook-form
                const event = {
                    target: { value: val, name: props.name },
                    currentTarget: { value: val, name: props.name },
                    type: 'change'
                } as React.ChangeEvent<HTMLSelectElement>;
                onChange(event);
            }
        };

        const filteredOptions = options.filter((option) =>
            option.label.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const selectedOption = options.find((o) => String(o.value) === String(internalValue));
        const displayLabel = selectedOption ? selectedOption.label : `--- ${placeholder} ---`;

        return (
            <div className={cls(styles.container)} ref={wrapperRef}>
                {/* 1. Element ẩn: Nắm giữ dữ liệu gốc cho thư viện Form (React Hook Form) */}

                <select
                    className={styles.hidden_select}
                    ref={ref}
                    value={internalValue}
                    onChange={onChange}
                    disabled={disabled}
                    {...props}
                >
                    <option value="">--- {placeholder} ---</option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                {/* 2. Giao diện Dropdown box  */}
                <div
                    className={cls(styles.select_display, isOpen && styles.open, enabled && styles.enabled)}
                    onClick={() => !enabled && setIsOpen(!isOpen)}
                >
                    <span className={cls(styles.label, !selectedOption && styles.placeholder)}>{displayLabel}</span>
                    <span className="material-symbols-outlined">expand_more</span>
                </div>

                {/* 3. Menu chọn & Ô Search */}
                {isOpen && (
                    <div className={cls(styles.dropdown_menu, enabled && styles.enabled)} >
                        <div className={styles.search_wrapper}>
                            <span className="material-symbols-outlined">search</span>
                            <input
                                type="text"
                                className={styles.search_input}
                                placeholder="Nhập để tìm kiếm..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                autoFocus // Tự động focus vào ô nhập ngay khi menu mở
                                onClick={(e) => e.stopPropagation()} // Ngăn chặn sự kiện click lan ra ngoài
                            />
                        </div>

                        <ul className={styles.options_list}>
                            <li className={!internalValue ? styles.selected : ''} onClick={() => handleSelect('')}>
                                --- {placeholder} ---
                            </li>
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((option) => (
                                    <li
                                        key={option.value}
                                        className={
                                            String(internalValue) === String(option.value) ? styles.selected : ''
                                        }
                                        onClick={() => handleSelect(option.value)}
                                    >
                                        {option.label}
                                    </li>
                                ))
                            ) : (
                                <li className={styles.no_result}>Không tìm thấy "{searchTerm}"</li>
                            )}
                        </ul>
                    </div>
                )}
            </div>
        );
    }
);

export default SelectSearch;
