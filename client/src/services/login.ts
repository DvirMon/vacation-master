import { getTokens } from "./tokens";
import { getRequest } from "./server";

export const login = async () => {
  // get data from LocalStorage
  try {
    const storage = localStorage.getItem("user");
    const response = JSON.parse(storage);
    const user = response;

    // send request fo tokens
    const tokens = await getTokens(user);
    const accessToken = tokens.accessToken
    const dbToken = tokens.dbToken

    const vacations = await getVacations(accessToken)

    return ({ user, accessToken, dbToken ,vacations})
  } catch (err) {
    console.log(err);
  }
};

export const getVacations = async (accessToken) => {
  const url = `http://localhost:3000/api/vacations/user`;
  try {
    const response = await getRequest(url, accessToken);
    return response
  } catch (err) {
    console.log(err);
  }
};


