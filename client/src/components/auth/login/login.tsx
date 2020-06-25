import React, { Component } from "react";

import { NavLink } from "react-router-dom";

//import materiel ui components
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import withWidth from "@material-ui/core/withWidth";

import Avatar  from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import InputAdornment from "@material-ui/core/InputAdornment";

import Visibility from "@material-ui/icons/Visibility";
import IconButton from "@material-ui/core/IconButton";
import VisibilityOff from "@material-ui/icons/VisibilityOff";


// import bootstrap components
import Image from "react-bootstrap/Image";

// import my components
import MyInput from "../../my-components/my-input/my-input";

// import models
import { LoginModel } from "../../../models/user-model";
import { LoginMenu } from "../../../models/menu-model";

// import services
import { ValidationService } from "../../../services/validation-service";
import { LoginServices } from "../../../services/login-service";
import { StyleService } from "../../../services/style-service";

import "./login.scss";

interface LoginState {
  user: LoginModel;
  showPassword: boolean;
  error: boolean;
  serverError: string;
}

export class Login extends Component<any, LoginState> {
  
  private loginService: LoginServices = new LoginServices();
  private validationService: ValidationService = new ValidationService();
  private styleService: StyleService = new StyleService();

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
    this.styleService.style(LoginMenu, "home");
    this.loginService.isUserLogged();
  };

  // function to handle login request
  public handleLogIn = async () => {
    const { user } = this.state;

    // disabled request if form is not legal
    const valid = this.validationService.formLegal(user, LoginModel.validLogin);
    if (valid.msg) {
      return;
    }

    // handle request
    try {
      await this.loginService.login(user, );
    } catch (err) {
      this.handleErrorResponse(err);
    }
  };

  public handleErrorResponse = (err) => {
    if (err.response?.status === 409) {
      const serverError = err.response.data;
      this.setState({ serverError, error: true });
    } else {
      console.log(err);
    }
  };

  render() {
    const { user, serverError, showPassword, error } = this.state;

    return (
      <Grid className="login" container={true}>
        <Hidden smDown>
          <Grid item xs>
            <div className="login-text fade-up">
              <h2>Explore destinations around the world!</h2>
              <h4>Open an account for more information</h4>
            </div>
          </Grid>
        </Hidden>
        <Grid item xs className="login-form">
          <FormControl component="form" className="auth-form">
            <Grid className="row-header" spacing={2} container>
              <Hidden smDown>
                <Grid item xs={1} md={4}>
                  <Image
                    src="assets/img/logo.png"
                    width="150px"
                    alt="Logo"
                    roundedCircle
                  />
                </Grid>
              </Hidden>
              <Hidden smUp>
                <Grid item xs={1} md={4}>
                  <Avatar alt="Remy Sharp" src="assets/img/logo.png" />
                </Grid>
              </Hidden>
              <Grid item xs={10} md={8}>
                <h1 className="card-title">Travel-On</h1>
              </Grid>
            </Grid>
            <Grid
              container
              spacing={3}
              alignItems="flex-end"
              className="d-flex justify-content-center p-3"
            >
              <MyInput
                width={10}
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
              <MyInput
                width={10}
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
            <Grid container>
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
      </Grid>
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

export default withWidth()(Login);
