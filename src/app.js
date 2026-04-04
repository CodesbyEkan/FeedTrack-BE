import http from "http";
import { Server } from "socket.io";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.route.js";
import feedbackRoute from "./routes/feedback.route.js";
import notificationRoute from "./routes/notification.router.js";
//import qrUtils from "./utils/generateQrcode.js";
import { errorHandler } from "./middleware/error.middleware.js";
import qrRoute from "./routes/qr.Route.js";
import { ENV } from "./config/env.js";

const app = express();



// middlewares

app.use(cors({
  origin: ["https://guestpulse.netlify.app",
            "http://127.0.0.1:8080",
            ENV.CLIENT_ORIGIN, ENV.MONGO_URI, "mongodb://127.0.0.1:27017"
  ],
  methods:["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());







    //Routes

app.get("/", (req, res) => {
  res.send("Welcome to Feedback Management");
});

app.use('/api/v1/auth', authRoute);
app.use('/api/v1/feedbacks', feedbackRoute);
app.use('/api/v1/notifications', notificationRoute);
app.use('/api/v1', qrRoute);

app.use(errorHandler);


export default app;
