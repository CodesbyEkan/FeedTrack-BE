import http from "http";
import { Server } from "socket.io";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
<<<<<<< Updated upstream
import authRoute from "./routes/auth.route.js";
import feedbackRoute from "./routes/feedback.route.js";
import qrRoutes from "./utils/generateQrcode.js";
=======
import app from "./app.js";
>>>>>>> Stashed changes

const PORT = ENV.PORT;
const server = http.createServer(app);

// app.listen(PORT, () => {
//   // connect mongodb 
//   connectDB();
//   console.log(`Server running on ${PORT}`);
// })

<<<<<<< Updated upstream

app.get("/", (req, res) => {
  res.send("Welcome to Feedback Management");
});

app.use('/api/v1/auth', authRoute);
app.use('/api/v1/feedback', feedbackRoute);
app.use('/api/v1/qr', qrRoutes);


app.listen(PORT, () => {
  // connect mongodb 
=======
server.listen(PORT, () => {
>>>>>>> Stashed changes
  connectDB();
  console.log(`Server running on ${PORT}`);
});