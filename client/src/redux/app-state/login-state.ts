import { UserModel } from "../../models/user-model";

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

 