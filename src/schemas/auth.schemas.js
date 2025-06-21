import { z } from "zod";

export const registerSchema = z.object({
  name: z.string({ requerid_error: "Name is required" }),
  email: z
    .string({ requerid_error: "Email is required" })
    .email({ message: "Invalid email" }),
  password: z
    .string({ requerid_error: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" }),
  rol: z.string({ requerid_error: "Rol is required" }),
  birthday: z.string({ requerid_error: "Rol is required" }),
});

export const loginSchema = z.object({
  email: z
    .string({ requerid_error: "Username is required" })
    .email({ message: "Invalid email" }),
  password: z
    .string({ requerid_error: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" }),
});

export const updateProfileSchema = z.object({
  password: z
    .string({ requerid_error: "Password is required" })
    .min(12, { message: "Password must be at least 12 characters" }),
});
