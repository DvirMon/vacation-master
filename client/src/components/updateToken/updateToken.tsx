import React, { Component } from "react";
import { TokensServices } from "../../services/tokensService";

export class UpdateToken extends Component<any, any> {

  public componentDidMount = () => {

    const updateToken = setInterval(this.timer, 660000);
    this.setState({ updateToken });
  };

  public componentWillUnmount = () => {
    clearInterval(this.state.updateToken);
  };

  public timer = async () => {
    await TokensServices.getAccessToken();
  };

  render() {
    return <div></div>;
  }
}

export default UpdateToken;
