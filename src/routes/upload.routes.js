import { Router } from "express";
import multer from "multer";
import { uploadImage } from "../controllers/upload.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();
const upload = multer({ dest: "tmp/" });

router.post("/", requireAuth, upload.single("image"), uploadImage);

export default router;
