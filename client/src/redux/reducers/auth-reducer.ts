
import { Action } from "../action";
import { AuthAppState } from "../app-state/auth-state";
import { ActionType } from "../action-type";

export const authReducer = (oldAppState = new AuthAppState(), action: Action): AuthAppState => {

  const newAppState = { ...oldAppState }

  switch (action.type) {
    case ActionType.Login:
      newAppState.isLoggedIn = true;
      newAppState.user = action.payload
      sessionStorage.setItem("user", JSON.stringify(action.payload));
      (action.payload.isAdmin === 0) ? newAppState.admin = false : newAppState.admin = true
      break
    case ActionType.IsAdmin:
      (action.payload === 0) ? newAppState.admin = false : newAppState.admin = true
      break
    case ActionType.AddAccessToken:
      newAppState.tokens.accessToken = action.payload
      break
    case ActionType.AddRefreshToken:
      newAppState.tokens.dbToken = action.payload
      sessionStorage.setItem("jwt", JSON.stringify(action.payload));
      break
    case ActionType.UpdateSocket:
      newAppState.socket = action.payload
      break
    case ActionType.Logout:
      newAppState.isLoggedIn = false
      newAppState.user = null
      newAppState.tokens.dbToken = null
      newAppState.tokens.accessToken = ""
      sessionStorage.clear();
  }
  return newAppState
}
