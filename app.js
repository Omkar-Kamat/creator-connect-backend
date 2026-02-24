import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authRoutes } from "./routes/auth.routes.js";
import { assetRoutes } from "./routes/asset.routes.js";
import planRoutes from "./routes/plan.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import http from "http";
import messageRoutes from "./routes/message.routes.js"
import { initializeSocket } from "./socket/socket.js";
import webhook from "./routes/webhook.routes.js"

const API_PREFIX = "/api";

const app = express();
const server = http.createServer(app);
initializeSocket(server);

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
  })
);

app.use(cookieParser());
app.use(
  `${API_PREFIX}/payment`,webhook
);
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

app.use(`${API_PREFIX}/chat`, messageRoutes);

app.use(`${API_PREFIX}/plans`, planRoutes);

app.use(`${API_PREFIX}/payment`, paymentRoutes);

export default server;