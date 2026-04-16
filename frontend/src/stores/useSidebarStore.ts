import { create } from "zustand";
import type { SideBarStore } from "@/types/store";

export const useSideBarStore = create<SideBarStore>((set,get)=>({
    isOpen: false,
    isLoaing: false,
    type: '',
    toggleSidebar: () => set({ isOpen: !get().isOpen }),
    toggleType: (type: string) => set({ type , isOpen: true}),
}))