// connect to env file
require("dotenv").config();

// import modules
const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const io = require("socket.io");
const http = require("http");

// invoke server
const server = express();

server.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  next();
});

const expressServer = http.createServer(server);

const origins = "http://localhost:8000";
const path = "/stomp"; // you need this if you want to connect to something other than the default socket.io path
const socketServer = io(expressServer, { origins: "*:*" });

// import logic
const followupController = require("./controllers/followup-controller");
const usersController = require("./controllers/users-controller");
const vacationsController = require("./controllers/vacation-controller");
const tokensController = require("./controllers/token-controller");

// import services
const errorHandler = require("./services/errors");
const imageService = require("./services/image");
const socketService = require("./services/socket");

// middleware functions
server.use(express.json());
server.use(cors());
server.use(fileUpload());
// middleware for connect to html file
server.use(express.static(socketService.findHtmlFile()));
// middleware for errors
server.use(errorHandler);

// middleware for controllers
server.use("/api/user", usersController);
server.use("/api/tokens", tokensController);
server.use("/api/vacations", vacationsController);
server.use("/api/followup", followupController);

// create upload directory
imageService.createUploadDir();

// listen
server.listen(3000, () => console.log("Listening To http://localhost:3000"));

// invoke connect function to handle all sockets events
// socketService.connect(socketServer);

socketServer.sockets.on("connection", (socket) => {
  console.log(
    "One client has been logged. Total clients : " +
      socketServer.engine.clientsCount
  );

  socket.on("disconnect", () => {
    console.log(
      "One client has left. Total clients : " + socketServer.engine.clientsCount
    );
  });
});
