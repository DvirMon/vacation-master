import { UserAppState, FollowUpAppState, UnFollowUpAppState } from "../app-state/app-state";
import { UserAction, VacationAction } from "../actions/action";
import { UserActionType, VacationActionType } from "../action-type/action-type";
import { combineReducers } from "redux";



export const userReducer = (oldState: UserAppState, action: UserAction): UserAppState => {

  const newState = { ...oldState }

  switch (action.type) {

    case UserActionType.addUser:
      newState.users.push(action.payloud)
      break
    case UserActionType.deleteUser:
      const indexToDelete = newState.users.findIndex(item => item.userID === action.payloud)
      newState.users.splice(indexToDelete, 1)
      break
  }
  return newState

}
export const followUpReducer = (oldState: FollowUpAppState, action: VacationAction): FollowUpAppState => {

  const newState = { ...oldState }

  switch (action.type) {

    case VacationActionType.getAllVacations:
      newState.followUp = action.payloud
      break
    case VacationActionType.addVacation:
      newState.followUp.push(action.payloud)
      break
    case VacationActionType.deleteVacations:
      const indexToDelete = newState.followUp.findIndex(item => item.vacationID === action.payloud)
      newState.followUp.splice(indexToDelete, 1)
      break
  }
  return newState

}

export const unFollowUpReducer = (oldState: UnFollowUpAppState, action: VacationAction): UnFollowUpAppState => {

  const newState = { ...oldState }

  switch (action.type) {

    case VacationActionType.getAllVacations:
      newState.unFollowUp = action.payloud
      break
    case VacationActionType.addVacation:
      newState.unFollowUp.push(action.payloud)
      break
    case VacationActionType.deleteVacations:
      const indexToDelete = newState.unFollowUp.findIndex(item => item.followUpID === action.payloud)
      newState.unFollowUp.splice(indexToDelete, 1)
      break
  }
  return newState

}