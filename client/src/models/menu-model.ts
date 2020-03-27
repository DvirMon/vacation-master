import { UserModel } from "./user-model";

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
export const UserMenu = new MenuModel({}, true, false, false, true, 0)
export const LoginMenu =  new MenuModel({}, false, false, false, false, 0)
export const RegisterMenu = new MenuModel({}, false, true, false, false, 0)
