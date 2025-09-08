import express from "express";
import { auth } from "../middlewares/auth.js";
import Place from "../models/Place.js";

const router = express.Router();

// add to favorites
router.post("/:id", auth, async (req, res) => {
  const placeId = req.params.id;
  if (req.user.favorites.includes(placeId)) {
    return res.status(400).json({ message: "Already in favorites" });
  }
  req.user.favorites.push(placeId);
  await req.user.save();
  res.json({ message: "Added to favorites" });
});

// remove from favorites
router.delete("/:id", auth, async (req, res) => {
  const placeId = req.params.id;
  req.user.favorites = req.user.favorites.filter(
    (f) => f.toString() !== placeId
  );
  await req.user.save();
  res.json({ message: "Removed from favorites" });
});

// get favorites
router.get("/", auth, async (req, res) => {
  const favorites = await Place.find({ _id: { $in: req.user.favorites } });
  res.json(favorites);
});

export default router;
