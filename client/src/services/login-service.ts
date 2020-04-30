import { store } from "../redux/store";
import { AuthServices } from "./auth-service";
import { ActionType } from "../redux/action-type";
import { ServerServices } from "./server-service";

export class LoginServices {

  // function to check if user is logged
  static isUserLogged = (history) => {
    if (store.getState().login.isLoggedIn) {
      LoginServices.handleRouting(store.getState().login.user, history);
    }
  }
  // end of function

  // function to handle login
  static handleSuccessResponse = async (response, history) => {
    try {
      const user = response.user
      const accessToken = response.jwt
      store.dispatch({ type: ActionType.Login, payload: user });
      store.dispatch({ type: ActionType.addAccessToken, payload: accessToken });
      await AuthServices.getRefreshToken() 
      LoginServices.handleRouting(user, history);
    } catch (err) {
      console.log(err)
    } 
  }; 
  // end of function

  // function to handle rout according to role
  static handleRouting = (user, history) => {
    user.isAdmin === 1 ?
      history.push(`/admin`)
      : history.push(`/user/${user.uuid}`);
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
    const uuid = history.location.pathname.substring(6)
    if (uuid === user.uuid) {
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

  static handleLogOut = async () => {

    const tokens = store.getState().auth.tokens;

    // clear refreshToken from db
    const url = `http://localhost:3000/api/tokens/${tokens.dbToken.id}`;
    await ServerServices.deleteRequestAsync(url);

    // handle logic in store
    store.dispatch({ type: ActionType.Logout });

    // disconnect from sockets
    store.getState().auth.socket.disconnect();
  }

}
