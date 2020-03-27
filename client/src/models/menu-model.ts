import { UserModel } from "./user-model";
import { store } from "../redux/store/store";

export class MenuModel {

  public constructor(
    public user?: UserModel,
    public isLoggedIn?: boolean,
    public register?: boolean, 
    public admin?: boolean,
    public logoutButton?: boolean,
    public followUpCounter?: number

  ) { } 

 
}

export const AdminMenu = new MenuModel({}, true, false, true, true, 0)
