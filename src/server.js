import http from "http";
import { Server } from "socket.io";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";

import app from "./app.js";


const PORT = ENV.PORT || 5000;
const server = http.createServer(app);

// app.listen(PORT, () => {
//   // connect mongodb 
//   connectDB();
//   console.log(`Server running on ${PORT}`);
// })


// server.listen(PORT, () => {

//   connectDB();
//   console.log(`Server running on ${PORT}`);
// });

const io = new Server(server, {
  cors: {
    origin: [ ENV.CLIENT_ORIGIN || "http://127.0.0.1:3000",
      "http://localhost:3000"
    ],

    methods:["GET", "POST"],
    credentials: true,
  },
});

// Make io accessible in controllers via req.app.get("io")
app.set("io", io);

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`Socket ${socket.id} joined room: ${userId}`);
  });

  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", socket.id, reason);
  });
});

server.listen(PORT, () => {

  connectDB();
  console.log(`Server running on ${PORT}`);
});
