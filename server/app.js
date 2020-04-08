// connect to env file
require("dotenv").config();

// import modules
const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const io = require("socket.io");

// invoke server
const server = express(); 
const serverListener = server.listen(3000, () => console.log("Listening To http://localhost:3000"));
const socketServer = io(serverListener);
 
// import logic
const followupController = require("./controllers/followup-controller");
const usersController = require("./controllers/users-controller");
const vacationsController = require("./controllers/vacation-controller");
const tokensController = require("./controllers/token-controller");

// import services
const errorHandler = require("./services/errors");
const imageService = require("./services/image");
const socketService = require("./sockets/main");
 
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

// invoke connect function to handle all sockets events
socketService.connect(socketServer);

