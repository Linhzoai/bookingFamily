/* eslint-disable no-useless-catch */
import { create } from "zustand";
import type { AuthStore } from "../types/store";
import { persist } from "zustand/middleware";
import { authService } from "@/services/authService";
export const authStore = create<AuthStore>()(
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
                } catch (error: unknown) {
                    throw error;
                } finally {
                    set({ loading: false });
                }
            },
            logout: async () => {
                set({ loading: true });
                try {
                    await authService.signOut();
                    set({ user: null, token: null, loading: false });
                } catch (error: unknown) {
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
                    set({ user: null, token: null });
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
                    set({ user: null, token: null });
                } finally {
                    set({ loading: false });
                }
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