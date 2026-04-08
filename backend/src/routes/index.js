import setupSwagger from "../config/swagger.js";
import { authMiddleware, requireRole } from "../middlewares/auth.middleware.js";
import authRoute from "../modules/auth/auth.route.js";
import staffRoute from "../modules/staff/staff.route.js";
import areaRoute from "../modules/areas/area.route.js";
import categoryRoute from "../modules/services/categories/category.route.js";
import serviceRoute from "../modules/services/service.route.js";
import bookingRoute from "../modules/bookings/booking.route.js";
const router = (app) => {
  app.head("/", (req, res) => res.status(200).send("OK"));
  app.get("/", (req, res) =>
    res.status(200).json({ status: "Server đang hoạt động mượt mà!" }),
  );
  setupSwagger(app);
  app.use("/api/v1/auth", authRoute);
  app.use(authMiddleware);
  app.use("/api/v1/staff", requireRole(["staff", "admin"]), staffRoute);
  app.use("/api/v1/areas", areaRoute);
  app.use("/api/v1/categories", categoryRoute);
  app.use("/api/v1/services", serviceRoute);
  app.use("/api/v1/bookings", bookingRoute);
};

export default router;
