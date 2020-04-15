import React, { Component } from "react";
import { AuthServices } from "../../services/auth-service";
 
export class UpdateToken extends Component<any, any> {

  public componentDidMount = () => {

    const updateToken = setInterval(this.timer, 2000);
    this.setState({ updateToken });
  };

  public componentWillUnmount = () => {
    clearInterval(this.state.updateToken);
  };

  public timer = async () => {
    await AuthServices.getAccessToken();
  };

  render() {
    return <div></div>;
  }
}

export default UpdateToken;
