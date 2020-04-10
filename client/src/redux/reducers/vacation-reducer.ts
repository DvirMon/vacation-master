import { VacationAppState } from "../app-state/vacation-state";
import { Action } from "../action";
import { ActionType } from "../action-type";

export const vacationReducer = (oldAppState = new VacationAppState(), action: Action): VacationAppState => {

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
      deleteLogic(newAppState, "unFollowUp", action.payload)
      break
    case ActionType.deleteFollowUp:
      delete action.payload.followUpID;
      newAppState.unFollowUp.push(action.payload)
      deleteLogic(newAppState, "followUp", action.payload)
      break
    case ActionType.updatedVacation:
      const item = updateCondition(newAppState, "unFollowUp", action.payload)
      if (item) {
        updateLogic(item, action.payload)
      } else if (newAppState.followUp.length > 0) {
        updateLogic(updateCondition(newAppState, "followUp", action.payload), action.payload)
      }
      break
    case ActionType.deleteVacation:
      deleteLogic(newAppState, "unFollowUp", action.payload)
      break
    case ActionType.updateChartPoints:
      newAppState.dataPoints = action.payload
      break
    case ActionType.updateNotification:
      newAppState.notification.push(action.payload)
      break
    case ActionType.Logout:
      newAppState.followUp = []
      newAppState.unFollowUp = []
  }
  return newAppState
}

const updateCondition = (newAppState, prop, vacation) => {
  const item = newAppState[prop].find(item => item.vacationID === + vacation.vacationID)
  return item
}

const updateLogic = (item, vacation, ) => {
  for (const prop in vacation) {
    if (prop in vacation) {
      item[prop] = vacation[prop]
    }
  }
}

const deleteLogic = (newAppState, prop, vacation) => {
  const deleteIndex = newAppState[prop].findIndex(item => item.vacationID === vacation.vacationID)
  newAppState[prop].splice(deleteIndex, 1)
}
