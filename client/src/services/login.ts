import { getTokens } from "./tokens";
import { getRequest, postRequest, deleteRequest } from "./server";
import Vacations from "../components/vacations/vacations";
import { VacationModel } from "../models/vacations-model";
import { store } from "../redux/store/store";
import { Action } from "../redux/action/action";
import { ActionType } from "../redux/action-type/action-type";


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


// export const login = async (user) => {

//   try {
//     // send request fo tokens
//     const tokens = await getTokens(user);

//     // צריך לשנות ניתןב

//     // get vacations fo tokens
//     const vacations = await getVacations(tokens.accessToken)

//     return ({ user, tokens, vacations })
//   } catch (err) {
//     console.log(err);
//   }
// };

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
    
    const action: Action = {
        type: ActionType.addUser,
        payloud: response
      }
      store.dispatch(action)
    
      localStorage.setItem("user", JSON.stringify(response));
      return true;
  }
};

export const getVacations = async (accessToken): Promise<VacationModel[]> => {
  const url = `http://localhost:3000/api/vacations/user`;
  try {
    const response = await getRequest(url, accessToken);
    return response
  } catch (err) {
    console.log(err);
  }
};

export const logOutService = async (tokens, history) => {

  try {

    // clear refreshToken from db
    const url = `http://localhost:3000/api/tokens/${tokens.dbToken.id}`;
    await deleteRequest(url);

    // clear localStorage
    localStorage.clear();

    // redirect to login page
    history.push("/login");
  }
  catch (err) {
    console.log(err)
  }
};


