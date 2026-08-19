import { z } from "zod";

const urlField = z.string().trim().url().optional().or(z.literal(""));

export const createProjectSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().min(1, "Description is required"),
  techStack: z.array(z.string().trim()).optional().default([]),
  githubUrl: urlField,
  liveUrl: urlField,
  imageUrl: urlField,
});

export const updateProjectSchema = createProjectSchema.partial();
