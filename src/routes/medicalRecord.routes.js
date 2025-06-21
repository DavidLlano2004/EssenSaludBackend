import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {
  createMedicalRecord,
  deleteMedicalAppointment,
  getFrequentDiagnoses,
  getMedicalRecord,
  getOneMedicalRecord,
  updateMedicalRecord,
} from "../controllers/medicalRecord.controllers.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { createMedicalRecordSchema } from "../schemas/medicalRecord.schema.js";

const router = Router();

router.get("/medical-record", authRequired, getMedicalRecord);
router.get("/medical-record/:id", authRequired, getOneMedicalRecord);
router.post(
  "/medical-record",
  validateSchema(createMedicalRecordSchema),
  authRequired,
  createMedicalRecord
);
router.put("/medical-record/:id", authRequired, updateMedicalRecord);
router.delete("/medical-record/:id", authRequired, deleteMedicalAppointment);
router.get(
  "/medical-record/diagnoses/frequent",
  authRequired,
  getFrequentDiagnoses
);

export default router;
