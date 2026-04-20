import { create } from "zustand";
import type { SideBarStore } from "@/types/store";
export const useSideBarStore = create<SideBarStore>((set,get)=>({
    isOpen: false,
    isLoaing: false,
    type: '',
    booking: null,
    service: null,
    customer: null,
    toggleSidebar: () => set({ isOpen: !get().isOpen }),
    toggleType: (type, data= {booking: null, service: null, customer: null}) => set({ type , isOpen: true, booking: data.booking, service: data.service, customer: data.customer}),
}))