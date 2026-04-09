import { useState } from 'react';
import styles from './style.module.scss';
import InputCard from '../InputCard/InputCard';
import { MdOutlineMailOutline } from 'react-icons/md';
import { GoEye } from 'react-icons/go';
import { GoEyeClosed } from 'react-icons/go';
import Button from '@/components/Button/Button';
import { authStore } from '@/stores/useAuthStore';
export default function FormInput() {
    const { container, title, boxInput, boxButton, boxForm, boxRemember } = styles;
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const { login } = authStore();
    const handleLogin = () => {
        const data = { email, password,role: 'staff' };
        login(data);
    };
    return (
        <div className={container}>
            <div className={boxForm}>
                <div className={title}>Login</div>
                <div className={boxInput}>
                    <InputCard
                        title="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        icon={<MdOutlineMailOutline size={24} color="$gray-color" />}
                    />
                    <InputCard
                        title="Password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        icon={
                            showPassword ? (
                                <GoEye size={24} color="$gray-color" />
                            ) : (
                                <GoEyeClosed size={24} color="$gray-color" />
                            )
                        }
                        setShowPassword={setShowPassword}
                    />
                    <div className={boxRemember}>
                        <input type="checkbox" name="remember" id="remember" />
                        <label htmlFor="remember">Remember me</label>
                    </div>
                    <Button title="Login" onClick={handleLogin} />
                </div>
                <div className={boxButton}></div>
            </div>
        </div>
    );
}
