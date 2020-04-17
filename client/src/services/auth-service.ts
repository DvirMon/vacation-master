import { invokeConnection } from "./socket-service";
import { ValidationService } from "./validation-service";
import { ServerServices } from "./server-service";

import { store } from "../redux/store";

export class AuthServices {

  // function for getting first accessToken and refreshToken
  static getTokens = async () => {
    try {
      const user = store.getState().login.user
      const url = `http://localhost:3000/api/tokens`;
      
      const response = await ServerServices.postRequestAsync(url, user, true);
      ServerServices.handleTokenResponse(response)
    } catch (err) {
      console.log(err);
    }
  };
  //end of function

  // function for new accessToken
  static getAccessToken = async () => {
    try {
      const url = `http://localhost:3000/api/tokens/new`;
      const tokens = JSON.parse(sessionStorage.getItem("jwt"))

      const response = await ServerServices.postRequestAsync(url, tokens, false)
      ServerServices.handleTokenResponse(response)
    } catch (err) {
      console.log(err);
    }
  };

  // verify admin role, invoke socket connection, set tokens
  static handleAuth = async (history) => {
    try {
      ValidationService.verifyAdmin(history);
      invokeConnection();
      await AuthServices.getAccessToken()
    }
    catch (err) {
      console.log(err)
    }
  }
  // end of function

}


