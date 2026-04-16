import style from './style.module.scss';
interface FeatureProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    color: string;
}
export default function FeatureItem({ icon, title, description, color }: FeatureProps) {
    const { container, box_icon, box_info, box_title, box_description } = style;
    return (
        <div className={container}>
            <div className={box_icon} style={{ backgroundColor: color }}>
                {icon}
            </div>
            <div className={box_info}>
                <div className={box_title}>{title}</div>
                <div className={box_description}>{description}</div>
            </div>
        </div>
    );
}
