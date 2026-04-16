/* eslint-disable no-useless-catch */
import { create } from "zustand";
import type { AuthStore } from "../types/store";
import { persist } from "zustand/middleware";
import { authService } from "@/services/authService";
import { toast } from "react-toastify";
export const useAuthStore = create<AuthStore>()(

    persist(
        (set,get) => ({
            loading: false,
            user: null,
            token: null,
            login: async (data) => {
                set({ loading: true });
                try {
                    const response = await authService.signIn(data);
                    set({ user: response.user, token: response.accessToken });
                    toast.success("Đăng nhập thành công");
                } catch (error: unknown) {  
                    toast.error("Đăng nhập thất bại");
                    throw error;
                } finally {
                    set({ loading: false });
                }
            },
            logout: async () => {
                set({ loading: true });
                try {
                    await authService.signOut();
                    get().clearState();
                    toast.success("Đăng xuất thành công");
                } catch (error: unknown) {
                    toast.error("Đăng xuất thất bại");
                    throw error;

                } finally {
                    set({ loading: false });
                }
            },
            refreshToken: async () => {
                set({ loading: true });
                try {
                    const response = await authService.refreshToken();
                    set({ token: response });
                    if(!get().user){
                        await get().fetchMe();
                    }
                } catch (error: unknown) {
                    console.log(error);
                    toast.error("Refresh token thất bại");
                } finally {
                    set({ loading: false });
                }
            },
            fetchMe: async () => {
                set({ loading: true });
                try {
                    const response = await authService.fetchMe();
                    set({ user: response.data });
                } catch (error: unknown) {
                    console.log(error);
                    get().clearState();
                } finally {
                    set({ loading: false });
                }
            },
            clearState: () => {
                set({ user: null, token: null });
            }
        }),
        {
            name: 'auth',
            partialize: (state) => ({
                user: state.user,
                token: state.token,
            }),
        }
    )
);