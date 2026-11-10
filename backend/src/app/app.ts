import express from "express";
import cookieParaser from "cookie-parser";
import cors from "cors";

import {
  auditLogModule,
  authModule,
  profileModule,
  skillsAndExperiencesModule,
  userModule,
  availabilityModule,
  channelModule,
} from "../config/inversify.config.ts";
import { errorHandler } from "./middlewares/errorHandler.ts";

const createApp = () => {
  const app = express();

  app.use(
    cors({
      origin: ["http://localhost:5173", "http://localhost:3000"],
      credentials: true,
      exposedHeaders: ["Content-Disposition"],
    }),
  );
  app.use(express.json());
  app.use(cookieParaser());
  app.use("/api/v1/auth", authModule.authRoutes);
  app.use("/api/v1/profile", profileModule.profileRoutes);
  app.use("/api/v1/skills", skillsAndExperiencesModule.skillRoutes);
  app.use("/api/v1/users", userModule.userRoutes);
  app.use("/api/v1/availability", availabilityModule.availabilityRoutes);
  app.use("/api/v1/channels", channelModule.channelRoutes);
  app.use("/api/v1/audit-logs", auditLogModule.auditLogRoutes);
  app.use(errorHandler);
  return app;
};

export default createApp;
