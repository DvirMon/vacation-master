import { ActionType } from "../redux/action-type";
import { SocketService } from "./socket-service";
import { HttpService } from "./http-service";

import { environment } from "../environments/environment"
import { TokensModel } from "../models/tokens.model";

import { store } from "../redux/store";
import { AxiosError } from "axios";

export class AuthServices {

  private tokenUrl: string = environment.server + "/api/tokens"
  private http: HttpService = new HttpService()
  private socketService: SocketService = new SocketService()

  // function for getting first accessToken and refreshToken
  public getTokens = async (): Promise<void> => {
    const response = await this.http.getRequestAsync(this.tokenUrl);
    store.dispatch({ type: ActionType.addRefreshToken, payload: response })
  };
  //end of function

  // function for new accessToken
  public getAccessToken = async (): Promise<void> => {
    const tokens: TokensModel = store.getState().auth.tokens
    const response = await this.http.postRequestAsync(this.tokenUrl + "/new", tokens.dbToken)
    store.dispatch({ type: ActionType.addAccessToken, payload: response })
  };

  // verify admin role, invoke socket connection, set tokens
  public handleAuth = async (callback, history): Promise<void> => {
    callback()
    this.socketService.invokeConnection();
    await this.getAccessToken()
  }
  // end of function


  public logout = async (history): Promise<void> => {

    const tokens = store.getState().auth.tokens;
    const id = tokens.dbToken?.id;

    if (id) {
      await this.http.deleteRequestAsync(this.tokenUrl + `/${id}`);
    }

    // handle logic in store
    store.dispatch({ type: ActionType.Logout });

    // disconnect from sockets
    store.getState().auth.socket.disconnect();

    // redirect to login page
    history.push("/login");
  }

  private handleError = (err: AxiosError): void => {
    err.response?.status === 401 || err.response?.status === 403
      ? console.log(err.response.data)
      : console.log(err)
  }


}
