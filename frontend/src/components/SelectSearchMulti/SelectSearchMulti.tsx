import { forwardRef, useEffect, useRef, useState, type SelectHTMLAttributes } from 'react';
import styles from './style.module.scss';
import cls from 'classnames';

interface SelectSearchMultiProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'value' | 'onChange'> {
    options: { label: string; value: number | string }[];
    placeholder: string;
    value?: (string | number)[];
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SelectSearchMulti = forwardRef<HTMLSelectElement, SelectSearchMultiProps>(
    ({ options, placeholder, onChange, value, defaultValue, disabled, ...props }, ref) => {
        const {
            container,
            hidden_select,
            select_display,
            label,
            placeholde_style,
            open,
            disabled_style,
            dropdown_menu,
            search_wrapper,
            search_input,
            options_list
        } = styles;

        const [isOpen, setIsOpen] = useState(false);
        const [searchTerm, setSearchTerm] = useState('');
        
        // Luôn đảm bảo internalValue là một mảng
        const [internalValue, setInternalValue] = useState<(string | number)[]>(
            Array.isArray(value) ? value : Array.isArray(defaultValue) ? defaultValue : []
        );
        
        const wrapperRef = useRef<HTMLDivElement>(null);

        // Đồng bộ value từ parent truyền vào nếu nó thay đổi (như khi reset form)
        const [preValueProp, setPreValueProps] = useState(value);
        if (value !== preValueProp) {
            setPreValueProps(value);
            if (value !== undefined) {
                setInternalValue(Array.isArray(value) ? value : []);
            }
        }

        useEffect(() => {
            const handleClickOutSide = (e: MouseEvent) => {
                if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                    setIsOpen(false);
                    setSearchTerm('');
                }
            };
            document.addEventListener('mousedown', handleClickOutSide);
            return () => document.removeEventListener('mousedown', handleClickOutSide);
        }, []);

        const handleSelect = (clickedValue: string | number) => {
            let newValues: (string | number)[];
            
            // Xử lý nút Clear All (Option rỗng)
            if (clickedValue === '') {
                newValues = [];
                setIsOpen(false);
            } else {
                newValues = internalValue.includes(clickedValue)
                    ? internalValue.filter((item) => String(item) !== String(clickedValue))
                    : [...internalValue, clickedValue];
            }

            setInternalValue(newValues);
            
            // Nếu Multi-select thì KHÔNG được đóng menu ngay sau khi chọn 1 cái
            // setIsOpen(false); // Đã bị vô hiệu hoá
            
            if (onChange) {
                // Tạo một fake event đẩy lên cho react-hook-form hoặc func bắt giá trị mảng
                const event = {
                    target: { value: newValues, name: props.name },
                    currentTarget: { value: newValues, name: props.name }
                } as unknown as React.ChangeEvent<HTMLSelectElement>;
                onChange(event);
            }
        };

        const filteredOption = options.filter((option) =>
            option.label.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const selectedOptions = options.filter((o) => internalValue.includes(o.value));
        const displayLabel = selectedOptions.length > 0 
            ? `Đã chọn ${selectedOptions.length} lựa chọn` 
            : `--- ${placeholder} ---`;

        return (
            <div className={container} ref={wrapperRef}>
                <select
                    className={hidden_select}
                    ref={ref}
                    value={internalValue.map(String)}
                    onChange={onChange}
                    disabled={disabled}
                    multiple 
                    style={{display: 'none'}}
                    {...props}
                >
                    <option value="">--- {placeholder} ---</option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                {/* Bổ sung onClick ở đây để mở Dropdown menu */}
                <div 
                    className={cls(select_display, isOpen && open, disabled && disabled_style)}
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                >
                    <span className={cls(label, selectedOptions.length === 0 && placeholde_style)}>
                        {displayLabel}
                    </span>
                    <span className="material-symbols-outlined">expand_more</span>
                </div>

                {/* Menu và ô search */}
                {isOpen && (
                    <div className={dropdown_menu}>
                        <div className={search_wrapper}>
                            <span className="material-symbols-outlined">search</span>
                            <input
                                type="text"
                                className={search_input}
                                placeholder="Nhập để tìm kiếm..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                autoFocus
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>

                        <ul className={options_list}>
                            <li 
                                className={internalValue.length === 0 ? styles.selected : ''} 
                                onClick={() => handleSelect('')}
                            >
                                --- Bỏ chọn tất cả ---
                            </li>
                            {filteredOption.length > 0 ? (
                                filteredOption.map((option) => (
                                    <li
                                        key={option.value}
                                        className={internalValue.includes(option.value) ? styles.selected : ''}
                                        onClick={() => handleSelect(option.value)}
                                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                                    >
                                        <input 
                                            type="checkbox" 
                                            checked={internalValue.includes(option.value)} 
                                            readOnly 
                                        />
                                        <span>{option.label}</span>
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

export default SelectSearchMulti;
