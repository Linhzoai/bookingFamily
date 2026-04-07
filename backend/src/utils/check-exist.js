import AppError from './app.error.js'
const checkRecordExist= async (module, condition, include= undefined, errorMessage="Bản ghi không tồn tại",statusCode=404) =>{
    const record = await module.findFirst({where: condition, include})
    if(!record){
        throw new AppError(errorMessage, statusCode)
    }
    return record
}
export default checkRecordExist