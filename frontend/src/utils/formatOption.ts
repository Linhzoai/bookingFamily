/* eslint-disable @typescript-eslint/no-explicit-any */

export const formatOption = (data: any) =>{
    return data?.map((item) => ({
        value: item.id,
        label: item.name
    })) || []
}