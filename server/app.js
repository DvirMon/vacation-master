// connect to env file and config

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
 
global.config = require("./config");

// import modules
const express = require("express");
const cors = require("cors");
const io = require("socket.io");
const path = require("path");

const PORT = process.env.PORT || 3000;

// invoke server
const server = express();
 
const serverListener = server.listen(PORT, () =>
  console.log(`server is running on port ${PORT}!`)
);
const socketServer = io(serverListener);

// import controller
const followupController = require("./controllers/followup-controller");
const authController = require("./controllers/auth-controller");
const vacationsController = require("./controllers/vacation-controller");
const tokensController = require("./controllers/token-controller");

// import services
const errorHandler = require("./services/errors");
const socketService = require("./sockets/main");

// middleware functions
server.use(express.json());
server.use(cors());
server.use(express.static(socketService.findHtmlFile()));
server.use("/uploads", express.static("uploads"));

// middleware for controllers
server.use("/api/auth", authController);
server.use("/api/tokens", tokensController); 
server.use("/api/vacations", vacationsController);
server.use("/api/followup", followupController);

// middleware for errors
server.use(errorHandler);

// use static files in production
if (process.env.NODE_ENV === "production") {
  server.use(express.static("build"));

  server.get("*", (request, response) => {
    response.sendFile(path.join(__dirname, "build", "index.html"));
  });
}

// invoke function to handle all sockets events
socketService.handleSockets(socketServer);
