const path = require("path");
const followUpLogic = require("../bll/followup-logic");

const findHtmlFile = () => {
  console.log(process.cwd())
  const root = process.cwd().substring(0, 65);
  console.log(root)
  const pathToHtml = path.join(root, "client", "public");
  console.log(pathToHtml)
  return pathToHtml;
};

const handleSockets = (socketServer) => {
  socketServer.sockets.on("connection", (socket) => {
    console.log(
      "One client has been logged. Total clients : " +
        socketServer.engine.clientsCount
    );

    socket.on("admin-add-vacation", (vacation) => {
      socketServer.sockets.emit("server-add-vacation", vacation);
    });
  
    socket.on("admin-update-vacation", (vacation) => {
      socketServer.sockets.emit("server-update-vacation", vacation);
    });
   
    socket.on("admin-delete-vacation", (vacation) => {
      socketServer.sockets.emit("server-delete-vacation", vacation);
    });
    socket.on("user-update-chart", async (dataPoints) => {
      dataPoints = await followUpLogic.getAllFollowUp();
      socketServer.sockets.emit("server-update-chart", dataPoints);
    });

    socket.on("disconnect", () => {
      console.log(
        "One client has left. Total clients : " +
          socketServer.engine.clientsCount
      );
    });
  }); 
}; 
 
module.exports = {
  findHtmlFile,
  handleSockets,
};
