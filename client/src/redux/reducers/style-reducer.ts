import { AppState } from "../app-state/app-state";
import { Action } from "../action/action";
import { ActionType } from "../action-type/action-type";

export const styleReducer = (oldAppState: AppState, action: Action): AppState => {

  const newAppState = { ...oldAppState }

  switch (action.type) {
    case ActionType.updateMenu:
      newAppState.menu = action.payload
      break
    case ActionType.updateBackground:
      newAppState.backgroundImage = action.payload
      break
  }
  return newAppState
}
