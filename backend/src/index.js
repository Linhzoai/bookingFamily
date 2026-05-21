
import { app, server} from "./socket/index.js";
import configApp from "./config/config.app.js";
import router from "./routes/index.js";
import errorHandler from "./middlewares/error.middleware.js";
const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || "0.0.0.0";

//cấu hình app
configApp(app);

//cấu hình router
router(app);

//cấu hình error handler
app.use(errorHandler);

server.listen(PORT, HOST, () => {
  console.log(`Server is running on port ${PORT}`);
});
