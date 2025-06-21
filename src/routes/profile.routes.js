import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { updateProfileSchema } from "../schemas/auth.schemas.js";
import { deleteUser, getOneProfile, getProfiles, updateProfile } from "../controllers/profile.controller.js";

const router = Router();

router.get("/profiles", authRequired , getProfiles);
router.get("/profile/:id", authRequired , getOneProfile);
router.put("/profile/:id", authRequired , validateSchema(updateProfileSchema) ,updateProfile);
router.delete("/profile/:id", authRequired , deleteUser);

export default router