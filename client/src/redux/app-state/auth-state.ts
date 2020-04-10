import { TokensModel } from "../../models/tokens.model";

export class AuthAppState  {
  public tokens: TokensModel = new TokensModel();
  public socket: any
 
  constructor() {
    if (this.tokens.dbToken) {
      this.tokens.dbToken.refreshToken = JSON.parse(sessionStorage.getItem("jwt"))
    }
  }
}