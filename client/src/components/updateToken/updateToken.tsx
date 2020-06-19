import React, { Component } from "react";
import { AuthServices } from "../../services/auth-service";

interface UpdateTokenState {
  update: boolean;
  updateToken: NodeJS.Timeout;
}

export class UpdateToken extends Component<any, UpdateTokenState> {

  public authService : AuthServices = new AuthServices()

  constructor(props) {
    super(props);

    this.state = {
      update: false,
      updateToken: setInterval(this.timer, 660000),
    };
  }


  public componentWillUnmount = () => {
    try {
      if (this.state.update) {
        clearInterval(this.state.updateToken);
      }
    } catch (err) {
      console.error(err);
    }
  };
   
  public timer = async () => {
    this.setState({ update: true });
    await this.authService.getAccessToken();
  };

  render() {
    return <div></div>;
  }
}

export default UpdateToken;
