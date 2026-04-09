import style from './style.module.scss'
import Header from './component/Header/Header'
import FormInput from './component/FormInput/FormInput';
export default function Auth(){
    const {container} = style;
    return(
        <div className={container}>
           <Header/>
           <FormInput/>
        </div>
    )
}