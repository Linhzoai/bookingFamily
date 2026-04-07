import fs from "fs";
import path from "path";
import env from "../config/env.js";
import { fileURLToPath } from "url";
const __filename  =  fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const deleteFile = (filePath) => {
    const fileName = filePath.replace(`${env.baseUrl}/`, '');
    const urlPath = path.join(__dirname, `../public/${fileName}`);
    if (fs.existsSync(urlPath)) {
        fs.unlinkSync(urlPath);
    }
}

export default deleteFile;