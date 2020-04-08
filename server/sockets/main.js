const path = require("path");
const followUpLogic = require("../bll/followup-logic")

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

    socket.on("admin-add-vacation", (vacation) => {
      socketServer.sockets.emit("server-add-vacation", vacation)
    })  

    socket.on("admin-update-vacation", (vacation) => {
      socketServer.sockets.emit("server-update-vacation", vacation)
    })  

    socket.on("admin-delete-vacation", (vacationID) => {
      socketServer.sockets.emit("server-delete-vacation", vacationID)
    }) 
        

    socket.on("user-update-chart", async dataPoints => {
      dataPoints = await followUpLogic.getAllFollowUp();
      socketServer.sockets.emit("server-update-chart", dataPoints)
    })   
 
     
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
