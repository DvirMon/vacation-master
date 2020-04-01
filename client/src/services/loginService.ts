import { postRequest } from "./serverService";
import { store } from "../redux/store";
import { ActionType } from "../redux/action-type";
 
export class LoginServices {

  // prevent admin to navigate to users route
  static verifyAdminPath = (history) => {
    if (history.location.pathname == "/admin") {
      return
    }
    history.push("/admin")
  }
  // end of function

  // prevent user to navigate to other users route
  static verifyUserPath = (user, history) => {
    const userName = history.location.pathname.substring(6)
    if (userName === user.userName) {
      return
    }
    history.push("/")
  }
  // end of function

  // function for login
  static logInRequest = async user => {
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
  static loginLegal = (user, errors) => {
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
  static handleRouting = (user, history) => {
    if (user.isAdmin === 1) {
      history.push(`/admin`);
      return;
    }
    history.push(`/user/${user.userName}`);
  };
  // end of function

  // handle style according to role
  static handelBackground = (bool: boolean) => {
    if (bool) {
      store.dispatch({ type: ActionType.updateBackground, payload: "" });
      return
    }
    store.dispatch({ type: ActionType.updateBackground, payload: "user" });
  };
  // end of function

  // handle style according to role
  static handelRole = (user) => {
    if (user.isAdmin === 1) {
      return true;
    }
    return false;
  };
  // end of function

}
