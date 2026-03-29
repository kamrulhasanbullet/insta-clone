import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Invalid email"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30)
    .regex(
      /^[a-zA-Z0-9_.]+$/,
      "Username can only contain letters, numbers, _ and .",
    ),
  fullName: z.string().min(1, "Full name is required").max(60),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const updateProfileSchema = z.object({
  fullName: z.string().min(1).max(60).optional(),
  bio: z.string().max(150).optional(),
  website: z.string().url().optional().or(z.literal("")),
  isPrivate: z.boolean().optional(),
  avatarUrl: z.string().optional(), 
  avatarPublicId: z.string().optional(), 
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
