import styles from './style.module.scss';

import { CiSearch } from "react-icons/ci";
interface SearchProps{
    placeholder?: string;
}
export default function SearchCommon({placeholder}: SearchProps){
    const  {container} = styles;
    return(
        <div className={container}>
            <CiSearch />
            <input type="text" placeholder={placeholder} />
        </div>
    )
}