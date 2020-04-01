
import { AppState } from "../app-state/app-state";
import { Action } from "../action/action";
import { ActionType } from "../action-type/action-type";

export const authReducer = (oldAppState: AppState, action: Action): AppState => {

  const newAppState = { ...oldAppState }

  switch (action.type) {
    case ActionType.Login:
      newAppState.isLoggedIn = true;
      newAppState.user = action.payload
      sessionStorage.setItem("user", JSON.stringify(action.payload));
      break
    case ActionType.addToken:
      newAppState.tokens = action.payload
      sessionStorage.setItem("tokens", JSON.stringify(action.payload));
      break
    case ActionType.refreshVacation:
      newAppState.newVacation = action.payload
      break
    case ActionType.Logout:
      newAppState.isLoggedIn = false
      newAppState.user = null
      newAppState.tokens = null
      sessionStorage.clear();
  }
  return newAppState
}
