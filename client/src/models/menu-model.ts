import { UserModel } from "./user-model";
import { store } from "../redux/store"; 
  
export class MenuModel { 

  public constructor(
    public user?: UserModel,
    public isLoggedIn?: boolean,
    public register?: boolean,
    public admin?: boolean,
    public logoutButton?: boolean,
    public followUpCounter?: number,

  ) { }

  static setMenu = (admin) => {
    const menu = { ...AdminMenu }
    menu.user = store.getState().auth.user; 
    if (!admin) { 
      menu.admin = false; 
      menu.followUpCounter = store.getState().vacation.followUp.length;
    } 
    return menu
  };

} 

export const AdminMenu = new MenuModel({}, true, false, true, true, 0)
export const LoginMenu = new MenuModel({}, false, false, false, false, 0)
export const RegisterMenu = new MenuModel({}, false, true, false, false, 0)
