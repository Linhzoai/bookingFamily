import { verifyAccessToken } from "../utils/jwt.util.js";
import AppError from "../utils/app.error.js";
import HttpStatus from "../utils/http.status.js";
import prisma from "../config/prisma.js";
export const authMiddleware = async (req, res, next) => {
    let token = req.headers.authorization;
    if (token && token.startsWith("Bearer ")) {
        token = token.split(" ")[1];
    }
    if (!token) {
        throw new AppError("Token không tồn tại", HttpStatus.UNAUTHORIZED);
    }
    const decodedToken = verifyAccessToken(token);
    const user = await prisma.user.findUnique({ where: { id: decodedToken.userId } });
    if (!user) {
        throw new AppError("User không tồn tại", HttpStatus.FORBIDDEN);
    }
    req.user = user;
    next();
}   

export const requireRole = (roles)=>{
    return (req, res, next) =>{
        if(!roles.includes(req.user.role)){
            throw new AppError("Bạn không có quyền truy cập", HttpStatus.FORBIDDEN);
        }
        next();
    }
}