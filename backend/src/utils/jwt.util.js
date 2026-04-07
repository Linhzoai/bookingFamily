import jwt from "jsonwebtoken";
import env from "../config/env.js";
import crypto from "crypto";
import AppError from "./app.error.js";
import HttpStatus from "./http.status.js";
import prisma from "../config/prisma.js";

const REFRESH_TOKEN_EXPIRY_DAYS =Date.now() + 7 * 24 * 60 * 60 * 1000;

export const generateAccessToken = async (userId) => {
  const token = await jwt.sign({ userId }, env.jwt.secret, { expiresIn: env.jwt.expiresIn });
  return token;
};

export const generateRefreshToken = async (userId) => {
  //xóa token cũ nếu có
  await prisma.session.deleteMany({
    where: {userId, },
  });
  const token = crypto.randomBytes(64).toString("hex");
  const expiresAt = new Date(REFRESH_TOKEN_EXPIRY_DAYS);
  const data = { userId, token, expiresAt };
  await prisma.session.create({
    data,
  });
  return token;
};

export const verifyAccessToken = (token) => {
  return  jwt.verify(token, env.jwt.secret, (error, decodedToken) => {
    if (error) {
      throw new AppError("Token không hợp lệ", HttpStatus.UNAUTHORIZED);
    }
    return decodedToken;
  });
};

export const verifyRefreshToken = async (token) => {
  const existSession = await prisma.session.findUnique({ where: { token }, });
  if (!existSession) throw new AppError("Token không hợp lệ hoặc  đã bị thu hồi", HttpStatus.UNAUTHORIZED);
  if(existSession.expiresAt < new Date()) throw new AppError("Token đã hết hạn", HttpStatus.UNAUTHORIZED);
  const [accessToken , refreshToken] = await Promise.all([
    generateAccessToken(existSession.userId),
    generateRefreshToken(existSession.userId),
  ]);
  return { accessToken, refreshToken };
};
