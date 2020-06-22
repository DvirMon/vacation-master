import { store } from "../redux/store";
import { AuthServices } from "./auth-service";
import { ActionType } from "../redux/action-type";
import { HttpService } from "./http-service";

import { UserModel} from "../models/user-model"

import { environment } from "../environments/environment"

export class LoginServices {

  private userUrl: string = `${environment.server}/api/user`
  private authService: AuthServices = new AuthServices()
  private http: HttpService = new HttpService()

  // request section

  public login = async (user : UserModel, history): Promise<void> => {
    const response = await this.http.postRequestAsync(this.userUrl + "/login", user);
    this.handleSuccessResponse(response, history);
  }
 
  public register = async (user : UserModel, history): Promise<void> => {
    console.log(user)
    const response = await this.http.postRequestAsync(this.userUrl, user);
    this.handleSuccessResponse(response, history);
  }


  // enf od request section

  // function to check if user is logged
  public isUserLogged = (history): void => {
    if (store.getState().login.isLoggedIn) {
      this.handleRouting(store.getState().login.user, history);
    }
  }
  // end of function

  // function to handle login Success 
  public handleSuccessResponse = async (response, history): Promise<void> => {
    const user = response.user
    const accessToken = response.jwt
    store.dispatch({ type: ActionType.Login, payload: user });
    store.dispatch({ type: ActionType.addAccessToken, payload: accessToken });
    await this.authService.getTokens()
    this.handleRouting(user, history);
  };
  // end of function

  // function to handle rout according to role
  public handleRouting = (user : UserModel, history): void => {
    user.isAdmin === 1 ?
      history.push(`/admin`)
      : history.push(`/user/${user.uuid}`);
  };
  // end of function


  // prevent admin to navigate to users route
  public verifyAdminPath = (history): void => {
    if (history.location.pathname === "/admin") {
      return
    }
    history.push("/admin")
  }
  // end of function

  // prevent user to navigate to other users route
  public verifyUserPath = (user, history): void => {
    const uuid = history.location.pathname.substring(6)
    if (uuid === user.uuid) {
      return
    }
    history.push("/")
  }
  // end of function

  // main function for navigation control
  public verifyPath = (admin, user, history): void => {
    if (admin) {
      this.verifyAdminPath(history);
    } else {
      this.verifyUserPath(user, history);
    }
  }
  // end of function


}
