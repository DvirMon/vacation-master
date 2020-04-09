
import { AuthAppState } from "../app-state";
import { Action } from "../action";
import { ActionType } from "../action-type";

export const authReducer = (oldAppState = new AuthAppState(), action: Action): AuthAppState => {

  const newAppState = { ...oldAppState }

  switch (action.type) {

    case ActionType.addToken:
      newAppState.tokens = action.payload
      sessionStorage.setItem("jwt", JSON.stringify(action.payload.dbToken.refreshToken));
      break
    case ActionType.updateSocket:
      newAppState.socket = action.payload
      break
    case ActionType.Logout:
      newAppState.tokens = null
      sessionStorage.clear();
  }
  return newAppState
}
