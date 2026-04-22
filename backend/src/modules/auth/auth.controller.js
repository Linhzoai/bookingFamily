import catchAsync from "../../utils/catch.async.js";
import authService from "./auth.service.js";
import { successResponse } from "../../utils/response.handle.js";
import env from "../../config/env.js";

const REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60 * 1000;
const isProduction = env.mode === "production";
class AuthControlle {
    //[POST] /api/v1/auth/sign-up - đăng kí tài khoản
    signUp = catchAsync(async (req, res) => {
        const data = req.body;
        if(req.file){
            data.avatarUrl = req.file.path;
        }
        const result = await authService.signUp(data);
        return successResponse(res, { data: result, message: "Đăng ký thành công" });
    })

    //[POST] /api/v1/auth/sign-in - đăng nhập tài khoản
    signIn = catchAsync(async (req, res) => {
        const data = req.body;
        const result = await authService.signIn(data);
        res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            maxAge: REFRESH_TOKEN_TTL
        });
        return successResponse(res, { data: { accessToken: result.accessToken, user: result.user }, message: "Đăng nhập thành công" });
    })

    //[POST] /api/v1/auth/sign-out - đăng xuất tài khoản
    signOut = catchAsync(async (req, res) => {
        const refreshToken = req.cookies.refreshToken;
        const result = await authService.signOut(refreshToken);
        return successResponse(res, { data: result, message: "Đăng xuất thành công" });
    })

    //[POST] /api/v1/auth/refresh-token - làm mới token
    refreshToken = catchAsync(async (req, res) => {
        const refreshToken = req.cookies.refreshToken;  
        const token = await authService.refreshToken(refreshToken);
        res.cookie("refreshToken", token.refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            maxAge: REFRESH_TOKEN_TTL
        });
        return successResponse(res, { data: { accessToken: token.accessToken}, message: "Làm mới token thành công" });
    })

    //[GET] /api/v1/auth/:id - lấy thông tin người dùng
    fetchUserById = catchAsync(async (req, res) => {
        const id = req.params.id;
        const user = await authService.fetchUserById(id);
        return successResponse(res, { data: user, message: "Lấy thông tin người dùng thành công" });
    })

    //[PUT] /api/v1/auth/:id/update - cập nhật thông tin người dùng
    updateUserById = catchAsync(async (req, res) => {
        const id = req.params.id;
        const data = req.body;
        if(req.file){
            data.avatarUrl = req.file.path;
        }
        const user = await authService.updateUserById(id, data);
        return successResponse(res, { data: user, message: "Cập nhật thông tin người dùng thành công" });
    })

    //PATCH /api/v1/auth/:id/status - cập nhật trạng thái tài khoản
    updateStatus = catchAsync(async (req, res) =>{
        const id = req.params.id;
        const status = req.body.status;
        const user = await authService.updateStatus(id, status);
        return successResponse(res, { data: user, message: "Cập nhật trạng thái tài khoản thành công" });
    })

    //[GET] /api/v1/auth/me - lấy thông tin người dùng
    fetchMe = catchAsync(async (req, res) => {
        const id = req.user.id;
        const user = await authService.fetchUserById(id);
        return successResponse(res, { data: user, message: "Lấy thông tin người dùng thành công" });
    })
}

export default new AuthControlle()