import { MenuModel } from "../models/menu-model";

import { store } from "../redux/store";
import { ActionType } from "../redux/action-type";

export class StyleService {
  
  public style = (menu: MenuModel, cover: string) => {
    store.dispatch({ type: ActionType.UpdateMenu, payload: menu });
    store.dispatch({ type: ActionType.UpdateBackground, payload: cover });
  }

}
