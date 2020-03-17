import { getTokens } from "./tokens";
import { getRequest, postRequest } from "./server";


export const getStorage = () => {
  const storage = localStorage.getItem("user");
  const response = JSON.parse(storage);
  return response

}

export const logInRequest = async user => {
  try {
    const url = `http://localhost:3000/api/user/login`;
    const response = await postRequest(url, user);
    return response;
  } catch (err) {
    console.log(err);
  }
};


export const login = async (user) => {
  // get data from LocalStorage

  try {
    // send request fo tokens
    const tokens = await getTokens(user);
    const accessToken = tokens.accessToken
    const dbToken = tokens.dbToken

    // get vacations fo tokens
    const vacations = await getVacations(accessToken)

    return ({ user, accessToken, dbToken, vacations })
  } catch (err) {
    console.log(err);
  }
};

export const loginLegal = (user, errors) => {
  if (
    errors.userName.length > 0 ||
    errors.password.length > 0 ||
    user.userName === undefined ||
    user.password === undefined
  ) {
    return true;
  }
  return false;
};

export const handleServerResponse = response => {
  switch (typeof response) {
    case "string":
      return false
    case "object":
      localStorage.setItem("user", JSON.stringify(response));
      return true;
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


