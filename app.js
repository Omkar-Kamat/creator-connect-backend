import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authRoutes } from "./routes/auth.routes.js";
import { assetRoutes } from "./routes/asset.routes.js";

const API_PREFIX = "/api";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
  })
);

app.use(cookieParser());

app.use(
  express.json({
    limit: "10mb"
  })
);

app.use(
  express.urlencoded({
    extended: true
  })
);

app.get(`${API_PREFIX}/health`, (req, res) => {

  res.status(200).json({
    status: "success",
    message: "Server is running"
  });

});

app.use(`${API_PREFIX}/auth`, authRoutes);

app.use(`${API_PREFIX}/assets`, assetRoutes);

export default app;