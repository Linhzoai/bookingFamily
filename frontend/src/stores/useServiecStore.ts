import { create } from 'zustand';
import type { ServiceStore } from '@/types/store';
import { serviceService } from '@/services/serviceService';
import type { Service } from '@/types/booking';
import { toast } from 'react-toastify';
import { persist } from 'zustand/middleware';

export const useServiceStore = create<ServiceStore>()(
    persist((set, get) => {
        return {
            loading: false,
            services: [],
            getAllServices: async () => {
                set({ loading: true });
                try {
                    const response = await serviceService.getAllServices();
                    set({ services: response });
                } catch (error) {
                    console.log(error);
                    toast.error('Lấy danh sách dịch vụ thất bại');
                } finally {
                    set({ loading: false });
                }
            },
            createService: async (data: Service) => {
                set({ loading: true });
                try {
                    const response = await serviceService.createService(data);
                    set({ services: [...get().services, response] });
                    toast.success('Thêm dịch vụ thành công');
                } catch (error: unknown) {
                    console.log(error);
                    toast.error('Thêm dịch vụ thất bại');
                } finally {
                    set({ loading: false });
                }
            },
            updateService: async (id: string, data: Service) => {
                set({ loading: true });
                try {
                    const response = await serviceService.updateService(id, data);
                    set({ services: get().services.map((service) => (service.id === id ? response : service)) });
                    toast.success('Cập nhật dịch vụ thành công');
                } catch (error: unknown) {
                    console.log(error);
                    toast.error('Cập nhật dịch vụ thất bại');
                } finally {
                    set({ loading: false });
                }
            },
            deleteService: async (id: string) => {
                set({ loading: true });
                try {
                    await serviceService.deleteService(id);
                    set({ services: get().services.filter((service) => service.id !== id) });
                    toast.success('Xóa dịch vụ thành công');
                } catch (error: unknown) {
                    console.log(error);
                    toast.error('Xóa dịch vụ thất bại');
                } finally {
                    set({ loading: false });
                }
            },
            clearState: () => {
                set({ services: [] });
            }
        };
    }, {
        name: 'service',
        partialize: (state) => ({ services: state.services })
    })
);
