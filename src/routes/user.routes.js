import { Router } from "express";
import { createUser } from "../controllers/users.controller.js";

const router = Router();


console.log("user.routes.js cargado");
router.post("/", createUser);

export default router;