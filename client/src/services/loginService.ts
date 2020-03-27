import { postRequest, deleteRequest } from "./serverService";
import { store } from "../redux/store/store";
import { ActionType } from "../redux/action-type/action-type";


export const verifyAdminPath= (history) => {
  if(history.location.pathname == "/admin") {
    return 
  } 
  history.push("/admin")
}
 
export const verifyUserPath= (user, history) => {
  const userName = history.location.pathname.substring(6)
  if(userName === user.userName) {
    return 
  }  
  history.push("/")
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
      return true
    case "object":
      return false;
  }
};

export const handleResponse = (response, history) => {
  // verify response in case token has expired
  switch (typeof response) {
    case "string":
      history.push("/logout");
      break;
    case "object":
      return response;
  }
}; 


export const  handleRouting = history => {
  const user = store.getState().user;
  if (user.isAdmin === 1) {
    history.push(`/admin`);
    return;
  }
  history.push(`/user/${user.userName}`);
};

export const  handelRole = () => {
  const user = store.getState().user;
  if (user.isAdmin === 1) {
    store.dispatch({ type: ActionType.updateBackground, payload: "" });
    return true;
  }
  store.dispatch({ type: ActionType.updateBackground, payload: "user" });
  return false;
}; 






