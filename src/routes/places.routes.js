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

router.get("/", listPlaces);
router.get("/:id", getPlace);
router.post("/", auth, admin, createPlace);
router.put("/:id", auth, admin, updatePlace);
router.delete("/:id", auth, admin, deletePlace);

// reviews cho place
router.get("/:id/reviews", listReviews);
router.post("/:id/reviews", auth, addReview);

export default router;
