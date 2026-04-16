import { CategoriesService } from "@/services/categoriesService.ts"
import type { Category } from "@/types/booking"
import type { CategoryStore } from "@/types/store"
import { toast } from "react-toastify"
import { create } from "zustand"
import { persist } from "zustand/middleware"

export const useCategoryStore = create<CategoryStore>()(
    persist((set, get)=>{
        return{
            loading: false,
            categories: [],
            getAllCategories: async () =>{
                set({ loading: true });
                try {
                    const categories = await CategoriesService.getAllCategories();
                    set({ categories, loading: false });
                } catch (error) {
                    set({ loading: false });
                    toast.error("Lấy danh sách danh mục thất bại");
                    throw error;
                }
            },       
            createCategory: async (data: Category) => {
                set({ loading: true });
                try {
                    const category = await CategoriesService.createCategory(data);
                    set({ categories: [...get().categories, category], loading: false });
                } catch (error) {
                    set({ loading: false });
                    toast.error("Tạo danh mục thất bại");
                    throw error;
                }
            },
            updateCategory: async (id: string, data: Category) => {
                set({ loading: true });
                try {
                    const category = await CategoriesService.updateCategory(id, data);
                    set({ categories: get().categories.map((c) => c.id === Number(id) ? category : c), loading: false });
                } catch (error) {
                    set({ loading: false });
                    toast.error("Cập nhật danh mục thất bại");
                    throw error;
                }
            },
            deleteCategory: async (id: string) => {
                set({ loading: true });
                try {
                    await CategoriesService.deleteCategory(id);
                    set({ categories: get().categories.filter((c) => c.id !== Number(id)), loading: false });
                } catch (error) {
                    set({ loading: false });
                    toast.error("Xóa danh mục thất bại");
                    throw error;
                }
            },
            clearState: () => {
                set({ categories: [] });
            }
        }
    },{
        name: 'category',
        partialize: (state)=>({categories: state.categories})
    })
)