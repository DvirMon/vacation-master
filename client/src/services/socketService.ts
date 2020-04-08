import { store } from "../redux/store";
import { ActionType } from "../redux/action-type";
import io from "socket.io-client";





export const updateChart = (vacation) => {
  const socket = store.getState().auth.socket
  socket.emit("user-update-chart")

}

export const handleAdminInsert = (vacation) => {
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

// function to listen to server updates
export const handleUserRealTimeUpdate = (socket) => {

  // admin added vacation
  socket.on("server-add-vacation", vacation => {
    store.dispatch({ type: ActionType.addVacation, payload: vacation })
  })

  // admin updated vacation
  socket.on("server-update-vacation", vacation => {
    store.dispatch({ type: ActionType.updatedVacation, payload: vacation })
  })

  // admin deleted vacation
  socket.on("server-delete-vacation", vacationID => {
    store.dispatch({ type: ActionType.deleteVacation, payload: vacationID })

  })

}

// end of function

