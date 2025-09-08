import User from "../models/User.js";

export const getMe = (req, res) => {
  res.json(req.user);
};

export const updateMe = async (req, res) => {
  const { name, phone, address } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(address && { address }),
      },
    },
    { new: true }
  ).select("-password");
  res.json(user);
};

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
