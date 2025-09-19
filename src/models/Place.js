import mongoose from "mongoose";

const placeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["destination", "restaurant"],
      required: true,
    },
    description: { type: String, default: "" },
    address: { type: String, required: true, trim: true }, // 🆕 địa chỉ
    images: [{ type: String }], // store image URLs; switch to file upload later if needed
    avgRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Place", placeSchema);
