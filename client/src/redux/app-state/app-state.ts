import { UserModel } from "../../models/user-model";
import { TokensModel } from "../../models/tokens.model";
import { getStorage } from "../../services/loginService";

export class AppState {
  public isLoggedIn: boolean
  public user: UserModel = new UserModel();
  public tokens: TokensModel = new TokensModel();

  // public constructor() {
  //   this.user = JSON.parse(sessionStorage.getItem("user"))
  //   this.isLoggedIn = this.user !== null;
  //   this.tokens = JSON.parse(sessionStorage.getItem("tokens"))
  // }
} 