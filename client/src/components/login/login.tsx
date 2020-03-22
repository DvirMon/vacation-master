import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import { NavLink } from "react-router-dom";
import { UserModel } from "../../models/user-model";
import MyInput from "../my-input/my-input";
import PersonIcon from "@material-ui/icons/Person";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import {
  handleServerResponse,
  loginLegal,
  logInRequest
} from "../../services/login";
import { LoginErrors } from "../../models/error-model";
import { Grid, Paper, Typography } from "@material-ui/core";
import AppTop from "../app-top/app-top/app-top";
import "./login.scss";

interface LoginState {
  user: UserModel;
  errors: LoginErrors;
  showPassword: boolean;
  serverError: string;
}

export class Login extends Component<any, LoginState> {
  constructor(props: any) {
    super(props);

    this.state = {
      user: new UserModel(),
      errors: new LoginErrors(),
      showPassword: false,
      serverError: ""
    };
  }

  public componentDidMount = async () => {
    try {
      //  check if user is still login
      const storage = localStorage.getItem("user");
      const response = JSON.parse(storage);
      if (!response) {
        this.props.history.push("/login");
        console.log("Please Login");
        return;
      }

      //   if so route according to role
      const user = response;
      this.handleRouting(user);
    } catch (err) {
      console.log(err);
    }
  };

  public handleLogIn = async () => {
    const user = { ...this.state.user };
    const errors = { ...this.state.errors };

    // disabled request if form is not legal
    if (loginLegal(user, errors)) {
      return;
    }

    try {
      const serverResponse = await logInRequest(user);
      const response = handleServerResponse(serverResponse);

      // if false response is error
      if (!response) {
        this.setState({ serverError: serverResponse });
        return;
      }

      this.handleRouting(serverResponse);
    } catch (err) {
      console.log(err);
    }
  };

  public handleRouting = user => {
    //admin route
    if (user.isAdmin === 1) {
      this.props.history.push(`/admin`);
      return 1;
    }
    this.props.history.push(`/user/${user.userName}`);
  };

  render() {
    const { user, serverError, showPassword } = this.state;

    return (
      <div className="login">
        <nav>
          <AppTop
            user={false}
            reg={true}
            registerButton={this.registerButton}
          />
        </nav>
        <aside>
          <Form className="my-form">
            <Grid className="row-header" spacing={2} container>
              <Grid item xs={4}>
                <Image
                  src="assets/img/logo.png"
                  width="150px"
                  alt="Logo"
                  roundedCircle
                />
              </Grid>
              <Grid item xs={8}>
                <h1 className="card-title">Travel-On</h1>
              </Grid>
              <Grid
                container
                spacing={3}
                alignItems="flex-end"
                className="d-flex justify-content-center p-3"
              >
                <Grid item>
                  <PersonIcon />
                </Grid>
                <MyInput
                  width={8}
                  value={user.userName || ""}
                  type="text"
                  label="Username"
                  prop={"userName"}
                  serverError={serverError}
                  fullWidth={true}
                  handleChange={this.handleChange}
                  handleErrors={this.handleErrors}
                  validInput={UserModel.validLogin}
                  helperText={"Please enter your username"}
                />
              </Grid>
              <Grid
                container
                spacing={3}
                alignItems="flex-end"
                className="d-flex justify-content-center p-3"
              >
                <Grid item>
                  <LockOpenIcon />
                </Grid>
                <MyInput
                  width={8}
                  value={user.password || ""}
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  prop={"password"}
                  serverError={serverError}
                  fullWidth={true}
                  helperText={"Please enter your password"}
                  passwordIcon={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={this.handleClickShowPassword}
                        onMouseDown={this.handleMouseDownPassword}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                  handleChange={this.handleChange}
                  handleErrors={this.handleErrors}
                  validInput={UserModel.validLogin}
                />
              </Grid> 
              <Grid className="text-center" item xs={12}>
                <Button
                  className="btn-lg "
                  variant="info"
                  type="button"
                  onClick={this.handleLogIn}
                >
                  Login
                </Button>
              </Grid>
            </Grid>
          </Form>
        </aside>
      </div>
    );
  }

  public handleChange = (prop: string, input: string): void => {
    const user = { ...this.state.user };
    user[prop] = input;
    this.setState({ user, serverError: "" });
    console.log(this.state.user);
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

  public handleClickShowPassword = () => {
    const showPassword = this.state.showPassword;
    console.log(showPassword);
    this.setState({ showPassword: !showPassword });
  };

  public handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
 
  public registerButton = () => {
    this.props.history.push("/register");
  };
}

export default Login;
