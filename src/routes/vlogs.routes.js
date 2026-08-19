import { Router } from "express";
import { getVlogs, createVlog, updateVlog, deleteVlog } from "../controllers/vlogs.controller.js";
import { requireAuth, requireAdmin } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createVlogSchema, updateVlogSchema } from "../schemas/vlog.schema.js";

const router = Router();

router.get("/", getVlogs);
router.post("/", requireAuth, requireAdmin, validate(createVlogSchema), createVlog);
router.put("/:id", requireAuth, requireAdmin, validate(updateVlogSchema), updateVlog);
router.delete("/:id", requireAuth, requireAdmin, deleteVlog);

export default router;
