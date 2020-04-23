import { ActionType } from "../redux/action-type";
import { invokeConnection } from "./socket-service";
import { ServerServices } from "./server-service";

import { store } from "../redux/store";

export class AuthServices {

  // function for getting first accessToken and refreshToken
  static getRefreshToken =   async () => {
    try {
      const user = store.getState().login.user
      const url = `http://localhost:3000/api/tokens`;
      const response = await ServerServices.postRequestAsync(url, user);
      store.dispatch({ type: ActionType.addRefreshToken, payload: response })
    } catch (err) {
      handleError(err)
    }
  };
  //end of function

  // function for new accessToken
  static getAccessToken = async () => {
    const tokens = store.getState().auth.tokens
    const url = `http://localhost:3000/api/tokens/new`;
    const response = await ServerServices.postRequestAsync(url, tokens.dbToken)
    store.dispatch({ type: ActionType.addAccessToken, payload: response })
  };

  // verify admin role, invoke socket connection, set tokens
  static handleAuth = async (callback, history) => {
    try {
      callback()
      invokeConnection();
      await AuthServices.getAccessToken()
    }
    catch (err) {
      handleError(err)
      history.push("/logout")
    }
  }
  // end of function
}


const handleError = (err) => {
  err.response?.status === 401 || err.response?.status === 403
  ? console.log(err.response.data)
  : console.log(err)
}


