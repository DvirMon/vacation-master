import { UserModel } from "./user-model";
import { store } from "../redux/store/store";
import { ActionType } from "../redux/action-type/action-type";

export class MenuModel {

  public constructor(
    public user?: UserModel,
    public isLoggedIn?: boolean,
    public register?: boolean,
    public admin?: boolean,
    public logoutButton?: boolean,
    public followUpCounter?: number

  ) { }

  static setMenu = (user: UserModel, followUpCounter: number) => {

    
    const menu = { ...AdminMenu }

    if (user.isAdmin === 0) {
      menu.user = user;
      menu.admin = false;
      menu.followUpCounter = followUpCounter;
    }
    store.dispatch({ type: ActionType.updateMenu, payload: menu });
  };


}

export const AdminMenu = new MenuModel({}, true, false, true, true, 0)
export const LoginMenu = new MenuModel({}, false, false, false, false, 0)
export const RegisterMenu = new MenuModel({}, false, true, false, false, 0)
