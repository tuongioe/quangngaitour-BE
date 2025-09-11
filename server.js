import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./src/config/db.js";

// Import routes
import authRoutes from "./src/routes/auth.routes.js";
import userRoutes from "./src/routes/users.routes.js";
import placeRoutes from "./src/routes/places.routes.js";

dotenv.config();
const app = express();

// ===== Middlewares =====
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // bắt buộc nếu dùng cookie
  })
);

app.options("*", cors({ origin: "http://localhost:5173", credentials: true })); // cho preflight

app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));

// ===== Routes =====
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/places", placeRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => res.json({ ok: true }));

// ===== Error Handling =====
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal Server Error" });
});

// ===== Start Server =====
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () =>
    console.log(`✅ API running at http://localhost:${PORT}`)
  );
});
