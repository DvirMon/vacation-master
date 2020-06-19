import React, { Component } from "react";

import { HttpService } from "../../services/server-service";

// import redux
import { store } from "../../redux/store";
import { ActionType } from "../../redux/action-type";
import UpdateToken from "../updateToken/updateToken";

export class Logout extends Component<any, any> {

  private http : HttpService = new HttpService() 

  public componentDidMount = async () => {

    if (store.getState().login.isLoggedIn === false) {
      this.props.history.push("/login");
      return;
    }

    try {
      const tokens = store.getState().auth.tokens;
      
      // clear refreshToken from db
      const id = tokens.dbToken?.id;

      if (id) {
        const url = `http://localhost:3000/api/tokens/${id}`;
        await this.http.deleteRequestAsync(url);
      }

      // handle logic in store
      store.dispatch({ type: ActionType.Logout });

      // disconnect from sockets
      store.getState().auth.socket.disconnect();

      // redirect to login page
      this.props.history.push("/login");
    } catch (err) {
      console.log(err);
      this.props.history.push("/login");
    }
  };

  render() {
    return (
      <div>
        <UpdateToken />
      </div>
    );
  }
}

export default Logout;
