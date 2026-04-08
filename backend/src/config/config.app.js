import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import setupSwagger from "./swagger.js";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
const configApp = (app) => {
  dotenv.config({
    quiet: true,
  });
  app.set("trust proxy", 1);
  //Cấu hình cors - đặt trước helmet để preflight không bị chặn
  // const allowedOrigins = [
  //   "http://localhost:5173",
  //   "http://localhost:3000",
  //   process.env.CLIENT_URL,
  //   process.env.BASE_URL,
  // ].filter(Boolean); // loại bỏ undefined nếu chưa set

  // app.use(
  //   cors({
  //     origin: function (origin, callback) {
  //       // cho phép requests không có origin (Postman, Swagger, mobile apps...)
  //       if (!origin) return callback(null, true);
  //       if (allowedOrigins.includes(origin)) {
  //         return callback(null, true);
  //       }
  //       return callback(new Error("Not allowed by CORS"));
  //     },
  //     credentials: true, //cho phép gửi cookie
  //   }),
  // );
  app.use( cors({ origin: true, credentials: true, }), );
  //helmet secure
  //app.use(helmet());

  //rate limit
  // const globalLimiter = rateLimit({
  //   windowMs: 15 * 60 * 1000,
  //   max: 100,
  //   message: "Quá nhiều yêu cầu trong 5', hãy thử lại sau",
  //   standardHeaders: true,
  //   legacyHeaders: false,
  // });
  // app.use(globalLimiter);

  //cấu hình parser
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  //Cấu hình file tĩnh
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  app.use(express.static(path.join(__dirname, "../public"), {
    setHeaders: function (res, path, stat) {
      if (res.req.query.download) {
        res.set("Content-Disposition", "attachment");
      } else {
        res.set("Content-Disposition", "inline");
      }
    }
  }));

  //cấu hình cookie
  app.use(cookieParser());

  //Cấu hình swagger
  setupSwagger(app);
};

export default configApp;
