import { store } from "../redux/store";
import { AuthServices } from "./auth-service";
import { ActionType } from "../redux/action-type";
import { HttpService } from "./server-service";
import { environment } from "../environments/environment"

export class LoginServices {

  private server : string = `${environment.server}/api/user`
  private authService : AuthServices = new AuthServices()
  private http : HttpService = new HttpService()

  // request section

  public login = async (user, history) => {
    const response = await this.http.postRequestAsync( this.server + "/login", user);
    this.handleSuccessResponse(response, history);
  }

  public register = async (user, history) => {
    const response = await this.http.postRequestAsync(this.server, user);
    this.handleSuccessResponse(response, history);
  }

  // function to check if user is logged
  public isUserLogged = (history) => {
    if (store.getState().login.isLoggedIn) {
      this.handleRouting(store.getState().login.user, history);
    }
  }
  // end of function

  // function to handle login
  public handleSuccessResponse = async (response, history) => {
    try {
      const user = response.user
      const accessToken = response.jwt
      store.dispatch({ type: ActionType.Login, payload: user });
      store.dispatch({ type: ActionType.addAccessToken, payload: accessToken });
      await  this.authService.getTokens()
      this.handleRouting(user, history);
    } catch (err) {
      console.log(err)
    }
  };
  // end of function

  // function to handle rout according to role
  public handleRouting = (user, history) => {
    user.isAdmin === 1 ?
      history.push(`/admin`)
      : history.push(`/user/${user.uuid}`);
  };
  // end of function

  // prevent admin to navigate to users route
  public verifyAdminPath = (history) => {
    if (history.location.pathname === "/admin") {
      return
    }
    history.push("/admin")
  }
  // end of function

  // prevent user to navigate to other users route
  public verifyUserPath = (user, history) => {
    const uuid = history.location.pathname.substring(6)
    if (uuid === user.uuid) {
      return
    }
    history.push("/")
  }
  // end of function

  // main function for navigation control
  public verifyPath = (admin, user, history) => {
    if (admin) {
      this.verifyAdminPath(history);
    } else {
      this.verifyUserPath(user, history);
    }
  }
  // end of function

  public handleLogOut = async () => {

    const tokens = store.getState().auth.tokens;

    // clear refreshToken from db
    const url = `${environment.server}/api/tokens/${tokens.dbToken.id}`;
    await this.http.deleteRequestAsync(url);

    // handle logic in store
    store.dispatch({ type: ActionType.Logout });

    // disconnect from sockets
    store.getState().auth.socket.disconnect();
  }

}
