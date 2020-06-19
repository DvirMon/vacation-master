// connect to env file and config

require("dotenv").config();
global.config = require("./config");

// import modules
const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const io = require("socket.io");
const morgan = require("morgan")

const PORT = process.env.PORT || 3000

// invoke server
const server = express();
const serverListener = server.listen(PORT, () =>
  console.log(`server running!`)
);
const socketServer = io(serverListener);

// import controller
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
server.use(express.static(socketService.findHtmlFile()));

// server.use(morgan("common"))

// middleware for controllers
server.use("/api/user", usersController);
server.use("/api/tokens", tokensController);
server.use("/api/vacations", vacationsController);
server.use("/api/followup", followupController);

// middleware for errors
server.use(errorHandler);

// use static files in production
if (process.env.NODE_ENV === "production") {
  
  server.use(express.static("public/client"));

  server.get("*", (request, response) => {
    response.sendFile(path.join(__dirname, "public/client", "index.html"));
  });
}


// create upload directory
imageService.createUploadDir();

// invoke function to handle all sockets events
socketService.handleSockets(socketServer);
