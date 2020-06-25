import { ChartModel } from "../models/charts-model";
import { UserVacationModel } from "../models/vacations-model";

import { store } from "../redux/store";
import { ActionType } from "../redux/action-type";

import io from "socket.io-client";

export class SocketService {


  public invokeConnection = () => {

    const validSocket = store.getState().auth.socket

    if (!validSocket || validSocket.disconnected) {

      const socket = io.connect("http://localhost:3000");

      store.dispatch({ type: ActionType.UpdateSocket, payload: socket });

      if (store.getState().auth.admin) {
        // updates for admin
        this.chartRealTimeUpdate(socket)
      } else {
        // updates for user
        this.vacationReaLTimeUpdate(socket);
      }
    }
  }

  // emit functions section
  public updateChart = () => {
    const socket = store.getState().auth.socket
    socket.emit("user-update-chart")
  }

  public handleAdminInsert = (vacation: UserVacationModel) => {
    const socket = store.getState().auth.socket
    socket.emit("admin-add-vacation", vacation)
  }

  public handleAdminUpdate = (vacation: UserVacationModel) => {
    const socket = store.getState().auth.socket
    socket.emit("admin-update-vacation", vacation)
  }

  public handleAdminDelete = (vacation: UserVacationModel) => {
    const socket = store.getState().auth.socket
    socket.emit("admin-delete-vacation", vacation)
  }
  // end of section 

  // on functions section

  public vacationReaLTimeUpdate = (socket) => {

    // admin added vacation
    socket.on("server-add-vacation", (vacation: UserVacationModel) => {

      const text = `New vacation added! : ${vacation.destination}`
      store.dispatch({ type: ActionType.AddVacation, payload: vacation })
      store.dispatch({ type: ActionType.UpdateNotification, payload: { text, vacationID: vacation.vacationID } })
    })

    // admin updated vacation
    socket.on("server-update-vacation", (vacation: UserVacationModel) => {
      const text = `Check new Updates! : ${vacation.destination}`
      store.dispatch({ type: ActionType.UpdatedVacation, payload: vacation })
      store.dispatch({ type: ActionType.UpdateNotification, payload: { text, vacationID: vacation.vacationID } })
    })

    // admin deleted vacation 
    socket.on("server-delete-vacation", (vacation) => {
      const text = `${vacation.destination} has been deleted!`
      store.dispatch({ type: ActionType.DeleteVacation, payload: vacation.vacationID })
      store.dispatch({ type: ActionType.UpdateNotification, payload: { text, vacationID: "" } })
    })
 
  }

  public chartRealTimeUpdate = (socket) => {
    socket.on("server-update-chart", (dataPoints: ChartModel) => {
      store.dispatch({ type: ActionType.UpdateChartPoints, payload: dataPoints })
    })
  }
  // end of section

}

