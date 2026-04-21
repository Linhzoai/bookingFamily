import api from "../libs/axiosClient";

export const authService = {
    signIn: async (data: { email: string, password: string }) => {
        const response = await api.post('/auth/sign-in', data);
        return response.data.data;
    },
    signUp: async (data: FormData) => {
        const response = await api.post('/auth/sign-up', data,{
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.data;
    },
    signOut: async () => {
        await api.post('/auth/sign-out');
    },
    updateCustomer: async( id: string,data: FormData) => {
        const response = await api.put(`/auth/${id}`, data,{
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.data;
    },
    refreshToken: async () => {
        const response = await api.post('/auth/refresh-token');
        return response.data.data.accessToken;
    },
    fetchMe: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    }
}