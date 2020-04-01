import { UserModel } from "../models/user-model";
import { TokensModel } from "../models/tokens.model";
import { MenuModel, AdminMenu } from "../models/menu-model";
import { VacationModel, UserVacationModel } from "../models/vacations-model";
 
export class AppState { 

  public isLoggedIn: boolean
  public user: UserModel = new UserModel();
  public tokens: TokensModel = new TokensModel();
  public menu: MenuModel = new MenuModel()
  public backgroundImage: string
  public filter: boolean 
  public newVacation : VacationModel =  new VacationModel()
  public followUp : UserVacationModel[] = []
  public unFollowUp : UserVacationModel[] = []

  public constructor() {

    this.user = JSON.parse(sessionStorage.getItem("user"))
    this.isLoggedIn = this.user !== null;
    this.tokens = JSON.parse(sessionStorage.getItem("tokens"))
 
    if (this.isLoggedIn === false) {
      this.backgroundImage = "home"
    }
    else if (this.user.isAdmin === 0) {
      this.backgroundImage = "user"
    }
    else if (this.user.isAdmin === 1) {
      this.backgroundImage = "admin"
      this.menu = AdminMenu
    }
  }
} 