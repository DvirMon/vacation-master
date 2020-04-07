import { UserModel } from "../models/user-model";
import { TokensModel } from "../models/tokens.model";
import { MenuModel, AdminMenu } from "../models/menu-model";
import { UserVacationModel } from "../models/vacations-model";

export class AppState {

  public isLoggedIn: boolean
  public user: UserModel = new UserModel();
  public admin: boolean;
  public tokens: TokensModel = new TokensModel();
  public menu: MenuModel = new MenuModel()
  public backgroundImage: string
  public followUp: UserVacationModel[] = []
  public unFollowUp: UserVacationModel[] = []

  public constructor() {

     this.user = JSON.parse(sessionStorage.getItem("user"))
    this.isLoggedIn = this.user !== null;
    if (this.tokens.dbToken) {
      this.tokens.dbToken.refreshToken = JSON.parse(sessionStorage.getItem("jwt"))
    }

    if (this.isLoggedIn === false) {
      this.backgroundImage = "home"
    }
    else if (this.user.isAdmin === 0) {
      this.backgroundImage = "user"
      this.admin = false
    }
    else if (this.user.isAdmin === 1) {
      this.backgroundImage = "admin"
      this.menu = AdminMenu
      this.admin = true
    }
  }

} 