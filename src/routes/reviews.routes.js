import express from "express";
import { auth } from "../middlewares/auth.js";
import { editReview, deleteReview } from "../controllers/reviewController.js";

const router = express.Router();

router.put("/:reviewId", auth, editReview);
router.delete("/:reviewId", auth, deleteReview);

export default router;
