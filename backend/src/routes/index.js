import setupSwagger from "../config/swagger.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import authRoute from "../modules/auth/auth.route.js";
import staffRoute from "../modules/staff/staff.route.js";
import areaRoute from "../modules/areas/area.route.js";
import categoryRoute from "../modules/services/categories/category.route.js";
import serviceRoute from "../modules/services/service.route.js";
import bookingRoute from "../modules/bookings/booking.route.js";
import assignmentRoute from "../modules/assignments/assignment.route.js";
import customerRoute from "../modules/customers/customer.route.js";
import progressRoute from "../modules/progress/progres.route.js";
import reportRoute from "../modules/Report/Report.route.js";
const router = (app) => {
  app.head("/", (req, res) => res.status(200).send("OK"));
  app.get("/", (req, res) =>
    res.status(200).json({ status: "Server đang hoạt động mượt mà!" }),
  );
  setupSwagger(app);
  app.use("/api/v1/auth", authRoute);
  app.use("/api/v1/categories", categoryRoute);
  app.use("/api/v1/services", serviceRoute);
  app.use("/api/v1/areas", areaRoute);
  app.use(authMiddleware);
  app.use("/api/v1/report", reportRoute);
  app.use("/api/v1/staff", staffRoute);
  app.use("/api/v1/bookings", bookingRoute);
  app.use("/api/v1/assignments", assignmentRoute);
  app.use("/api/v1/customers", customerRoute);
  app.use("/api/v1/progress", progressRoute);
};

export default router;
