import { postRequest, deleteRequest } from "./serverService";
import { store } from "../redux/store/store";
import { ActionType } from "../redux/action-type/action-type";
// import { history } from "./historyService";

// admin path cant switch to user path
export const verifyAdminPath = (history) => {
  if (history.location.pathname == "/admin") {
    return
  }
  history.push("/admin")
}
// end of function

// user cant route to other users route
export const verifyUserPath = (user, history) => {
  const userName = history.location.pathname.substring(6)
  if (userName === user.userName) {
    return
  }
  history.push("/")
}
// end of function

// function for login
export const logInRequest = async user => {
  try {
    const url = `http://localhost:3000/api/user/login`;
    const response = await postRequest(url, user);
    return response;
  } catch (err) {
    console.log(err);
  }
};
// enf of function for login

// function for legal login form
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
// end function for legal login form

 
// function to handle rout according to role
export const handleRouting = (history) => {
  const user = store.getState().user;
  if (user.isAdmin === 1) {
    history.push(`/admin`);
    return;
  }
  history.push(`/user/${user.userName}`);
};
// end of function

// handle style according to role
export const handelStyle = () => {
  const user = store.getState().user;
  if (user.isAdmin === 1) {
    store.dispatch({ type: ActionType.updateBackground, payload: "" });
    return true;
  }
  store.dispatch({ type: ActionType.updateBackground, payload: "user" });
  return false;
};
// end of function






