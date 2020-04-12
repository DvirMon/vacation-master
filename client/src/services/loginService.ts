import { store } from "../redux/store";
import { ValidationService } from "./validationService";
import { invokeConnection } from "./socketService";

export class LoginServices {

  // function to check if user is logged
  static isUserLogged = (history) => {
    if (store.getState().login.isLoggedIn === false) {
      return;
    }
    LoginServices.handleRouting(store.getState().login.user, history);
  }
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

  // main function for verify path
  static verifyPath = (admin, user, history) => {
    if (admin) {
      LoginServices.verifyAdminPath(history);
    } else {
      LoginServices.verifyUserPath(user, history);
    }
  }
  // end of function


  // verify admin role && invoke socket connection 
  static adminLoginLogic = (history) => {
    ValidationService.verifyAdmin(history);
    invokeConnection();
  }
// end of function

}
