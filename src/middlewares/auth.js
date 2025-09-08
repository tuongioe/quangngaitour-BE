import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Middleware xác thực JWT
export const auth = async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = user; // attach full user
    next();
  } catch (e) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Middleware kiểm tra quyền admin
export const admin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admin only." });
  }
  next();
};
