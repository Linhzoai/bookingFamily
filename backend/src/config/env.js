// src/config/env.js
import dotenv from "dotenv";
import AppError from "../utils/app.error.js";
dotenv.config({ quiet: true });

const env = {
  port: process.env.PORT || 8000,
  host: process.env.HOST || "localhost",
  databaseUrl: process.env.DATABASE_URL,
  baseUrl: process.env.BASE_URL,
  mode: process.env.MODE || "production",
  jwt: {
    secret: process.env.JWT_SECRET || "default_secret",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
  },
};

// Validate biến bắt buộc
const required = ["databaseUrl", "jwt.secret"];

for (const key of required) {
  const value = key.split(".").reduce((obj, i) => obj?.[i], env);
  if (!value) {
    throw new AppError(`Missing required environment variable: ${key}`);
  }
}

export default env;
