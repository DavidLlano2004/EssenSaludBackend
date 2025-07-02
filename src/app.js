import express from "express";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import healthyCenterRoutes from "./routes/healthyCenter.routes.js";
import healthyPlansRoutes from "./routes/healthyPlan.routes.js";
import affiliateRoutes from "./routes/affiliates.routes.js";
import professionalRoutes from "./routes/professional.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://essensalud.netlify.app"],
    credentials: true,
  })
);

app.use(morgan("dev"));

app.use("/api/users", userRoutes);

app.use(express.json());

app.use(cookieParser());

app.use(
  "/api",
  authRoutes,
  profileRoutes,
  healthyCenterRoutes,
  healthyPlansRoutes,
  affiliateRoutes,
  professionalRoutes
);

export default app;
