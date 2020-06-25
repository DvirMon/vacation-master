import React, { Component } from "react";

// import material-ui
import { Grid, Tooltip, IconButton } from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Button from "@material-ui/core/Button";
import Form from "react-bootstrap/Form";

// import my components
import MyInput from "../../my-components/my-input/my-input";

// import models
import { RegisterModel } from "../../../models/user-model";
import { RegisterMenu } from "../../../models/menu-model";

// import services
import { LoginServices } from "../../../services/login-service";
import { ValidationService } from "../../../services/validation-service";
import { StyleService } from "../../../services/style-service";

import generator from "generate-password";

import "./register.scss";

interface RegisterState {
  user: RegisterModel;
  password: string;
  serverError: string;
  error: boolean;
}

export class Register extends Component<any, RegisterState> {
  
  private loginService: LoginServices = new LoginServices();
  private validationService: ValidationService = new ValidationService();
  private styleService: StyleService = new StyleService();

  constructor(props: any) {
    super(props);

    this.state = {
      user: new RegisterModel(),
      password: "",
      serverError: "",
      error: false,
    };
  }

  public componentDidMount = () => {
    this.styleService.style(RegisterMenu, "home");
  };



  private handleRegister = async () => {
    try { 
      await this.loginService.register(this.state.user);
    } catch (err) {
      this.handleErrorResponse(err);
    }
  };

  private handleErrorResponse = (err) => {
    if (err.response.status === 409) {
      const serverError = err.response.data;
      this.setState({ serverError, error: true });
    } else {
      console.log(err);
    }
  };

  render() {
    const { user, password, serverError, error } = this.state;

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
              serverErrorStyle={error}
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

  private disabledButton = (): boolean => {
    const valid = this.validationService.formLegal(
      this.state.user,
      RegisterModel.validRegistration
    );
    return valid.msg;
  };

  // update user state
  private handleChange = (prop: string, input: string) => {
    const { user, serverError } = this.state;
    user[prop] = input;
    this.setState({ user });

    if (prop === "userName" && serverError.length > 0) {
      this.setState({ serverError: "", error: false });
    }
  };
  // end of function

  // function to generate strong password
  private getPassword = () => {
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
