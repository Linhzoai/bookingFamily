import multer from "multer";
import sharp from "sharp";
import cloudinary from "../config/cloudinary.js";
import { imageFileFilter } from "../helper/file-filter.helper.js";

const createRamStorage = () => {
    return multer.memoryStorage({
        destination: function (req, file, cb) {
            cb(null, null);
        },
        filename: function (req, file, cb) {
            cb(null, `${Date.now()}-${req.user?.id || 'new'}-${file.originalname}`)
        }
    });
}

export const uploadMemory = multer({
    storage: createRamStorage(),
    limits: { fileSize: 1024 * 1024 * 5 }, 
    fileFilter: imageFileFilter,
});

const uploadBufferToCloudinary = (buffer, folderName) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: `Booking_Family/${folderName}` },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
        uploadStream.end(buffer);
    });
};

export const UploadOriginalToCloudinary = (folderName) => {
    return async (req, res, next) => {
        if (!req.file) return next();
        try {
            const result = await uploadBufferToCloudinary(req.file.buffer, folderName);
            req.file.path = result.secure_url; 
            req.file.filename = result.public_id; 
            next();
        } catch (error) {
            next(error);
        }
    }
}

export const CropAndSaveCloudinary = (folderName) => {
    return async (req, res, next) => {
        if (!req.file) return next();
        try {
            const croppedBuffer = await sharp(req.file.buffer)
                .resize(500, 500, { fit: sharp.fit.cover, position: 'center' })
                .png({ quality: 80 })
                .toBuffer(); 
            const result = await uploadBufferToCloudinary(croppedBuffer, folderName);
            req.file.path = result.secure_url;
            req.file.filename = result.public_id;
            next();
        } catch (error) {
            next(error);
        }
    }
}
