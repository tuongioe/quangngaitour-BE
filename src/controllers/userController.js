import User from "../models/User.js";

// Lấy thông tin user hiện tại (đã auth)
export const getMe = (req, res) => {
  res.json(req.user);
};

// Cập nhật profile của chính mình
export const updateMe = async (req, res) => {
  try {
    const { name, phone, address, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          ...(name && { name }),
          ...(phone && { phone }),
          ...(address && { address }),
          ...(avatar && { avatar }),
        },
      },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin cập nhật role cho user khác
export const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  const updated = await User.findByIdAndUpdate(
    id,
    { role },
    { new: true }
  ).select("-password");
  if (!updated) return res.status(404).json({ message: "User not found" });
  res.json(updated);
};

// ===== Favorites =====

// Lấy danh sách favorites của 1 user
export const getUserFavorites = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).populate("favorites");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user.favorites);
};

// Thêm 1 địa điểm vào favorites
export const addFavorite = async (req, res) => {
  const { id } = req.params; // userId
  const { placeId } = req.body;

  const user = await User.findByIdAndUpdate(
    id,
    { $addToSet: { favorites: placeId } }, // addToSet tránh trùng
    { new: true }
  ).populate("favorites");

  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user.favorites);
};

// Xóa 1 địa điểm khỏi favorites
export const removeFavorite = async (req, res) => {
  const { id, placeId } = req.params;

  const user = await User.findByIdAndUpdate(
    id,
    { $pull: { favorites: placeId } },
    { new: true }
  ).populate("favorites");

  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user.favorites);
};
