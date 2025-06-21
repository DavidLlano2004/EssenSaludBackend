import { z } from "zod";

export const createHealthyCenterSchema = z.object({
  name: z.string({ requerid_error: "Name is required" }),
  address: z.string({ requerid_error: "Address is required" }),
  phone: z.string({ requerid_error: "Phone is required" }),
  city: z.string({ requerid_error: "City is required" }),
});