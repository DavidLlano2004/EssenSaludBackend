import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {
  createHealthyPlan,
  deleteHealthyPlan,
  getHealthyPlans,
  getOneHealthyPlan,
  updateHealthyPlan,
} from "../controllers/healthyPlan.controller.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { createHealthyPlanSchema } from "../schemas/healthyPlan.schema.js";

const router = Router();

router.get("/healthy-plan", authRequired, getHealthyPlans);
router.get("/healthy-plan/:id", authRequired, getOneHealthyPlan);
router.post(
  "/healthy-plan",
  validateSchema(createHealthyPlanSchema),
  authRequired,
  createHealthyPlan
);
router.put("/healthy-plan/:id", authRequired, updateHealthyPlan);
router.delete("/healthy-plan/:id", authRequired, deleteHealthyPlan);

export default router;
