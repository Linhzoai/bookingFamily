import prisma from "../../config/prisma.js";
import HttpStatus from "../../utils/http.status.js";
import AppError from "../../utils/app.error.js";
import { hashPassword } from "../../utils/password.util.js";
import { comparePassword } from "../../utils/password.util.js";
import deleteFile from "../../helper/delete-file.helper.js";
import { formatArea } from "../../helper/format.helper.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt.util.js";
class authService {
  //Quản lí logic đăng kí
  signUp = async (data) => {
    const existUser = await prisma.user.findUnique({
      where: { email: data.email },
    });
    //kiểm tra email có tồn tại không
    if (existUser)
      throw new AppError("Email đã tồn tại", HttpStatus.BAD_REQUEST);
    const area = await prisma.serviceArea.findUnique({
      where: { id: data.areaId },
    });
    //kiểm tra khu vực có tồn tại không
    if (!area)
      throw new AppError("Khu vực không tồn tại", HttpStatus.BAD_REQUEST);
    const hashedPassword = await hashPassword(data.password);
    const newAddress = data.address + ", " + await formatArea(data.areaId);
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        hashPassword: hashedPassword,
        role: data.role,
        phone: data.phone,
        areaId: Number(data.areaId),
        address: newAddress,
        status: "awaiting_activation",
        avatarUrl: data.avatarUrl,
        gender: data.gender,
      },
    });
    return user;
  };

  //Quản lí logic đăng nhập
  signIn = async (data) => {
    const existUser = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (!existUser)
      throw new AppError("Email không tồn tại", HttpStatus.BAD_REQUEST);
    const isPasswordValid = await comparePassword(
      data.password,
      existUser.hashPassword,
    );
    if (!isPasswordValid)
      throw new AppError("Mật khẩu không chính xác", HttpStatus.BAD_REQUEST);
    const [accessToken, refreshToken] = await Promise.all([
      generateAccessToken(existUser.id),
      generateRefreshToken(existUser.id),
    ]);
    return { user: existUser, accessToken, refreshToken };
  };

  //Quản lí logic đăng xuất
  signOut = async (refreshToken) => {
    if (!refreshToken) {
      throw new AppError("Không tìm thấy refreshToken", HttpStatus.BAD_REQUEST);
    }
    await prisma.session.delete({
      where: { token: refreshToken },
    });
    return { message: "Đăng xuất thành công" };
  };

  //Quản lí logic làm mới token
  refreshToken = async (refreshToken) => {
    if (!refreshToken) {
      throw new AppError("Không tìm thấy refreshToken", HttpStatus.FORBIDDEN);
    }
    const decodedToken = verifyRefreshToken(refreshToken);
    return decodedToken;
  };

  //Quản lí logic lấy thông tin người dùng
  fetchUserById = async (id) => {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { staffProfile: true },
    });
    if (!user)
      throw new AppError("Không tìm thấy người dùng", HttpStatus.BAD_REQUEST);
    return user;
  };

  //Quản lí logic cập nhật thông tin người dùng
  updateUserById = async (id, data) => {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (!user)
      throw new AppError("Không tìm thấy người dùng", HttpStatus.BAD_REQUEST);
    const newAddress = data.address + ", " + await formatArea(data.areaId);
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { ...data, address: newAddress },
    });
    if (data.avatarUrl && user.avatarUrl) {
      deleteFile(user.avatarUrl);
    }
    return updatedUser;
  };

  updateStatus = async (id, status) => {
    const user = await prisma.user.update({
      where: { id },
      data: { status },
    });
    return user;
  };
}

export default new authService();
