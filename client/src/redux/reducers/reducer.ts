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
    case ActionType.deleteUser:
      newState.user = action.payloud
      break
  }
  return newState
}
