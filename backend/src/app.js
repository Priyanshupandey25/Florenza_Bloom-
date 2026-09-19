import express from "express";
import authRoutes from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import feedbackRoutes from "./routes/feedback.routes.js";
import productRoutes from "./routes/product.routes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);

app.use("/api/feedback", feedbackRoutes);

app.use("/api/products", productRoutes);

export default app;