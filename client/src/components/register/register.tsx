import React, { Component } from "react";
import { UserModel } from "../../models/user-model";
import PersonalDetails from "./personal-details/personal details";
import UsernameAndPassword from "./password-username/password-username";
import Container from "react-bootstrap/Container";
import "./register.scss";

interface RegisterState {
  step: number;
  user: UserModel;
}

export class Register extends Component<any, RegisterState> {
  constructor(props: any) {
    super(props);
    this.state = {
      step: 1,
      user: new UserModel()
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
    const { step } = this.state;
    const { user } = this.state;
    switch (step) {
      case 1:
        return (
          <div className="register container personal-details">
            <PersonalDetails
              handleChange={this.handleChange}
              nextStep={this.nextStep}
              user={user}
            />
          </div>
        );
      case 2:
        return (
          <Container className="register password-username">
            <UsernameAndPassword
              handleChange={this.handleChange}
              prevStep={this.prevStep}
              nextStep={this.nextStep}
              user={user}
            />
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
              this.props.history.push(`/login`);
            }, 3000)}
          </Container>
        );
    }
  }
}

export default Register;
