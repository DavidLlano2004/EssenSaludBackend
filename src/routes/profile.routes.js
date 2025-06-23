import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {
  deleteUser,
  getOneProfile,
  getProfiles,
  updateProfile,
} from "../controllers/profile.controller.js";

const router = Router();

router.get("/profiles", authRequired, getProfiles);
router.get("/profile/:id", authRequired, getOneProfile);
router.put("/profile/:id", authRequired, updateProfile);
router.delete("/profile/:id", authRequired, deleteUser);

export default router;
