import type { User } from "./auth";



export interface AuthStore {
    loading: boolean;
    user: User | null;
    token: string | null;
    login: (data: { email: string, password: string }) => Promise<void>;
    logout: () => Promise<void>;
    refreshToken: () => Promise<void>;
    fetchMe: () => Promise<void>;
}