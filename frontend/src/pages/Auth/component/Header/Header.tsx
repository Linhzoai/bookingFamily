import style from './style.module.scss';
import cls from 'classnames';
export default function Header(){
    const {container, boxMenu, itemMenu, active} = style
    const menus = [
        {title: 'Home', path: '/'}, 
        {title: 'About', path: '/about'}, 
        {title: 'Service', path: '/service'},
        {title: 'Contact', path: '/contact'},
        {title: 'Login', path: '/login'},
    ]
    return(
        <div className={container}>
           <div className={boxMenu}>
            {menus.map((item, index)=>(
                <div key = {index} className={cls(itemMenu, {[active]: item.title==='Login'})}>{item.title}</div>
            ))}
           </div>
        </div>
    )
}