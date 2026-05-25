import { create } from 'zustand';
import { io, type Socket } from 'socket.io-client';
import type { SocketState } from '@/types/store';
import { useAuthStore } from './useAuthStore';

const baseURL = import.meta.env.VITE_SOCKET_URL;

export const useSocketStore = create<SocketState>((set, get) => ({
    socket: null,
    onlineUsers: [],

    connectSocket: () => {
        const accessToken = useAuthStore.getState().token;
        const existingSocket = get().socket;
        if (existingSocket) return;
        const socket: Socket = io(baseURL, {
            auth: { token: accessToken },
            transports: ['websocket']
        });
        set({ socket });
        socket.on('connect', () => {
            console.log('Đã kết nối với socket');
        });
        socket.on('online-users', (users) => {
            set({ onlineUsers: users });
        });
        socket.on('update-progress', (progress) => {
            console.log('Cập nhật tiến độ', progress);
        });
    },

    disconectSocket: () => {
        const socket = get().socket;
        if (socket) {
            socket.disconnect();
            set({ socket: null, onlineUsers: [] });
        }
    }
}));
