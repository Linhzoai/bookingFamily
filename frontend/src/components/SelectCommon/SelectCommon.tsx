import styles from './style.module.scss';
interface SelectCommonProps {
    options: { label: string; value: number }[];
    placeholder: string;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}
export default function SelectCommon({options, placeholder , onChange, ...props}: SelectCommonProps) {
    const {select} = styles;
    return (
        <select className={select} onChange={onChange} {...props}>
            <option value="">--- {placeholder} ---</option>
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                   {option.label}
                </option>
            ))}
        </select>
    );
}
