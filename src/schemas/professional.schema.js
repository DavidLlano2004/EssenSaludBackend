import { z } from "zod";

export const createProfessionalSchema = z.object({
  userId: z.string({ requerid_error: "User ID is required" }),
  specialty: z.string({
    requerid_error: "Specialty is required",
  }),
  license_number: z.string({ requerid_error: "License number is required" }),
  centerId: z.string({ requerid_error: "Center ID is required" }),
});
