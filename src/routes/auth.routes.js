import express from "express";
import {
  register,
  login,
  getMe,
  updateMe,
  logout,
} from "../controllers/authController.js";
import { auth } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", auth, getMe);
router.put("/me", auth, updateMe);
router.post("/logout", logout);

export default router;
