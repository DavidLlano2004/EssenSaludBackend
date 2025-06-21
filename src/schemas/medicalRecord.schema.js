import { z } from "zod";

export const createMedicalRecordSchema = z.object({
  medicalAppointmentId: z.string({ requerid_error: "Medical appointment ID is required" }),
  symptoms: z.string({
    requerid_error: "Symptoms ID is required",
  }),
  diagnostic: z.string({ requerid_error: "Diagnostic center ID is required" }),
  treatment: z.string({ requerid_error: "Treatment is required" }),
});
