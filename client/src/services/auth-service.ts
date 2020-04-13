import { invokeConnection } from "./socket-service";
import { ValidationService }  from "./validation-service";
import { ServerServices } from "./server-service";

import { store } from "../redux/store";

export class AuthServices {

  // function for getting first accessToken and refreshToken
  static getTokens = async user => {
    const url = `http://localhost:3000/api/tokens`;
    try {
      const response = await ServerServices.postRequest(url, user);
      ServerServices.handleTokenResponse(response)

    } catch (err) {
      console.log(err);
    }
  };
  //end of function

  // function for new accessToken
  static getAccessToken = async () => {

    const tokens = store.getState().auth.tokens;

    try {
      const url = `http://localhost:3000/api/tokens/new`;
      const response = await ServerServices.postRequest(url, tokens.dbToken, tokens.accessToken)
      ServerServices.handleTokenResponse(response)
    } catch (err) {
      console.log(err);
    }
  };

  // function to get token after refresh
  static handleStoreRefresh = async () => {

    try {
      if (!store.getState().auth.tokens?.accessToken) {
        const user = store.getState().login.user;
        await AuthServices.getTokens(user)
      }
      return store.getState().auth.tokens;
    } catch (err) {
      console.log(err)
    }
  }

  // verify admin role && invoke socket connection 
  static adminLoginLogic = (history) => {
    ValidationService.verifyAdmin(history);
    invokeConnection();
  }
// end of function


}


