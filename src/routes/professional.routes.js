import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {
  createProfessional,
  deleteUser,
  getOneProfessional,
  getProfessionals,
  updateProfessional,
} from "../controllers/professional.controller.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { createProfessionalSchema } from "../schemas/professional.schema.js";

const router = Router();

router.get("/professionals", authRequired, getProfessionals);
router.get("/professionals/:id", authRequired, getOneProfessional);
router.post("/professionals", validateSchema(createProfessionalSchema) ,  authRequired, createProfessional);
router.put("/professionals/:id", authRequired, updateProfessional);
router.delete("/professionals/:id", authRequired, deleteUser);

export default router;
