/* eslint-disable react-hooks/exhaustive-deps */
import { Navigate, Outlet } from 'react-router-dom';
import { authStore } from '../../stores/useAuthStore';
import { useEffect, useState } from 'react';

export default function ProtectedRoute() {
    const { token, user, loading, refreshToken } = authStore();
    const [starting, setStarting] = useState<boolean>(true);
    const init = async () => {
        if (!token) {
            await refreshToken();
        }
        if (token && !user) {
            await refreshToken();
        }
        setStarting(false);
    };
    useEffect(() => {
        init();
    }, []);
    if (starting || loading) {
        return <div>Loading...</div>;
    }
    if (!token) {
        return <Navigate to="/auth" replace />;
    }
    return <Outlet></Outlet>;
}
