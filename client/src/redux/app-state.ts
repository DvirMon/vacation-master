import { UserModel } from "../models/user-model";
import { TokensModel } from "../models/tokens.model";
import { MenuModel, AdminMenu } from "../models/menu-model";
import { UserVacationModel } from "../models/vacations-model";
import { SliderModel } from "../models/slider-model";
import { handleUserRealTimeUpdate } from "../services/socketService";
import io from "socket.io-client";

export class AppState {


  public isLoggedIn: boolean
  public user: UserModel = new UserModel();
  public admin: boolean;
  public tokens: TokensModel = new TokensModel();
  public socket: any

  public menu: MenuModel = new MenuModel()
  public backgroundImage: string
  public sliderSetting: SliderModel

  public followUp: UserVacationModel[] = []
  public unFollowUp: UserVacationModel[] = []

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
    else {
      // this.socket = io.connect("http://localhost:3000")
      if (this.user.isAdmin === 0) {
        this.backgroundImage = "user"
        this.admin = false
        // handleUserRealTimeUpdate(this.socket);
      }
      else {
        this.backgroundImage = "admin"
        this.menu = AdminMenu
        this.admin = true
      }
    }
  }

} 