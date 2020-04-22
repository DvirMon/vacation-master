import { TokensModel } from "../../models/tokens.model";
import { LoginAppState } from "./login-state";

export class AuthAppState extends LoginAppState {
  public tokens: TokensModel = new TokensModel();
  public socket: any

  constructor() {
    super()
    if (this.isLoggedIn) {
      this.tokens.dbToken = JSON.parse(sessionStorage.getItem("jwt"))
    }
  }
}