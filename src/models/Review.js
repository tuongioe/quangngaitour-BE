import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    place: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Place",
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, default: "" },
  },
  { timestamps: true }
);

reviewSchema.index({ place: 1, user: 1 }, { unique: true }); // one review per user per place

export default mongoose.model("Review", reviewSchema);
