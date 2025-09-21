import User from "../models/User.js";
import jwt from "jsonwebtoken";

const sign = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES || "7d",
  });

export const register = async (req, res) => {
  const { name = "User", email, password, phone = "", address = "" } = req.body;
  name.trim();
  email.trim();

  // Regex email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Validation thủ công
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }
  if (!password || password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });
  }
  if (phone && !/^[0-9]{9,11}$/.test(phone)) {
    return res.status(400).json({ message: "Phone must be 9-11 digits" });
  }
  try {
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(409).json({ message: "Email already registered" });
    const user = await User.create({ name, email, password, phone, address });
    const token = sign(user._id, user.role);
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone,
        address,
      },
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    const match = await user.comparePassword(password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });
    const token = sign(user._id, user.role);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
      },
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
export const getMe = async (req, res) => {
  try {
    res.json({ user: req.user }); // req.user đã có sẵn từ middleware auth
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
export const updateMe = async (req, res) => {
  try {
    const userId = req.user.id; // req.user có được từ middleware auth
    const { name, email, password } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password; // nhớ hash password nếu có đổi

    await user.save();

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const logout = async (req, res) => {
  try {
    // Xoá cookie chứa JWT
    res.clearCookie("token");
    res.json({ message: "Đăng xuất thành công" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
