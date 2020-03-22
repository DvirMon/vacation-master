import React, { Component } from "react";
import { UserModel } from "../../models/user-model";
import Container from "react-bootstrap/Container";
import "./register.scss";

interface RegisterState {
  user: UserModel;
  step: number;
  timeOut: number;
} 

export class Register extends Component<any, RegisterState> {
  constructor(props: any) {
    super(props);
    this.state = {
      user: new UserModel(),
      step: 1,
      timeOut: 3000
    };
  }

  // Proceed to next step
  public nextStep = (): void => {
    const { step } = this.state;
    this.setState({
      step: step + 1
    });
  };

  // Go back to prev step
  public prevStep = () => {
    const { step } = this.state;
    this.setState({
      step: step - 1
    });
  };

  // Handle fields change
  public handleChange = (prop: string, input: string) => {
    const user = { ...this.state.user };
    user[prop] = input;
    this.setState({ user });
  };

  render() {
    const { user, step, timeOut } = this.state;

    switch (step) {
      case 1:
        return (
          <Container className="register personal-details">
          </Container>
        );
      case 2:
        return (
          <Container className="register password-username">
          </Container>
        );
      case 3:
        return (
          <Container className="register success">
            <h1 className="text">{`Hi ${user.firstName} !`}</h1>
            <h2>
              Thank you for joining <b>Travel On</b>
            </h2>
            <h3>you will immediately be transfer to your account</h3>
            {setTimeout(() => {
              this.props.history.push(`/`);
            }, timeOut)}
          </Container>
        );
    }
  }
}

export default Register;
