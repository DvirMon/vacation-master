import { store } from "../redux/store";
import { AuthServices } from "./auth-service";
import { ActionType } from "../redux/action-type";

export class LoginServices {

  // function to check if user is logged
  static isUserLogged = (history) => {
    if (store.getState().login.isLoggedIn) {
      LoginServices.handleRouting(store.getState().login.user, history);
    }
  }
  // end of function

  // function to handle login
  static handleSuccessResponse = async (user, history) => {
    store.dispatch({ type: ActionType.Login, payload: user });
    store.dispatch({ type: ActionType.isAdmin, payload: user.isAdmin });
    await AuthServices.getTokens()
    LoginServices.handleRouting(user, history);
  };
  // end of function

  // function to handle rout according to role
  static handleRouting = (user, history) => {
    user.isAdmin === 1 ?
      history.push(`/admin`)
      : history.push(`/user/${user.userName}`);
  };
  // end of function

  // prevent admin to navigate to users route
  static verifyAdminPath = (history) => {
    if (history.location.pathname === "/admin") {
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

  // main function for navigation control
  static verifyPath = (admin, user, history) => {
    if (admin) {
      LoginServices.verifyAdminPath(history);
    } else {
      LoginServices.verifyUserPath(user, history);
    }
  }
  // end of function



}
