/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient, type UseQueryOptions} from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useGetQuery = <T, Q = void>(
    key: string,
    func: (query?: Q) => Promise<T>,
    query?: Q,
    options?: Omit<UseQueryOptions<T, Error, T>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: query ? [key, query] : [key],
        queryFn: () => func(query),
        staleTime: 5 * 60 * 1000,
        ...options
    });
};

export const useGenericMutation = <TVariables, TData = any>( key: string, func: (args: TVariables) => Promise<TData>, options?: { successMsg?: string; errorMsg?: string; onSuccess?: (data: TData) => void; } ) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: func,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [key] });
            if (options?.successMsg) toast.success(options.successMsg);
            if (options?.onSuccess) options.onSuccess(data);
        },
        onError: (error: any) => {
            const msg = error?.response?.data?.message || options?.errorMsg || "Thao tác thất bại";
            toast.error(msg);
            console.error(error);
        }
    });
}


export const useCreateQuery = <T>(key: string, func: (data: T) => Promise<T>, label = "dữ liệu") => {
    return useGenericMutation<T>(key, func, {
        successMsg: `Thêm ${label} thành công`,
        errorMsg: `Thêm ${label} thất bại`
    });
};

export const useUpdateQuery = <T, P>(key: string, func: (id: P, data: T) => Promise<any>, label = "dữ liệu") => {
    return useGenericMutation<{ id: P; data: T }>(key, ({ id, data }) => func(id, data), {
        successMsg: `Cập nhật ${label} thành công`,
        errorMsg: `Cập nhật ${label} thất bại`
    });
};

export const useDeleteQuery = <T, P>(key:string, func: (id: P)=>Promise<T>, label = "dữ liệu") => {
    return useGenericMutation<P>(key, (id:P) => func(id), {
        successMsg: `Xóa ${label} thành công`,
        errorMsg: `Xóa ${label} thất bại`
    })
}
