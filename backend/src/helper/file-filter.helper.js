import path from "path"
export const imageFileFilter = (req, file, cb)=>{
    const allowedFileTypes = [".jpg", ".jpeg", ".png", ".gif"];
    const fileExtension = path.extname(file.originalname).toLowerCase();
    if(allowedFileTypes.includes(fileExtension)){
        cb(null, true);
    }else{
        cb(new Error("Định dạng file không hợp lệ"), false);
    }
}