import express from "express";
import configApp from "./config/config.app.js";
import router from "./routes/index.js";
import errorHandler from "./middlewares/error.middleware.js";
const app = express();

//cấu hình app
configApp(app);

//cấu hình router
router(app);

//cấu hình error handler
app.use(errorHandler);

export default app;