import React, { Component } from "react";
import { AuthServices } from "../../../services/auth-service";

// import redux
import { store } from "../../../redux/store";
import UpdateToken from "../updateToken/updateToken";

export class Logout extends Component<any, any> {
  private authService: AuthServices = new AuthServices();

  public componentDidMount = async () => {
    
    if (store.getState().auth.isLoggedIn === false) {
      this.props.history.push("/login");
      return;
    }
 
    try {
      this.authService.logout(this.props.history);
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
