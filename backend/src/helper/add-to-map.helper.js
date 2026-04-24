export const addToMap = (map, key, value) =>{
    if(map.has(key)){
        const item = map.get(key);
        map.set(key, {
            totalAmount: item.totalAmount + value,
            count: item.count + 1,
        })
    }else{
        map.set(key, {totalAmount : value, count : 1})
    }
}