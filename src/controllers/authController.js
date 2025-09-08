import User from "../models/User.js";
import jwt from "jsonwebtoken";

const sign = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES || "7d",
  });

export const register = async (req, res) => {
  const { name, email, password, phone = "", address = "" } = req.body;
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
