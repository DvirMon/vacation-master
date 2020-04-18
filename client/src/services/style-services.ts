import { MenuModel } from "../models/menu-model";

import { store } from "../redux/store";
import { ActionType } from "../redux/action-type";

  export const setStyle = (menu : MenuModel, cover : string) => {
    store.dispatch({ type: ActionType.updateMenu, payload: menu });
    store.dispatch({ type: ActionType.updateBackground, payload: cover });
  }
