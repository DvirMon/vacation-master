import React, { Component } from "react";

// import material-ui
import { Grid, Tooltip, IconButton } from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Button from "@material-ui/core/Button";
import MyInput from "../my-input/my-input";
import Form from "react-bootstrap/Form";

// import models
import { RegisterModel } from "../../models/user-model";
import { RegisterMenu } from "../../models/menu-model";

// import services
import { LoginServices } from "../../services/login-service";
import { ServerServices } from "../../services/server-service";
import { ValidationService } from "../../services/validation-service";
import { setStyle } from "../../services/style-services";

import generator from "generate-password";

import "./register.scss";

interface RegisterState {
  user: RegisterModel;
  password: string;
  serverError: string;
  serverErrorStyle: boolean;
}
export class Register extends Component<any, RegisterState> {
  constructor(props: any) {
    super(props);

    this.state = {
      user: new RegisterModel(),
      password: "",
      serverError: "",
      serverErrorStyle: false,
    };
  }

  public componentDidMount = () => {
    // set style
    setStyle(RegisterMenu, "home");
  };

  public disabledButton = (): boolean => {
    const user = this.state.user;

    const valid = ValidationService.formLegal(
      user,
      RegisterModel.validRegistration
    );
    return valid.msg;
  };

  public handleRegister = async () => {
    const { user } = this.state;

    try {
      // handle request
      await this.handleRequest(user);
    } catch (err) {
      console.log(err);
    }
  };

  public handleRequest = async (user) => {
    
    // send register request
    const url = `http://localhost:3000/api/user`;
    const serverResponse = await ServerServices.postRequestAsync(url, user);

    // handle server response
    ServerServices.handleServerResponse(
      serverResponse,
      () =>
        LoginServices.handleSuccessResponse(
          serverResponse.body,
          this.props.history
        ), 
      () => this.handleErrorResponse(serverResponse.body)
    );
  };


  public handleErrorResponse = (serverError) => {
    this.setState({ serverError, serverErrorStyle: true });
  };

  render() {
    const { user, password, serverError, serverErrorStyle } = this.state;

    return (
      <div className="register">
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
              validInput={RegisterModel.validRegistration}
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
              validInput={RegisterModel.validRegistration}
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
              validInput={RegisterModel.validRegistration}
              serverError={serverError}
              serverErrorStyle={serverErrorStyle}
              helperText={"Please choose a username"}
            ></MyInput>
            <MyInput
              width={10}
              fullWidth={true}
              value={user.password || password}
              type="text"
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
              validInput={RegisterModel.validRegistration}
              helperText={"Please enter a password or create one with the icon"}
            ></MyInput>
            <Grid className="text-center" item xs={10}>
              <Button
                type="button"
                className="register-button"
                variant="contained"
                color="secondary"
                fullWidth={true}
                onClick={this.handleRegister}
                disabled={this.disabledButton()}
              >
                Sigh-in
              </Button>
            </Grid>
          </Grid>
        </Form>
      </div>
    );
  }

  // update user state
  public handleChange = (prop: string, input: string) => {
    const { user, serverError } = this.state;
    user[prop] = input;
    this.setState({ user });

    if (prop === "userName" && serverError.length > 0) {
      this.setState({ serverError: "", serverErrorStyle: false });
    }
  };
  // end of function

  // function to generate strong password
  public getPassword = () => {
    const password = generator.generate({
      length: 10,
      numbers: true,
      strict: true,
    });
    this.setState({ password });
    this.handleChange("password", password);
  };
  // end of function
}

export default Register;
