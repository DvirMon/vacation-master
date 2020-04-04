import React, { Component } from "react";

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
import { LoginErrors } from "../../models/error-model";
import { UserModel } from "../../models/user-model";
import { MenuModel, LoginMenu } from "../../models/menu-model";

// import services
import { LoginServices } from "../../services/loginService";
import { TokensServices } from "../../services/tokensService";
import { ServerServices } from "../../services/serverService";

// import redux
import { ActionType } from "../../redux/action-type";
import { store } from "../../redux/store";

import "./login.scss";

interface LoginState {
  user: UserModel;
  errors: LoginErrors;
  showPassword: boolean;
  error: boolean;
  serverError: string;
  menu: MenuModel;
}

export class Login extends Component<any, LoginState> {
  constructor(props: any) {
    super(props);

    this.state = {
      user: new UserModel(),
      errors: new LoginErrors(),
      showPassword: false,
      error: false,
      serverError: "",
      menu: new MenuModel({}, false, false, false, false, 0)
    };
  }

  public componentDidMount = async () => {
    // set style
    store.dispatch({ type: ActionType.updateMenu, payload: LoginMenu });
    store.dispatch({ type: ActionType.updateBackground, payload: "home" });

    // check if user is logged
    try {
      if (store.getState().auth.isLoggedIn === false) {
        return;
      }
      LoginServices.handleRouting(
        store.getState().auth.user,
        this.props.history
      );
    } catch (err) {
      console.log(err);
    }
  };

  public handleLogIn = async () => {
    const { user, errors } = this.state;

    // disabled request if form is not legal
    if (LoginServices.loginLegal(user, errors)) {
      return;
    }

    try {
      //send login request
      const serverResponse = await LoginServices.logInRequest(user);

      // if true server returned error
      if (ServerServices.handleServerResponse(serverResponse)) {
        this.setState({ serverError: serverResponse.body, error: true });
        return;
      }

      const loggedUser = serverResponse.body;

      // if false - save user in store
      store.dispatch({ type: ActionType.Login, payload: loggedUser });
     

      // get tokens
      await TokensServices.getTokens(loggedUser);

      LoginServices.handelRole(loggedUser);

      // navigate according to role
      LoginServices.handleRouting(loggedUser, this.props.history);
    } catch (err) {
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
          <FormControl className="login-aside my-form">
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
                  handleErrors={this.handleErrors}
                  validInput={UserModel.validLogin}
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
                  onClick={this.registerButton}
                >
                  Open an Account !
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
