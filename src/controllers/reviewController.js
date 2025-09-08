import Review from "../models/Review.js";
import Place from "../models/Place.js";
import mongoose from "mongoose";

async function recomputePlaceRating(placeId) {
  const stats = await Review.aggregate([
    { $match: { place: new mongoose.Types.ObjectId(placeId) } },
    { $group: { _id: "$place", avg: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);
  const avg = stats[0]?.avg || 0;
  const count = stats[0]?.count || 0;
  await Place.findByIdAndUpdate(placeId, {
    avgRating: avg,
    reviewCount: count,
  });
}

export const addReview = async (req, res) => {
  const placeId = req.params.id;
  const { rating, comment = "" } = req.body;
  try {
    const upserted = await Review.findOneAndUpdate(
      { place: placeId, user: req.user._id },
      { $set: { rating, comment } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    await recomputePlaceRating(placeId);
    res.status(201).json(upserted);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const listReviews = async (req, res) => {
  const reviews = await Review.find({ place: req.params.id }).populate(
    "user",
    "name"
  );
  res.json(reviews);
};

export const editReview = async (req, res) => {
  const review = await Review.findById(req.params.reviewId);
  if (!review) return res.status(404).json({ message: "Review not found" });
  if (
    review.user.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  )
    return res.status(403).json({ message: "Forbidden" });
  Object.assign(review, req.body);
  await review.save();
  await recomputePlaceRating(review.place);
  res.json(review);
};

export const deleteReview = async (req, res) => {
  const review = await Review.findById(req.params.reviewId);
  if (!review) return res.status(404).json({ message: "Review not found" });
  if (
    review.user.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  )
    return res.status(403).json({ message: "Forbidden" });
  await Review.findByIdAndDelete(review._id);
  await recomputePlaceRating(review.place);
  res.json({ message: "Deleted" });
};
