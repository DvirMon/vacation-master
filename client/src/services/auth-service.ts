import { ActionType } from "../redux/action-type";
import { SocketService } from "./socket-service";
import { HttpService } from "./http-service";

import { environment } from "../environments/environment"
import { store } from "../redux/store";
import { UserModel } from "../models/user-model";
import { TokensModel } from "../models/tokens.model";


export class AuthServices {

  private server: string = environment.server + "/api/tokens"
  private http: HttpService = new HttpService()
  private socketService : SocketService = new SocketService()

  // function for getting first accessToken and refreshToken
  public getTokens = async () => {
    try {
      const user: UserModel = store.getState().login.user
      const response = await this.http.postRequestAsync(this.server, user);
      store.dispatch({ type: ActionType.addRefreshToken, payload: response })
    } catch (err) {
      this.handleError(err)
    }
  };
  //end of function

  // function for new accessToken
  public getAccessToken = async () => { 
    const tokens: TokensModel = store.getState().auth.tokens 
    const response = await this.http.postRequestAsync(this.server + "/new", tokens.dbToken)
    store.dispatch({ type: ActionType.addAccessToken, payload: response })
  };

  // verify admin role, invoke socket connection, set tokens
  public handleAuth = async (callback, history) => {
    try {
      callback()
      this.socketService.invokeConnection();
      await this.getAccessToken()
    }
    catch (err) {
      this.handleError(err)
      history.push("/logout")
    }
  }
  // end of function

  private handleError = (err) => {
    err.response?.status === 401 || err.response?.status === 403
      ? console.log(err.response.data)
      : console.log(err)
  }


}
