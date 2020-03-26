import { postRequest, getData } from "./serverService";
import { Action } from "../redux/action/action";
import { ActionType } from "../redux/action-type/action-type";
import { store } from "../redux/store/store";
import { setStorage } from "./loginService";

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
 
     // add to store
     const action: Action = {
      type: ActionType.addToken,
      payloud : tokens
    };
    store.dispatch(action);

    setStorage("tokens", tokens)

    return tokens
  } catch (err) {
    console.log(err);
  }
};

export const refreshToken = async (dbToken) => {
  const response = await getAccessToken(dbToken.refreshToken);
  return response
}

// export const refresh = setInterval(refreshToken, 600000)
