/* eslint-disable @typescript-eslint/no-unused-vars */
import { AreaService } from "@/services/areaService";
import type { AreaStore } from "@/types/store";
import { toast } from "react-toastify";
import { create } from "zustand";

export const useAreaStore = create<AreaStore>(
    (set, get) =>({
        loading: false,
        areas: [],
        getAllAreas: async () =>{
            set({loading: true});
            try{
                const res = await AreaService.getAllAreas();
                set({areas: res});
            }
            catch(error){
                console.log(error);
                toast.error("Lấy danh sách khu vực thất bại")
            }
            finally{
                set({loading: false});
            }
        },
        createArea: async (data) =>{
            set({loading: true});
            try{
                await AreaService.createArea(data);
                const res = await AreaService.getAllAreas();
                set({areas: res});
                toast.success("Thêm khu vực thành công");
            }
            catch(error){
                console.log(error);
                toast.error("Thêm khu vực thất bại");
            }
            finally{
                set({loading: false});
            }
        },
        updateArea: async (id, data) =>{
            set({loading: true});
            try{
                await AreaService.updateArea(id, data);
                const res = await AreaService.getAllAreas();
                set({areas: res});
                toast.success("Cập nhật khu vực thành công");
            }
            catch(error){
                console.log(error);
                toast.error("Cập nhật khu vực thất bại");
            }
            finally{
                set({loading: false});
            }
        },
        deleteArea: async (id) =>{
            set({loading: true});
            try{
                await AreaService.deleteArea(id);
                const res = await AreaService.getAllAreas();
                set({areas: res});
                toast.success("Xóa khu vực thành công");
            }
            catch(error){
                console.log(error);
                toast.error("Xóa khu vực thất bại");
            }
            finally{
                set({loading: false});
            }
        },
        clearState: () =>{
            set({loading: false, areas: []});
        }
    })
)