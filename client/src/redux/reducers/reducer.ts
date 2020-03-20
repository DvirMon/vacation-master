import { AppState } from "../app-state/app-state";
import { Action } from "../action/action";
import { ActionType } from "../action-type/action-type";

export const rootReducer = (oldState: AppState, action: Action): AppState => {

  const newState = { ...oldState }

  switch (action.type) {
    case ActionType.addUser:
      newState.user = action.payloud
      break
    case ActionType.addToken:
      newState.tokens = action.payloud
      break
    case ActionType.updateField:
      newState[action.payloud.prop] = action.payloud.input
      break
    case ActionType.getAllVacations:
      newState.followUp = action.payloud
      break
    case ActionType.getAllVacations:
      newState.unFollowUp = action.payloud
      break
    case ActionType.addVacation:
      // only with user ?
      newState.followUp.push(action.payloud)
      const indexToDelete = newState.unFollowUp.findIndex(item => item.followUpID === action.payloud)
      newState.unFollowUp.splice(indexToDelete, 1)
      break
    case ActionType.deleteVacations:
      const followUpDelete = newState.followUp.findIndex(item => item.vacationID === action.payloud)
      newState.followUp.splice(followUpDelete, 1)
      newState.unFollowUp.push(action.payloud)
      break
  }
  return newState
}
