import { postRequest, getData } from "./serverService";
import { ActionType } from "../redux/action-type/action-type";
import { store } from "../redux/store/store";

export class TokensServices {

  // function for getting first accessToken and refreshToken
static getTokens = async user => {
  const url = `http://localhost:3000/api/tokens`;
  try {
    const tokens = await postRequest(url, user);
    store.dispatch({ type: ActionType.addToken, payload: tokens });
  } catch (err) {
    console.log(err);
  }
};
//end of function

// function for new accessToken
static getAccessToken = async storageTokens => {
  
  const dbToken = storageTokens.dbToken
  const accessToken = storageTokens.accessToken

  try {
    const url = `http://localhost:3000/api/tokens/new`;
    const response = await postRequest(url, dbToken, accessToken)

    console.log(response.body)

    store.dispatch({ type: ActionType.addToken, payload: response.body })
  } catch (err) {
    console.log(err);
  }
};

}


