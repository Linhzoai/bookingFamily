import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import dotenv from "dotenv";
import env from "./env.js";

dotenv.config({
  quiet: true,
});

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Dịch Vụ Giúp Việc",
      version: "1.0.0",
      description: "Tài liệu API cho hệ thống đặt lịch dịch vụ giúp việc",
    },
    servers: [
      {
        url: `${env.baseUrl}/api/v1`,
        description: "Server chính",
      },
    ],
    tags: [
      { name: "Auth", description: "Hệ thống xác thực và tài khoản" },
      { name: "Staff", description: "Nghiệp vụ quản lý nhân sự" }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "apiKey",
          in: "header",
          name: "Authorization",
          description: "Nhập token theo định dạng: Bearer <token>",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/modules/**/*.js", "./src/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

const setupSwagger = (app) => {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      operationsSorter: "method", // Sắp xếp theo thứ tự: GET, POST, PUT, DELETE...
      tagsSorter: "alpha" // Sắp xếp các danh mục (Tags) theo bảng chữ cái
    }
  }));

  // Route trả về JSON spec để Postman có thể import
  app.get("/api/docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
};

export default setupSwagger;
