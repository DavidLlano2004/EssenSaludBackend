import { z } from "zod";

export const createMedicalAppointMentSchema = z.object({
  affiliateId: z.string({ requerid_error: "Affiliate ID is required" }),
  professionalId: z.string({
    requerid_error: "Professional ID is required",
  }),
  healthyCenterId: z.string({ requerid_error: "Healthy center ID is required" }),
  date: z.string({ requerid_error: "Date time is required" }),
  state: z.string({ requerid_error: "State status is required" }),
  time: z.string({ requerid_error: "State time is required" }),
});
