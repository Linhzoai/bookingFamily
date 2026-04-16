import api from "../libs/axiosClient";

export const authService = {
    signIn: async (data: { email: string, password: string }) => {
        const response = await api.post('/auth/sign-in', data);
        return response.data.data;
    },
    signOut: async () => {
        await api.post('/auth/sign-out');
    },
    refreshToken: async () => {
        console.log("đã chạy refresh token");
        const response = await api.post('/auth/refresh-token');
        return response.data.data.accessToken;
    },
    fetchMe: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    }
}