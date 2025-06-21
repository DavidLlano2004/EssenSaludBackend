import { z } from "zod";

export const createHealthyPlanSchema = z.object({
  name: z.string({ requerid_error: "Name is required" }),
  description: z.string({ requerid_error: "Description is required" }),
  month_cost: z.string({ requerid_error: "Month cost is required" }),
});