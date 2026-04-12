import { z } from "zod";

export const registerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "university_manager", "student"]).optional(),
  graduationYear: z.number().int(),
  timeZone: z.string().min(1, "Time zone is required"),
  universityId: z.number().int().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;