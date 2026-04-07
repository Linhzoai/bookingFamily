import multer from "multer"
import path from "path"
import fs from "fs"
import { fileURLToPath } from "url"
import { imageFileFilter } from "../helper/file-filter.helper.js"
import sharp from "sharp"
import env from "../config/env.js"
const __filename  =  fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const createRomStorage = (folderName)=>{
    return multer.diskStorage({
        destination: function(req, file, cb){
            const dir = path.join(__dirname, `../public/${folderName}`);
            if(!fs.existsSync(dir)){
                fs.mkdirSync(dir, {recursive: true})
            }
            cb(null, dir);
        },
        filename: function(req, file,cb){
            cb(null, `${Date.now()}-${req.user?.id || 'new'}-${file.originalname}`)
        }
    })
}
const createRamStorage = ()=>{
    return multer.memoryStorage({
        destination: function(req, file, cb){
            cb(null, null);
        },
        filename: function(req, file,cb){
            cb(null, `${Date.now()}-${req.user?.id || 'new'}-${file.originalname}`)
        }
    })
}

export const uploadImageStorage = (folderName) =>{
    return multer({
        storage: createRomStorage(folderName),
        limits: {fileSize: 1024 * 1024 * 5},
        fileFilter: imageFileFilter,
    })
}
export const uploadAvatar = multer({
    storage: createRamStorage(),
    limits: {fileSize: 1024 * 1024 * 5},
    fileFilter: imageFileFilter,
})

export const CropAndSave = (folderName) =>{
    return async (req, res, next)=>{
        if(!req.file) return next();
        try{
            const dir = path.join(__dirname, `../public/${folderName}`);
            if(!fs.existsSync(dir)){
                fs.mkdirSync(dir, {recursive: true})
            }
            const fileName = `${Date.now()}-${req.user?.id || 'new'}.png`;
            const filePath = `${env.baseUrl}/${folderName}/${fileName}`;
            await sharp(req.file.buffer)
            .resize(500, 500, {fit: sharp.fit.cover , position: 'center'})
            .png({quality: 80})
            .toFile(path.join(dir, fileName));
            req.file.path = filePath;
            req.file.filename = fileName;
            next();
        }
        catch(error){
            next(error);
        }
    }
} 