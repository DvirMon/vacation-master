import { MenuModel } from "../models/menu-model";

import { ActionType } from "../redux/action-type";
import { store } from "../redux/store";

  export const setStyle = (menu : MenuModel, cover : string) => {
    store.dispatch({ type: ActionType.updateMenu, payload: menu });
    store.dispatch({ type: ActionType.updateBackground, payload: cover });
  }
