import { AppState } from "../app-state/app-state";
import { Action } from "../action/action";
import { ActionType } from "../action-type/action-type";

export const adminReducer = (oldAppState: AppState, action: Action): AppState => {

  const newAppState = { ...oldAppState }

  switch (action.type) {
    case ActionType.updatedVacation:
      newAppState.newVacation[action.payload.prop] = action.payload.input
      break
    case ActionType.deleteVacation:
      newAppState.deleteID = action.payload
      break
  }
  return newAppState
}
