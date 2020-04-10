
import { LoginAppState } from "../app-state/login-state";
import { Action } from "../action";
import { ActionType } from "../action-type";

export const loginReducer = (oldAppState = new LoginAppState(), action: Action): LoginAppState => {

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
      case ActionType.Logout:
        newAppState.isLoggedIn = false
        newAppState.user = null
        sessionStorage.clear();
        break
    }
  return newAppState
}
