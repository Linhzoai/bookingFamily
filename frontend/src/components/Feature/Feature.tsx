import style from './style.module.scss';
import FeatureItem from './FeatureeItem/FeatureItem';
interface FeatureProps{
    data: {
        icon: React.ReactNode;
        title: string;
        description: string;
        color: string;
    }[];
}
export default function Feature({data}: FeatureProps){
    const {container} = style;
    return(
        <div className={container}>
           {data.map((item, index) => (
            <FeatureItem key={index} icon={item.icon} title={item.title} description={item.description} color={item.color} />
           ))}
        </div>
    )
}