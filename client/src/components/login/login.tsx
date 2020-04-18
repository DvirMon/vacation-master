import React, { Component } from "react";

import { NavLink } from "react-router-dom";

//import materiel ui components
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import PersonIcon from "@material-ui/icons/Person";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import InputAdornment from "@material-ui/core/InputAdornment";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";

// import bootstrap components
import Image from "react-bootstrap/Image";

// import my components
import MyInput from "../my-input/my-input";

// import models
import { LoginModel } from "../../models/user-model";
import { LoginMenu } from "../../models/menu-model";

// import services
import { ValidationService } from "../../services/validation-service";
import { LoginServices } from "../../services/login-service";
import { ServerServices } from "../../services/server-service";
import { setStyle } from "../../services/style-services";

import "./login.scss";

interface LoginState {
  user: LoginModel;
  showPassword: boolean;
  error: boolean;
  serverError: string;
}

export class Login extends Component<any, LoginState> {
  constructor(props: any) {
    super(props);

    this.state = {
      user: new LoginModel(),
      showPassword: false,
      error: false,
      serverError: "",
    };
  }

  public componentDidMount = async () => {
    // set style
    setStyle(LoginMenu, "home");

    try {
      // verify if user is already logged
      LoginServices.isUserLogged(this.props.history);
      
    } catch (err) {
      console.log(err);
    }
  };

  // function to handle login request
  public handleLogIn = async () => {
    const { user } = this.state;

    // disabled request if form is not legal
    const valid = ValidationService.formLegal(user, LoginModel.validLogin);
    if (valid.msg) {
      return;
    }

    // handle request
    await this.handleRequest(user);
  };

  public handleRequest = async (user) => {
    //send login request

    try {
      const url = `http://localhost:3000/api/user/login`;
      const response = await ServerServices.postRequestAsync(url, user, true);

      // handle success
      LoginServices.handleSuccessResponse(response, this.props.history);
    } catch (err) {
      this.handleErrorResponse(err);
    }
  };

  public handleErrorResponse = (err) => {
    if (err.response.status === 409) {
      const serverError = err.response.data;
      this.setState({ serverError, error: true });
    } else {
      console.log(err);
    }
  };


  render() {
    const { user, serverError, showPassword, error } = this.state;

    return (
      <div className="login">
        <Grid className="login-main">
          <Grid className="header-login fade-up">
            <h2>Explore destinations around the world!</h2>
            <h4>Open an account for more information</h4>
          </Grid>
        </Grid>
        <Grid className="login-aside">
          <FormControl component="form" className="login-aside my-form">
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
                <Grid item className="icon-start">
                  <PersonIcon />
                </Grid>
                <MyInput
                  width={8}
                  value={user.userName || ""}
                  type="text"
                  label="Username"
                  prop={"userName"}
                  serverErrorStyle={error}
                  serverError={serverError}
                  fullWidth={true}
                  handleChange={this.handleChange}
                  validInput={LoginModel.validLogin}
                  helperText={"Please enter your username"}
                />
              </Grid>
              <Grid
                container
                spacing={3}
                alignItems="flex-end"
                className="d-flex justify-content-center p-3"
              >
                <Grid item className="icon-start">
                  <LockOpenIcon />
                </Grid>
                <MyInput
                  width={8}
                  value={user.password || ""}
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  prop={"password"}
                  serverErrorStyle={error}
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
                  validInput={LoginModel.validLogin}
                />
              </Grid>
              <Grid className="text-center" item xs={12}>
                <Button
                  type="button"
                  className="text-buttons"
                  variant="outlined"
                  color="primary"
                  onClick={this.handleLogIn}
                >
                  Login
                </Button>
              </Grid>
              <Grid className="text-center" item xs={12}>
                <Button
                  type="button"
                  className="text-buttons"
                  variant="outlined"
                  color="secondary"
                >
                  <NavLink to="/register" exact>
                    Open an Account !
                  </NavLink>
                </Button>
              </Grid>
            </Grid>
          </FormControl>
        </Grid>
      </div>
    );
  }

  public handleChange = (prop: string, input: string): void => {
    const user = { ...this.state.user };
    user[prop] = input;
    this.setState({ user, serverError: "", error: false });
  };

  public handleClickShowPassword = () => {
    const showPassword = this.state.showPassword;
    this.setState({ showPassword: !showPassword });
  };

  public handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
}

export default Login;
