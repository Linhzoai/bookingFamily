/* eslint-disable @typescript-eslint/no-explicit-any */
import { authService } from '@/services/authService';
import { useAuthStore } from '@/stores/useAuthStore';
import Cookies from 'js-cookie';
import axios from 'axios';
const baseURL = import.meta.env.MODE === 'development' ? 'http://localhost:8000/api/v1' : import.meta.env.VITE_API_URL;
let isRefreshing = false;
let failedQueue: Array<{resolve: (token: string) => void, reject: (err?: any) => void}> = [];
const processQueue= (error: any, token: string|null = null)=>{
    failedQueue.forEach(prom =>{
        if(error) prom.reject(error);
        else prom.resolve(token);
    })
    failedQueue = [];
}
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
    const accessToken = useAuthStore.getState().token;
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
            if (isRefreshing) {
                return new Promise<string>(function(resolve, reject) {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            isRefreshing = true;
            try {
                const newAccessToken = await authService.refreshToken();
                useAuthStore.setState({ token: newAccessToken });
                processQueue(null, newAccessToken);
                originalRequest.headers = {
                    ...originalRequest.headers,
                    Authorization: `Bearer ${newAccessToken}`
                };
                return api(originalRequest);
            } catch (error) {
                processQueue(error, null);
                Cookies.remove('refreshToken');
                useAuthStore.setState({ token: null, user: null });
                localStorage.clear();
                sessionStorage.clear();
                return Promise.reject(error);
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    }
);

export default api;
