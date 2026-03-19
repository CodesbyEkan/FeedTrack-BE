import http from "http";
import { Server } from "socket.io";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.route.js";
import feedbackRoute from "./routes/feedback.route.js";
import notificationRoute from "./routes/notification.router.js";
import qrRoutes from "./utils/generateQrcode.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

app.set("io", io);

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));




io.on("connection", (socket) => {
  console.log("Connected:", socket.id);

  
  socket.on("join", (userId) => {
    socket.join(userId);
  });


  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);
  });
});




app.get("/", (req, res) => {
  res.send("Welcome to Feedback Management");
});

app.use('/api/v1/auth', authRoute);
app.use('/api/v1/feedbacks', feedbackRoute);
app.use('/api/v1/notifications', notificationRoute);
app.use('/api', qrRoutes);

app.use(errorHandler);


export default app;
