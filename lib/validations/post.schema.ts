import { z } from "zod";

export const createPostSchema = z.object({
  imageUrl: z.string().url("Invalid image URL"),
  imagePublicId: z.string().min(1),
  caption: z.string().max(2200).optional().default(""),
  location: z.string().max(100).optional().default(""),
  tags: z.array(z.string()).optional().default([]),
});

export const createCommentSchema = z.object({
  text: z.string().min(1, "Comment cannot be empty").max(500),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
