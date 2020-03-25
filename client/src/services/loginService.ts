import {  postRequest, deleteRequest } from "./serverService";
import { store } from "../redux/store/store";
import { Action } from "../redux/action/action";
import { ActionType } from "../redux/action-type/action-type";
import { UserModel } from "../models/user-model";


export const getStorage = (key) => {
  const storage = localStorage.getItem(key);
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

export const loginLegal = (user, errors) => {
  if (
    user.userName === undefined ||
    user.password === undefined ||
    errors.userName.length > 0 ||
    errors.password.length > 0  
  ) {
    return true;
  }
  return false;
};

export const registrationLegal = (user, errors) => {
  if (
    user.userName === undefined ||
    user.password === undefined ||
    errors.userName.length > 0 ||
    errors.password.length > 0  
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


export const logOutService = async (tokens, history) => {

  try {
    const user = new UserModel()

    const action : Action = {
      type : ActionType.deleteUser,
      payloud : user
    }

    store.dispatch(action)

    // clear refreshToken from db
    const url = `http://localhost:3000/api/tokens/${tokens.dbToken.id}`;
    await deleteRequest(url);

    // clear localStorage
    localStorage.clear();

    // redirect to login page
    history.push("/");
  }
  catch (err) {
    console.log(err)
  }
};


