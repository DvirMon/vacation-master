import { UserModel } from "../models/user-model";
import { TokensModel } from "../models/tokens.model";
import { MenuModel, AdminMenu } from "../models/menu-model";
import { UserVacationModel } from "../models/vacations-model";
import { SliderModel } from "../models/slider-model";
import { ChartModel } from "../models/charts-model";


export class LoginAppState {
  public isLoggedIn: boolean
  public user: UserModel = new UserModel();
  public admin: boolean;

  public constructor() {
    this.user = JSON.parse(sessionStorage.getItem("user"))
    this.isLoggedIn = this.user !== null;
    if (this.isLoggedIn) {
      if (this.user.isAdmin === 0) {
        this.admin = false
      }
      else {
        this.admin = true
      }
    }
  }
}

export class AuthAppState  {
  public tokens: TokensModel = new TokensModel();
  public socket: any
 
  constructor() {
    if (this.tokens.dbToken) {
      this.tokens.dbToken.refreshToken = JSON.parse(sessionStorage.getItem("jwt"))
    }
  }
}

export class VacationAppState {
  public followUp: UserVacationModel[] = []
  public unFollowUp: UserVacationModel[] = []
  public dataPoints: ChartModel[] = []
}

export class StyleAppState extends LoginAppState {
  public menu: MenuModel = new MenuModel()
  public backgroundImage: string
  public sliderSetting: SliderModel

  public constructor() {
    super()

    this.sliderSetting = new SliderModel(false, false, 500, 1, 1)
    if (this.isLoggedIn === false) {
      this.backgroundImage = "home"
    }
    else {
      if (this.admin) {
        this.backgroundImage = "admin"
        this.menu = AdminMenu
      }
      else {
        this.backgroundImage = "user"
      }
    }
  }
}

// export class AppState {

//   public isLoggedIn: boolean
//   public user: UserModel = new UserModel();
//   public admin: boolean;
//   public tokens: TokensModel = new TokensModel();
//   public socket: any

//   public menu: MenuModel = new MenuModel()
//   public backgroundImage: string
//   public sliderSetting: SliderModel

//   public constructor() {

//     this.user = JSON.parse(sessionStorage.getItem("user"))
//     this.isLoggedIn = this.user !== null;


//     if (this.tokens.dbToken) {
//       this.tokens.dbToken.refreshToken = JSON.parse(sessionStorage.getItem("jwt"))
//     }
//     this.sliderSetting = new SliderModel(false, false, 500, 1, 1)


//     if (this.isLoggedIn === false) {
//       this.backgroundImage = "home"
//     }
//     else {
//       if (this.user.isAdmin === 0) {
//         this.backgroundImage = "user"
//         this.admin = false
//       }
//       else {
//         this.backgroundImage = "admin"
//         this.menu = AdminMenu
//         this.admin = true
//       }
//     }
//   }

// } 