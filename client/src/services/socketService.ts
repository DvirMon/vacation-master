import { ChartModel } from "../models/charts-model";
import { UserVacationModel } from "../models/vacations-model";
import { store } from "../redux/store";
import { ActionType } from "../redux/action-type";
import io from "socket.io-client";

export const invokeConnection = () => {

  if (!store.getState().auth.socket) {
    const socket = io.connect("http://localhost:3000");
    store.dispatch({ type: ActionType.updateSocket, payload: socket });
    vacationReaLTimeUpdate(socket);
    chartRealTimeUpdate(socket)
  }
}

// emit functions section
export const updateChart = () => {
  const socket = store.getState().auth.socket
  socket.emit("user-update-chart")
}

export const handleAdminInsert = (vacation) => {
  console.log(vacation)
  const socket = store.getState().auth.socket
  socket.emit("admin-add-vacation", vacation)
}

export const handleAdminUpdate = (vacation) => {
  const socket = store.getState().auth.socket
  socket.emit("admin-update-vacation", vacation)
}

export const handleAdminDelete = (vacationID) => {
  const socket = store.getState().auth.socket
  socket.emit("admin-delete-vacation", vacationID)
}
// end of section

// on functions section

export const vacationReaLTimeUpdate = (socket) => {

  // admin added vacation
  socket.on("server-add-vacation", (vacation: UserVacationModel) => {

    console.log(vacation)
    const msg = `New vacation added! : ${vacation.destination}`
    store.dispatch({ type: ActionType.addVacation, payload: vacation })
    store.dispatch({ type: ActionType.updateNotification, payload: { msg: msg, vacationID: vacation.vacationID } })
  })

  // admin updated vacation
  socket.on("server-update-vacation", (vacation: UserVacationModel) => {
    const msg = `Check new Updates! : ${vacation.destination}`
    store.dispatch({ type: ActionType.updatedVacation, payload: vacation })
    store.dispatch({ type: ActionType.updateNotification, payload: { msg: msg, vacationID: vacation.vacationID } })
  })

  // admin deleted vacation
  socket.on("server-delete-vacation", (vacationID: number) => {
    store.dispatch({ type: ActionType.deleteVacation, payload: vacationID })
  })

}

export const chartRealTimeUpdate = (socket) => {
  socket.on("server-update-chart", (dataPoints: ChartModel) => {
    store.dispatch({ type: ActionType.updateChartPoints, payload: dataPoints })
    console.log(5)
  })
}
// end of section


