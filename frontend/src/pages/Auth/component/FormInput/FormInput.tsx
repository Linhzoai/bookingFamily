/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import styles from './style.module.scss';
import InputCard from '../InputCard/InputCard';
import { MdOutlineMailOutline } from 'react-icons/md';
import { GoEye } from 'react-icons/go';
import { GoEyeClosed } from 'react-icons/go';
import Button from '@/components/Button/Button';
import { useAuthStore } from '@/stores/useAuthStore';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';

const createSchema = () => {
    return z.object({
        email: z.string().email('Email không hợp lệ').min(1, 'Email không được để trống'),
        password: z.string().min(6, 'Password phải có ít nhất 6 ký tự')
    });
};

type FormData = z.infer<ReturnType<typeof createSchema>>;

export default function FormInput() {
    const { container, title, boxInput, boxButton, boxForm, boxRemember } = styles;
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const { login } = useAuthStore();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({ resolver: zodResolver(createSchema()), defaultValues: { email: '', password: '' } });

    const handleLogin = async (data: FormData) => {
        await login(data)
            .then(() => {
                toast.success('Đăng nhập thành công');
                navigate('/');
            })
            .catch((error) => {
                toast.error('Đăng nhập thất bại');
            });
    };
    return (
        <div className={container}>
            <div className={boxForm}>
                <form action="" onSubmit={handleSubmit(handleLogin)}>
                    <div className={title}>Login</div>
                    <div className={boxInput}>
                        <InputCard
                            title="Email"
                            type="email"
                            icon={<MdOutlineMailOutline size={24} color="$gray-color" />}
                            err={errors.email?.message}
                            {...register('email')}
                        />
                        <InputCard
                            title="Password"
                            type={showPassword ? 'text' : 'password'}
                            icon={
                                showPassword ? (
                                    <GoEye size={24} color="$gray-color" />
                                ) : (
                                    <GoEyeClosed size={24} color="$gray-color" />
                                )
                            }
                            setShowPassword={setShowPassword}
                            err={errors.password?.message}
                            {...register('password')}
                        />
                        <div className={boxRemember}>
                            <input type="checkbox" name="remember" id="remember" />
                            <label htmlFor="remember">Remember me</label>
                        </div>
                        <Button title="Login" type="submit" />
                    </div>
                    <div className={boxButton}></div>
                </form>
            </div>
        </div>
    );
}
