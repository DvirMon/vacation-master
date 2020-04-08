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
      const unFollowUpIndex = newAppState.unFollowUp.findIndex(vacation => vacation.vacationID === action.payload.vacationID)
      newAppState.unFollowUp.splice(unFollowUpIndex, 1)
      break
    case ActionType.deleteFollowUp:
      delete action.payload.followUpID;
      newAppState.unFollowUp.push(action.payload)
      const followUpIndex = newAppState.followUp.findIndex(vacation => vacation.vacationID === action.payload.vacationID)
      newAppState.followUp.splice(followUpIndex, 1)
      break
    case ActionType.updatedVacation:

      let find: boolean = false
      newAppState.unFollowUp.find(vacation => {
        updateLogic(vacation, action)
      })

      if (newAppState.followUp.length > 0 && find === false) {
        newAppState.followUp.find(vacation => {
          updateLogic(vacation, action)
        })
      }
      break
    case ActionType.deleteVacation:
      const index = newAppState.unFollowUp.findIndex(vacation => vacation.vacationID === action.payload)
      newAppState.unFollowUp.splice(index, 1)
      break 
 
    case ActionType.Logout:
      newAppState.followUp = []
      newAppState.unFollowUp = []
  }
  return newAppState
}

const updateLogic = (vacation, action) => {
  if (vacation.vacationID === +action.payload.vacationID) {
    for (const prop in action.payload) {
      if (prop in vacation) {
        vacation[prop] = action.payload[prop]
      }
    }
  }
}
