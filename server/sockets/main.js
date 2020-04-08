const path = require("path");
const vacationsLogic = require("../bll/vacation-logic")

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

    socket.on("admin-add-vacation", async (vacation) => {
      socketServer.sockets.emit("server-add-vacation", vacation)
    })  

    socket.on("admin-update-vacation", async (vacation) => {
      socketServer.sockets.emit("server-update-vacation", vacation)
    })  

    socket.on("admin-delete-vacation", async (vacationID) => {
      socketServer.sockets.emit("server-delete-vacation", vacationID)
    }) 
        

    socket.on("user-update-chart", msg => {
      console.log("msg")
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
