import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {
  createAffiliate,
  deleteUser,
  getAffiliates,
  getOneAffiliate,
  getUpcomingAppointments,
  updateAffiliate,
} from "../controllers/affiliates.controller.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { createAffiliateSchema } from "../schemas/affiliates.schema.js";

const router = Router();

router.get("/affiliates", authRequired, getAffiliates);
router.get("/affiliate/:id", authRequired, getOneAffiliate);
router.post(
  "/affiliate",
  validateSchema(createAffiliateSchema),
  authRequired,
  createAffiliate
);
router.put("/affiliate/:id", authRequired, updateAffiliate);
router.delete("/affiliate/:id", authRequired, deleteUser);
router.get(
  "/affiliate/appointments/upcoming/:id",
  authRequired,
  getUpcomingAppointments
);

export default router;
