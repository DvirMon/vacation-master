require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const errorHandler = require("./services/errors");
const fs = require("fs");

// invoke server
const server = express();

// Import logic
const followupController = require("./controllers/followup-controller");
const usersController = require("./controllers/users-controller");
const vacationsController = require("./controllers/vacation-controller");
const tokensController = require("./controllers/token-controller");

// middleware functions
server.use(express.json());
server.use(cors());
server.use(express.static(__dirname));
server.use(fileUpload());

// middleware for controllers
server.use("/api/user", usersController);
server.use("/api/tokens", tokensController);
server.use("/api/vacations", vacationsController);
server.use("/api/followup", followupController);

// create upload directory

if (!fs.existsSync("./uploads")) {
  fs.mkdirSync("./uploads");
}

// middleware for errors
server.use(errorHandler);

server.listen(3000, () => console.log("Listening To http://localhost:3000"));


 