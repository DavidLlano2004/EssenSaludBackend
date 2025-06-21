import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {
  createInvoice,
  deleteInvoice,
  getInvoices,
  getOneInvoice,
  getPendingInvoices,
  getTotalBillingByPlan,
  updateInvoice,
} from "../controllers/invoice.controller.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { createInvoiceShema } from "../schemas/invoice.schema.js";

const router = Router();

router.get("/invoice", authRequired, getInvoices);
router.get("/invoice/:id", authRequired, getOneInvoice);
router.post(
  "/invoice",
  validateSchema(createInvoiceShema),
  authRequired,
  createInvoice
);
router.put("/invoice/:id", authRequired, updateInvoice);
router.delete("/invoice/:id", authRequired, deleteInvoice);
router.get("/invoice/pending", authRequired, getPendingInvoices);
router.get("/invoice/billing/by-plan", authRequired, getTotalBillingByPlan);

export default router;
