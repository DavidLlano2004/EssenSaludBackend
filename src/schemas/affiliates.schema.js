import { z } from "zod";

export const createAffiliateSchema = z.object({
  userId: z.string({ requerid_error: "User id is required" }),
  document_type: z.string({ requerid_error: "Document type is required" }),
  document_number: z.string({ requerid_error: "Document number is required" }),
  birthday: z.string({ requerid_error: "Birthday is required" }),
  address: z.string({ requerid_error: "Address is required" }),
  phone: z.string({ requerid_error: "Phone is required" }),
  healthyPlanId: z.string({ requerid_error: "HealthyPlanId is required" }),
});