import { SocketService } from "./socket-service";
import { HttpService } from "./http-service";

import { TokensModel } from "../models/tokens.model";


import { store } from "../redux/store";
import { ActionType } from "../redux/action-type";

import { environment } from "../environment"
import history from "../history"

export class AuthServices {

  private tokenUrl: string = environment.server + "/api/tokens"
  private http: HttpService = new HttpService()
  private socketService: SocketService = new SocketService()

  // function for getting first accessToken and refreshToken
  public getTokens = async (): Promise<void> => {
    const response = await this.http.getRequestAsync(this.tokenUrl);
    store.dispatch({ type: ActionType.AddRefreshToken, payload: response })
  };
  //end of function

  // function for new accessToken
  public getAccessToken = async (): Promise<void> => {
    const tokens: TokensModel = store.getState().auth.tokens
    const response = await this.http.postRequestAsync(this.tokenUrl + "/new", tokens.dbToken)
    store.dispatch({ type: ActionType.AddAccessToken, payload: response })
  };

  // verify admin role, invoke socket connection, set tokens
  public handleAuth = async (callback): Promise<void> => {
    callback()
    this.socketService.invokeConnection();
    await this.getAccessToken()
  }
  // end of function 


  public logout = async (): Promise<void> => {

    if (store.getState().auth.isLoggedIn === false) {
      history.push("/");
    }
    else {
 
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
      history.push("/");
    }
  }

}
