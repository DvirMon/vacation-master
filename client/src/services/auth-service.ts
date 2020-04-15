import { invokeConnection } from "./socket-service";
import { ValidationService } from "./validation-service";
import { ServerServices } from "./server-service";

import { store } from "../redux/store";

export class AuthServices {

  // function for getting first accessToken and refreshToken
  static getTokens = async () => {

    const user = store.getState().login.user
    const url = `http://localhost:3000/api/tokens`;
    try {
      const response = await ServerServices.postRequestAsync(url, user);
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
      const response = await ServerServices.postRequestTokens(url)
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


