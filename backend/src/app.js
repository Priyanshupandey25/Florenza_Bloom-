import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.routes.js";
import feedbackRoutes from "./routes/feedback.routes.js";
import productRoutes from "./routes/product.routes.js";

const app = express();

// ------------------------------------
// ES Module __dirname setup
// ------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ------------------------------------
// Middleware
// ------------------------------------

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ------------------------------------
// API Routes
// ------------------------------------

app.use("/api/auth", authRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/products", productRoutes);

// ------------------------------------
// Serve React dist
// ------------------------------------

// app.js is inside /src
// public/dist is inside /backend
const distPath = path.join(__dirname, "../public");

app.use(express.static(distPath));

// ------------------------------------
// React/Vite SPA fallback
// ------------------------------------

app.use((req, res, next) => {
  // Don't handle unknown API routes as React routes
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({
      success: false,
      message: "API route not found",
    });
  }

  res.sendFile(path.join(distPath, "index.html"));
});

// ------------------------------------
// Error Handler
// ------------------------------------

app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;