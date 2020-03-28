import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import { Grid, Tooltip, IconButton } from "@material-ui/core";
import MyInput from "../my-input/my-input";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Button from "@material-ui/core/Button";
import { RegistrationErrors } from "../../models/error-model";
import { RegisterModel } from "../../models/user-model";
import generator from "generate-password";
import { postRequest, handleServerResponse } from "../../services/serverService";
import { formLegalValues, formLegalErrors, formLegal } from "../../services/validationService";
import { store } from "../../redux/store/store";
import { ActionType } from "../../redux/action-type/action-type";
import { MenuModel, RegisterMenu } from "../../models/menu-model";
import "./register.scss";
import { getTokens } from "../../services/tokensService";

interface RegisterState {
  user: RegisterModel;
  errors: RegistrationErrors;
  password: string;
  serverError: string;
  serverErrorStyle: boolean;
  menu: MenuModel;
}
export class Register extends Component<any, RegisterState> {
  constructor(props: any) {
    super(props);

    this.state = {
      user: new RegisterModel(),
      errors: new RegistrationErrors("", "", "", "", ""),
      password: "",
      serverError: "",
      serverErrorStyle: false,
      menu: RegisterMenu
    };
  }

  public componentDidMount = () => {
    // set style
    store.dispatch({ type: ActionType.updateMenu, payload: this.state.menu });
    store.dispatch({ type: ActionType.updateBackground, payload: "home" });
  };

  public registrationFormLegal = (): boolean => {
    const user = this.state.user;
    const errors = this.state.errors;

    const value = formLegalValues(user);
    if (value) {
      return true;
    }

    const error = formLegalErrors(errors);
    if (error) {
      return true;
    }

    return false;
  };

  public addUser = async () => {
    const { user } = this.state;

    if (formLegal(user, RegisterModel.validRegistration)) {
      return;
    }

    try {
      const url = `http://localhost:3000/api/user`;
      const serverResponse = await postRequest(url, user);

      console.log(serverResponse);
 
      if (handleServerResponse(serverResponse)) {
        this.setState({ serverError: serverResponse, serverErrorStyle: true });
        return;
      } else {
        store.dispatch({ type: ActionType.Login, payload: serverResponse.body });
        await getTokens(user);
        this.props.history.push(`/user/${user.userName}`);
        return;
      }
    } catch (err) {
      console.log(err);
    }
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
              value={user.firstName || ""}
              type={"text"}
              prop="firstName"
              label="First Name"
              handleChange={this.handleChange}
              handleErrors={this.handleErrors}
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
              handleErrors={this.handleErrors}
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
              handleErrors={this.handleErrors}
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
              handleErrors={this.handleErrors}
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
                onClick={this.addUser}
                disabled={this.registrationFormLegal()}
              >
                Sigh-in
              </Button>
            </Grid>
          </Grid>
        </Form>
      </div>
    );
  }

  public handleChange = (prop: string, input: string) => {
    const { user, serverError } = this.state;
    user[prop] = input;
    this.setState({ user });

    if (prop === "userName" && serverError.length > 0) {
      this.setState({ serverError: "", serverErrorStyle: false });
    }
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
      numbers: true,
      strict: true
    });
    this.setState({ password });
    this.handleChange("password", password);
  };

  public loginButton = () => {
    this.props.history.push("/login");
  };
}

export default Register;
