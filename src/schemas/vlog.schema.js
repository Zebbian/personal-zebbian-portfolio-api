import { z } from "zod";

export const createVlogSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  content: z.string().trim().min(1, "Content is required"),
  tags: z.array(z.string().trim()).optional().default([]),
  category: z.string().trim().optional(),
  imageUrl: z.string().trim().url().optional().or(z.literal("")),
});

export const updateVlogSchema = createVlogSchema.partial();
