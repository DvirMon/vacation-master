import { TokensModel } from "../../models/tokens.model";
import { UserModel } from "../../models/user-model";
 
export class AuthAppState {
  public isLoggedIn: boolean
  public admin: boolean;
  public user: UserModel = new UserModel();
  public tokens: TokensModel = new TokensModel();
  public socket: any

  constructor() {

    this.user = JSON.parse(sessionStorage.getItem("user"))
    this.isLoggedIn = this.user !== null;

    if (this.isLoggedIn) {

      this.tokens.dbToken = JSON.parse(sessionStorage.getItem("jwt"))

      if (this.user.isAdmin === 0) {
        this.admin = false
      }
      else {
        this.admin = true
      }
    }
  }
}