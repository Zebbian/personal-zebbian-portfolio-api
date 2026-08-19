import { Router } from "express";
import { getProjects, createProject, updateProject, deleteProject } from "../controllers/projects.controller.js";
import { requireAuth, requireAdmin } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createProjectSchema, updateProjectSchema } from "../schemas/project.schema.js";

const router = Router();

router.get("/", getProjects);
router.post("/", requireAuth, requireAdmin, validate(createProjectSchema), createProject);
router.put("/:id", requireAuth, requireAdmin, validate(updateProjectSchema), updateProject);
router.delete("/:id", requireAuth, requireAdmin, deleteProject);

export default router;
