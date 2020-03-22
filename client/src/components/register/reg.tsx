import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import { Grid, Tooltip, IconButton, Button } from "@material-ui/core";
import MyInput from "../my-input/my-input";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { RegistrationErrors } from "../../models/error-model";
import { UserModel } from "../../models/user-model";
import generator from "generate-password";
import "./register.scss";
import AppTop from "../app-top/app-top/app-top";

interface RegState {
  user: UserModel;
  errors: RegistrationErrors;
  password: string;
  serverError: string;
}
export class Reg extends Component<any, RegState> {
  constructor(props: any) {
    super(props);

    this.state = {
      user: new UserModel(),
      errors: new RegistrationErrors(),
      password: "",
      serverError: ""
    };
  }

  render() {
    const { user, password, serverError } = this.state;

    return (
      <div className="register">
        <nav>
          <AppTop admin={false} />
        </nav>
        <main>
          <Form className="register-form">
            <Grid container spacing={3} className="justify-content-center">
              <MyInput
                width={10}
                fullWidth={true}
                autoFocus={true}
                value={user.firstName || ""}
                type={"text"}
                prop="firstName"
                label="First Name"
                handleChange={this.handleChange}
                handleErrors={this.handleErrors}
                validInput={UserModel.validRegistration}
                helperText={"Please enter your first name"}
              ></MyInput>
              <MyInput
                width={10}
                fullWidth={true}
                value={user.lastName || ""}
                type={"text"}
                prop="lastName"
                label="Last Name"
                handleChange={this.handleChange}
                handleErrors={this.handleErrors}
                validInput={UserModel.validRegistration}
                helperText={"Please enter your last name"}
              ></MyInput>
              <MyInput
                width={10}
                fullWidth={true}
                value={user.userName || ""}
                type={"text"}
                prop={"userName"}
                label="Username"
                handleChange={this.handleChange}
                handleErrors={this.handleErrors}
                validInput={UserModel.validRegistration}
                serverError={serverError}
                helperText={"Please choose a username"}
              ></MyInput>
              <MyInput
                width={10}
                fullWidth={true}
                value={user.password || password}
                type={"password"}
                prop={"password"}
                label="Password (8-24 characters)"
                passwordIcon={
                  <Tooltip title="Generate strong password" placement="top">
                    <IconButton onClick={this.getPassword}>
                      <LockOutlinedIcon />
                    </IconButton>
                  </Tooltip>
                }
                handleChange={this.handleChange}
                handleErrors={this.handleErrors}
                validInput={UserModel.validRegistration}
                helperText={
                  "Please enter a password or create one with the icon"
                }
              ></MyInput>
              <Grid className="text-center" item xs={12}>
                <Button
                  type="button"
                  className="register-button"
                  variant="contained"
                  color="secondary"
                  fullWidth={true}
                >
                  Sigh-in
                </Button>
              </Grid>
            </Grid>
          </Form>
        </main>
      </div>
    );
  }

  public handleChange = (prop: string, input: string) => {
    const user = { ...this.state.user };
    user[prop] = input;
    this.setState({ user });
  };

  public handleErrors = (prop: string, error: string) => {
    const errors = { ...this.state.errors };
    errors[prop] = error;
    if (error.length > 0) {
      this.setState({ errors });
      return;
    }
    this.setState({ errors });
  };

  public getPassword = () => {
    const password = generator.generate({
      length: 10,
      numbers: true
    });
    this.setState({ password });
    this.handleChange("password", password);
  };
}

export default Reg;
