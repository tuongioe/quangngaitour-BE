import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    place: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Place",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

favoriteSchema.index({ user: 1, place: 1 }, { unique: true });

export default mongoose.model("Favorite", favoriteSchema);
