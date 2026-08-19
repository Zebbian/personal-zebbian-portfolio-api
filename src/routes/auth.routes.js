import { Router } from "express";
import rateLimit from "express-rate-limit";
import { login } from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { loginSchema } from "../schemas/auth.schema.js";

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: "Too many login attempts, please try again later." },
});

router.post("/login", loginLimiter, validate(loginSchema), login);

export default router;
