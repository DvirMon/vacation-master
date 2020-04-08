import { UserModel } from "../models/user-model";
import { TokensModel } from "../models/tokens.model";
import { MenuModel, AdminMenu } from "../models/menu-model";
import { UserVacationModel } from "../models/vacations-model";
import { SliderModel } from "../models/slider-model";

export class AppState {

  public isLoggedIn: boolean
  public user: UserModel = new UserModel();
  public admin: boolean;
  public tokens: TokensModel = new TokensModel();
  public menu: MenuModel = new MenuModel()
  public backgroundImage: string
  public followUp: UserVacationModel[] = []
  public unFollowUp: UserVacationModel[] = []
  public socket: any
  public sliderSetting: SliderModel

  public constructor() {

    this.user = JSON.parse(sessionStorage.getItem("user"))
    this.isLoggedIn = this.user !== null;
    if (this.tokens.dbToken) {
      this.tokens.dbToken.refreshToken = JSON.parse(sessionStorage.getItem("jwt"))
    }  
    this.sliderSetting = new SliderModel(false, false, 500, 1, 1)

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