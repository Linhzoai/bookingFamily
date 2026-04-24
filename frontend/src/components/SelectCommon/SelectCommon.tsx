import styles from './style.module.scss';
interface SelectCommonProps {
    options: { label: string; value: number|string }[];
    placeholder: string;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    value: string;

}
export default function SelectCommon({options, placeholder , onChange,value, ...props}: SelectCommonProps) {
    const {select} = styles;
    return (
        <select className={select} onChange={onChange} value={value} {...props}>
            <option value="">--- {placeholder} ---</option>
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                   {option.label}
                </option>
            ))}
        </select>
    );
}
