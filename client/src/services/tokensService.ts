import { postRequest, getData } from "./serverService";
import { ActionType } from "../redux/action-type/action-type";
import { store } from "../redux/store/store";

// function for getting first accessToken and refreshToken
export const getTokens = async user => {
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
export const getAccessToken = async storageTokens => {

  const dbToken = storageTokens.dbToken
  const accessToken = storageTokens.accessToken

  try {
    const url = `http://localhost:3000/api/tokens/new`;
    const newAccessToken = await postRequest(url, dbToken, accessToken)

    const tokens = store.getState().tokens
    tokens.accessToken = newAccessToken
    store.dispatch({ type: ActionType.addToken, payload: tokens })
  } catch (err) {
    console.log(err);
  }
};



