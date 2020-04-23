
import { Action } from "../action";
import { AuthAppState } from "../app-state/auth-state";
import { ActionType } from "../action-type";
 
export const authReducer = (oldAppState = new AuthAppState(), action: Action): AuthAppState => {

  const newAppState = { ...oldAppState }

  switch (action.type) {
 
    case ActionType.addAccessToken:
      newAppState.tokens.accessToken = action.payload
      break
    case ActionType.addRefreshToken:
      newAppState.tokens.dbToken = action.payload
      sessionStorage.setItem("jwt", JSON.stringify(action.payload));
      break
    case ActionType.updateSocket:
      newAppState.socket = action.payload
      break
    case ActionType.Logout:
      newAppState.tokens.accessToken = ""
      newAppState.tokens.dbToken = null
      sessionStorage.clear();
  }
  return newAppState
}
  