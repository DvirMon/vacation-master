const path = require("path");

const findHtmlFile = () => {
  const root = __dirname.substring(0, 38);
  const pathToHtml = path.join(root, "client", "public");
  return pathToHtml;
};

const connect = (socketServer) => {
  socketServer.sockets.on("connection", (socket) => {
    console.log(
      "One client has been logged. Total clients : " +
        socketServer.engine.clientsCount
    );
 
    socket.on("disconnect", () => {
      console.log("One client has left. Total clients : " +
      socketServer.engine.clientsCount)
    })
  })
};

module.exports = {
  findHtmlFile,
  connect,
};
