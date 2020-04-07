
import { AppState } from "../app-state";
import { Action } from "../action";
import { ActionType } from "../action-type";

export const authReducer = (oldAppState = new AppState(), action: Action): AppState => {

  const newAppState = { ...oldAppState }

  switch (action.type) {
    case ActionType.Login:
      newAppState.isLoggedIn = true;
      newAppState.user = action.payload
      sessionStorage.setItem("user", JSON.stringify(action.payload));
      break
    case ActionType.isAdmin: 
      (action.payload === 0) ? newAppState.admin = false : newAppState.admin = true 
      break
    case ActionType.addToken:
      newAppState.tokens = action.payload
      sessionStorage.setItem("jwt", JSON.stringify(action.payload.dbToken.refreshToken));
      break
    case ActionType.Logout:
      newAppState.isLoggedIn = false
      newAppState.user = null
      newAppState.tokens = null
      sessionStorage.clear();
  }
  return newAppState
}
