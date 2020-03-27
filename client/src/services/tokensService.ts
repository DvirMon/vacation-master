import { postRequest, getData } from "./serverService";
import { Action } from "../redux/action/action";
import { ActionType } from "../redux/action-type/action-type";
import { store } from "../redux/store/store";

export const getAccessToken = async refreshToken => {

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ refreshToken })
  };
  const url = `http://localhost:3000/api/tokens/new`;

  try {
    const response = await getData(url, options);
    return response
  } catch (err) {
    console.log(err);
  }
};

export const getTokens = async user => {
  const url = `http://localhost:3000/api/tokens`;
  try {
    const tokens = await postRequest(url, user);
    store.dispatch({ type: ActionType.addToken, payload: tokens });
  } catch (err) {
    console.log(err);
  }
};

export const refreshToken = async (dbToken) => {
  const accessToken = await getAccessToken(dbToken.refreshToken);
  const tokens = store.getState().tokens
  tokens.accessToken = accessToken
  store.dispatch({ type: ActionType.addToken, payload: tokens })
}


