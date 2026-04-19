import styles from './style.module.scss';

interface CategoryCardProps {
    title: string;
    count: number;
    icon: string;
}

export default function CategoryCard({ title, count, icon }: CategoryCardProps) {
    const {card, icon_box, info, title_card, quantity} = styles;
    return (
        <div className={card}>
            <div className={icon_box}>
                <span className="material-symbols-outlined">{icon}</span>
            </div>
            <div className={info}>
                <h4 className={title_card}>{title}</h4>
                <p className={quantity}>{count} dịch vụ</p>
            </div>
        </div>
    );
}
