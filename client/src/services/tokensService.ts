import { ServerServices } from "./serverService";
import { ActionType } from "../redux/action-type";
import { store } from "../redux/store";



export class TokensServices {

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

  // function to gain token when refresh
  static handleStoreRefresh = async () => {

    if (!store.getState().auth.tokens.accessToken) {
      const user = store.getState().auth.user;
      await TokensServices.getTokens(user)
    }

    return store.getState().auth.tokens;
  }


}


