import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { errorHandler } from "./middleware/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import projectRoutes from "./routes/projects.routes.js";
import vlogRoutes from "./routes/vlogs.routes.js";
import uploadRoutes from "./routes/upload.routes.js";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN, // your React domain
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);
app.use(morgan("dev"));
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// Versioned routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/vlogs", vlogRoutes);
app.use("/api/v1/upload", uploadRoutes);

// Error handler
app.use(errorHandler);

export default app;
