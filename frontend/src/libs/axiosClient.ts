import { authService } from '@/services/authService';
import { authStore } from '@/stores/useAuthStore';
import Cookies from 'js-cookie';
import axios from 'axios';
const baseURL = import.meta.env.MODE === 'development' ? 'http://localhost:8000/api/v1' : import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL,
    validateStatus: (status) => status >= 200 && status < 300,
    timeout: 10000, // 10s
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use(async (config) => {
    const accessToken = authStore.getState().token;
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

api.interceptors.response.use(
    (res) => res,
    async (error) => {
        if (!error.response) return Promise.reject(error);
        const originalRequest = error.config;
        if (
            originalRequest.url.includes('/auth/refresh-token') ||
            originalRequest.url.includes('/auth/sign-in') ||
            originalRequest.url.includes('/auth/sign-up')
        ) {
            return Promise.reject(error);
        }
        originalRequest._retry = originalRequest._retry || 0;
        if (error.response.status === 403 && originalRequest._retry < 2) {
            originalRequest._retry++;
            try {
                const newAccessToken = await authService.refreshToken();
                authStore.setState({ token: newAccessToken });
                originalRequest.headers = {
                    ...originalRequest.headers,
                    Authorization: `Bearer ${newAccessToken}`
                };
            } catch (error) {
                Cookies.remove('refreshToken');
                authStore.setState({ token: null, user: null });
                localStorage.clear();
                sessionStorage.clear();
                return Promise.reject(error);
            }

            return api(originalRequest);
        }
        return Promise.reject(error);
    }
);

export default api;
