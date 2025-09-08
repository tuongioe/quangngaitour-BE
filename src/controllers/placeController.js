import Place from "../models/Place.js";
import Review from "../models/Review.js";

export const listPlaces = async (req, res) => {
  const { page = 1, limit = 12, q = "", category } = req.query;
  const query = {
    ...(q ? { name: { $regex: q, $options: "i" } } : {}),
    ...(category ? { category } : {}),
  };
  const [items, total] = await Promise.all([
    Place.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit)),
    Place.countDocuments(query),
  ]);
  res.json({
    items,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
  });
};

export const getPlace = async (req, res) => {
  const place = await Place.findById(req.params.id);
  if (!place) return res.status(404).json({ message: "Place not found" });
  res.json(place);
};

export const createPlace = async (req, res) => {
  const { name, category, description = "", images = [] } = req.body;
  const doc = await Place.create({
    name,
    category,
    description,
    images,
    createdBy: req.user._id,
  });
  res.status(201).json(doc);
};

export const updatePlace = async (req, res) => {
  const updated = await Place.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!updated) return res.status(404).json({ message: "Place not found" });
  res.json(updated);
};

export const deletePlace = async (req, res) => {
  const del = await Place.findByIdAndDelete(req.params.id);
  if (!del) return res.status(404).json({ message: "Place not found" });
  await Review.deleteMany({ place: del._id }); // remove related reviews
  res.json({ message: "Deleted" });
};
