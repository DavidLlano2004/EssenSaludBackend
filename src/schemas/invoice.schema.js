import { z } from "zod";

export const createInvoiceShema = z.object({
  affiliateId: z.string({ requerid_error: "Affiliate ID is required" }),
  medicalAppointmentId: z.string({ requerid_error: "Medical appointment ID is required" }),
  cost: z.string({ requerid_error: "Cost is required" }),
  payment_status: z.string({ requerid_error: "Payment status is required" }),
});
