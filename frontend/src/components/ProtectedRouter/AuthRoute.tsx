/* eslint-disable react-hooks/exhaustive-deps */
import { useAuthStore } from '@/stores/useAuthStore';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

export default function AuthRoute() {
    const { token, loading } = useAuthStore();
    const navigate = useNavigate();
    const init = () => {
        if (loading) {
            return <div>Loading .....</div>;
        }
        if (token) {
            navigate('/', { replace: true });
        }
    };
    useEffect(() => {
        init();
    }, []);

    return <Outlet />;
}
