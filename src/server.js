import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import authRoute from "./routes/auth.route.js";
import feedbackRoute from "./routes/feedback.route.js";
import notificationRoute from "./routes/notification.route.js";

const app = express();
const PORT = ENV.PORT;

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));


app.get("/", (req, res) => {
  res.send("Welcome to Feedback Management");
});

app.use('/api/v1/auth', authRoute);
app.use('/api/v1/feedbacks', feedbackRoute);
app.use('/api/v1/notifications', notificationRoute);

app.listen(PORT, () => {
  // connect mongodb 
  connectDB();
  console.log(`Server running on ${PORT}`);
})