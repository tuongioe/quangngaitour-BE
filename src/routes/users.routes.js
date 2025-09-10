import express from "express";
import { auth, admin } from "../middlewares/auth.js";
import {
  getMe,
  updateMe,
  updateUserRole,
  getUserFavorites,
  addFavorite,
  removeFavorite,
} from "../controllers/userController.js";

const router = express.Router();

// Lấy thông tin & update profile của user đang đăng nhập
router.get("/me", auth, getMe);
router.put("/me", auth, updateMe);

// Quản lý favorites (gắn với userId)
router.get("/:id/favorites", auth, getUserFavorites);
router.post("/:id/favorites", auth, addFavorite);
router.delete("/:id/favorites/:placeId", auth, removeFavorite);

// Chỉ admin mới được đổi role user khác
router.put("/:id/role", auth, admin, updateUserRole);

export default router;
