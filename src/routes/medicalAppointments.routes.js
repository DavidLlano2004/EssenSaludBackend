import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {
  createMedicalAppointMent,
  deleteMedicalAppointment,
  getMedicalAppointments,
  getOneMedicalAppointment,
  updateMedicalAppointment,
} from "../controllers/medicalAppointments.controllers.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { createMedicalAppointMentSchema } from "../schemas/medicalAppointments.schema.js";

const router = Router();

router.get("/medical-appointment", authRequired, getMedicalAppointments);
router.get("/medical-appointment/:id", authRequired, getOneMedicalAppointment);
router.post("/medical-appointment", validateSchema(createMedicalAppointMentSchema) , authRequired, createMedicalAppointMent);
router.put("/medical-appointment/:id", authRequired, updateMedicalAppointment);
router.delete(
  "/medical-appointment/:id",
  authRequired,
  deleteMedicalAppointment
);

export default router;
