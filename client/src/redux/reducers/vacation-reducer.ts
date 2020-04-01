import { AppState } from "../app-state";
import { Action } from "../action";
import { ActionType } from "../action-type";

export const vacationReducer = (oldAppState = new AppState(), action: Action): AppState => {

  const newAppState = { ...oldAppState }

  switch (action.type) {

    case ActionType.getAllVacation:
      newAppState.unFollowUp = action.payload.unFollowUp
      newAppState.followUp = action.payload.followUp
      break
    case ActionType.addVacation:
      newAppState.unFollowUp.push(action.payload)
      break
    case ActionType.addFollowUp:
      newAppState.followUp.push(action.payload)
      const unFollowUpDelete = newAppState.unFollowUp.findIndex(vacation => vacation.vacationID === action.payload.vacationID)
      newAppState.unFollowUp.splice(unFollowUpDelete, 1)

      break
    case ActionType.deleteFollowUp:
      newAppState.unFollowUp.push(action.payload)
      const followUpDelete = newAppState.followUp.findIndex(vacation => vacation.vacationID === action.payload.vacationID)
      newAppState.followUp.splice(followUpDelete, 1)
      break
    case ActionType.updatedVacation:
      console.log(+action.payload.vacationID)
      newAppState.unFollowUp.find(vacation => {
        if (vacation.vacationID === +action.payload.vacationID) {
          console.log(vacation.vacationID)
          for (const prop in action.payload) {
            if (prop in vacation) {
              vacation[prop] = action.payload[prop]
            }
          }
        }
      })
      break
    case ActionType.deleteVacation:
      const index = newAppState.unFollowUp.findIndex(vacation => vacation.vacationID === action.payload)
      newAppState.unFollowUp.splice(index, 1)
      break
    case ActionType.Logout:
      newAppState.isLoggedIn = false
      newAppState.user = null
      newAppState.tokens = null
      newAppState.followUp = []
      newAppState.unFollowUp = []
  }
  return newAppState
}
