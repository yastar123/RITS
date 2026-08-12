import { z } from "zod";

const profileSchema = z.object({
  full_name: z.string().min(2).max(100),
  gender: z.enum(["Laki-laki", "Perempuan"]),
  age: z.coerce.number().int().min(1).max(120),
  height: z.coerce.number().int().min(1).max(300),
  weight: z.coerce.number().int().min(1).max(500),
  phone: z.string().min(8).max(20),
  address: z.string().min(5).max(500),
  referral_code: z.string().max(50).optional().or(z.literal("")),
  tongue_photo_url: z.string().url().max(1000).optional().or(z.literal("")),
});

export const signUpWithProfile = profileSchema;
export const signInWithEmail = z.object({ email: z.string().email(), password: z.string().min(1) });
