import { create } from "zustand";
import type { SideBarStore } from "@/types/store";
export const useSideBarStore = create<SideBarStore>((set,get)=>({
    isOpen: false,
    isLoaing: false,
    type: '',
    booking: null,
    service: null,
    toggleSidebar: () => set({ isOpen: !get().isOpen }),
    toggleType: (type, booking= null, service= null) => set({ type , isOpen: true, booking, service}),
}))