import express from "express";
import { auth, admin } from "../middlewares/auth.js";
import {
  listPlaces,
  getPlace,
  createPlace,
  updatePlace,
  deletePlace,
} from "../controllers/placeController.js";
import { addReview, listReviews } from "../controllers/reviewController.js";

const router = express.Router();

// ===== Places =====
router.get("/", listPlaces); // danh sách địa điểm
router.get("/:placeId", getPlace); // chi tiết 1 địa điểm
router.post("/", auth, admin, createPlace); // admin tạo mới
router.put("/:placeId", auth, admin, updatePlace); // admin sửa
router.delete("/:placeId", auth, admin, deletePlace); // admin xóa

// ===== Reviews cho place =====
router.get("/:placeId/reviews", listReviews); // list reviews theo place
router.post("/:placeId/reviews", auth, addReview); // user thêm review

export default router;
