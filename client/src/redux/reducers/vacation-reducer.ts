import { UserVacationModel } from "../../models/vacations-model";

import { VacationAppState } from "../app-state/vacation-state";
import { Action } from "../action";
import { ActionType } from "../action-type";

export const vacationReducer = (oldAppState = new VacationAppState(), action: Action): VacationAppState => {

  const newAppState = { ...oldAppState }


  switch (action.type) {

    case ActionType.GetAllVacation:
      newAppState.unFollowUp = action.payload.unFollowUp
      newAppState.followUp = action.payload.followUp
      break
    case ActionType.AddVacation:
      newAppState.unFollowUp.push(action.payload)
      break
    case ActionType.AddFollowUp:
      newAppState.followUp.push(action.payload)
      deleteLogic(newAppState, "unFollowUp", action.payload.vacationID)
      break
    case ActionType.DeleteFollowUp:
      newAppState.unFollowUp.push(action.payload)
      deleteLogic(newAppState, "followUp", action.payload.vacationID)
      break
    case ActionType.UpdatedVacation:
      const item = updateCondition(newAppState, "unFollowUp", action.payload)
      if (item) {
        updateLogic(item, action.payload)
      } else if (newAppState.followUp.length > 0) {
        updateLogic(updateCondition(newAppState, "followUp", action.payload), action.payload)
      }
      break
    case ActionType.DeleteVacation:
      deleteLogic(newAppState, "unFollowUp", action.payload)
      deleteLogic(newAppState, "followUp", action.payload)
      deleteLogic(newAppState, "notification", action.payload)
      break
    case ActionType.UpdateChartPoints:
      newAppState.dataPoints = action.payload
      break
    case ActionType.UpdateNotification:
      newAppState.notification.push(action.payload)
      break
    case ActionType.DeleteAllNotification:
      newAppState.notification = []
      break
    case ActionType.Logout:
      newAppState.followUp = []
      newAppState.unFollowUp = []
  }
  return newAppState
}

const updateCondition = (newAppState: VacationAppState, prop: string, vacation: UserVacationModel) => {
  const item = newAppState[prop].find(item => item.vacationID === + vacation.vacationID)
  return item
}

const updateLogic = (item, vacation, ) => {
  for (const prop in vacation) {
    if (prop in item) {
      item[prop] = vacation[prop]
    }
  }
}

const deleteLogic = (newAppState: VacationAppState, prop: string, id: number) => {
  const deleteIndex = newAppState[prop].findIndex(item => item.vacationID === id)
  newAppState[prop].splice(deleteIndex, 1)
}
