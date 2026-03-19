import http from "http";
import { Server } from "socket.io";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";

import app from "./app.js";


const PORT = ENV.PORT;
const server = http.createServer(app);

// app.listen(PORT, () => {
//   // connect mongodb 
//   connectDB();
//   console.log(`Server running on ${PORT}`);
// })


server.listen(PORT, () => {

  connectDB();
  console.log(`Server running on ${PORT}`);
});