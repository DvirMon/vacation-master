import { MenuModel, AdminMenu } from "../../models/menu-model"
import { SliderModel } from "../../models/slider-model"
import { AuthAppState } from "./auth-state"
 
export class StyleAppState extends AuthAppState {
  public menu: MenuModel = new MenuModel()
  public backgroundImage: string
  public sliderSetting: SliderModel
 

  public constructor() {
    super()
 
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
    this.sliderSetting = new SliderModel(true, "slick-dots slick-thumb", false, 500, 4, 4)
  }
}
