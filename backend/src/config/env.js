// src/config/env.js
import dotenv from "dotenv";
import AppError from "../utils/app.error.js";
dotenv.config({ quiet: true });

const env = {
  port: process.env.PORT || 8000,
  host: process.env.HOST || "localhost",
  nodeEnv: process.env.NODE_ENV || "development",
  databaseUrl: process.env.DATABASE_URL,
  baseUrl: process.env.BASE_URL,
  databaseHost: process.env.DB_HOST,
  databaseUser: process.env.DB_USER,
  databasePassword: process.env.DB_PASSWORD || "",
  databaseName: process.env.DB_NAME,
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
