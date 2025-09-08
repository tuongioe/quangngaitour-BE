import express from "express";
import { auth, admin } from "../middlewares/auth.js";
import {
  getMe,
  updateMe,
  updateUserRole,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/me", auth, getMe);
router.put("/me", auth, updateMe);
router.put("/:id/role", auth, admin, updateUserRole);

export default router;
