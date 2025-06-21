import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {
  createHealthyCenter,
  deleteHealthyCenter,
  getHealthyCenters,
  getOneHealthyCenter,
  updateHealthyCenter,
} from "../controllers/healthyCenter.controller.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { createHealthyCenterSchema } from "../schemas/healthyCenter.schema.js";

const router = Router();

router.get("/healthy-center", authRequired, getHealthyCenters);
router.get("/healthy-center/:id", authRequired, getOneHealthyCenter);
router.post(
  "/healthy-center",
  validateSchema(createHealthyCenterSchema),
  authRequired,
  createHealthyCenter
);
router.put("/healthy-center/:id", authRequired, updateHealthyCenter);
router.delete("/healthy-center/:id", authRequired, deleteHealthyCenter);

export default router;
