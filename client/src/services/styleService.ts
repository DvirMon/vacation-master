// admin

import { ActionType } from "../redux/action-type/action-type";
import { store } from "../redux/store/store";
import { VacationModel } from "../models/vacations-model";

export const adminStyle = (menu) => {
  store.dispatch({ type: ActionType.updateMenu, payload: menu });
  store.dispatch({ type: ActionType.updateBackground, payload: "" });
}