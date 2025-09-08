import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./src/config/db.js";

// Import routes
import authRoutes from "./src/routes/auth.routes.js";
import userRoutes from "./src/routes/users.routes.js";
import placeRoutes from "./src/routes/places.routes.js";
import reviewRoutes from "./src/routes/reviews.routes.js";
import favoriteRoutes from "./src/routes/favorites.routes.js";

dotenv.config();
const app = express();

// ===== Middlewares =====
app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));

// ===== Routes =====
app.use("/api/auth", authRoutes); // Đăng ký, đăng nhập
app.use("/api/users", userRoutes); // Quản lý user, cập nhật profile, đổi role
app.use("/api/places", placeRoutes); // CRUD địa điểm + reviews cho place
app.use("/api/reviews", reviewRoutes); // Chỉnh sửa, xóa review riêng lẻ
app.use("/api/favorites", favoriteRoutes); // Danh sách yêu thích

// Health check endpoint
app.get("/api/health", (req, res) => res.json({ ok: true }));

// ===== Start Server =====
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () =>
    console.log(`✅ API running at http://localhost:${PORT}`)
  );
});
