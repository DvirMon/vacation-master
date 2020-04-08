import { ActionType } from "../redux/action-type";
import { store } from "../redux/store";
import { MenuModel } from "../models/menu-model";

// handle style according to role
export const handelBackground = (admin: boolean) => {
  if (admin) {
    // store.dispatch({ type: ActionType.updateBackground, payload: "" });
    return ""
  }
  // store.dispatch({ type: ActionType.updateBackground, payload: "user" });
  return "user"
};
  // end of function

  export const setStyle = (menu : MenuModel, cover : string) => {
    store.dispatch({ type: ActionType.updateMenu, payload: menu });
    store.dispatch({ type: ActionType.updateBackground, payload: cover });
  }
