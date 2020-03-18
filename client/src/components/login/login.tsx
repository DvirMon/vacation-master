import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import { NavLink } from "react-router-dom";
import { UserModel } from "../../models/user-model";
import MyInput from "../my-input/my-input";
import PersonIcon from "@material-ui/icons/Person";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import "./login.scss";
import {
  handleServerResponse,
  loginLegal,
  logInRequest
} from "../../services/login";
import { LoginErrors } from "../../models/error-model";

interface LoginState {
  user: UserModel;
  errors: LoginErrors
  serverError: string;
}

export class Login extends Component<any, LoginState> {
  constructor(props: any) {
    super(props);

    this.state = {
      user: new UserModel(),
      errors: {},
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
    this.props.history.push(`/user/${user.userID}`);
  };

  render() {
    const { user, serverError } = this.state;

    return (
      <div className="login">
        <aside>
          <div className="my-form">
            <Form>
              <Container>
                <Row className="row-header">
                  <Col sm={4} className="text-center">
                    <Image
                      src="assets/img/logo.png"
                      width="150px"
                      alt="Logo"
                      roundedCircle
                    />
                  </Col>
                  <Col sm={8} className="text-center form-inline">
                    <h1 className="card-title">Travel-On</h1>
                  </Col>
                </Row>
                <MyInput
                  width={12}
                  schema={user}
                  icon={<PersonIcon />}
                  type="text"
                  prop={"userName"}
                  placeholder={"Username"}
                  value={user.userName || ""}
                  handleChange={this.handleChange}
                  handleErrors={this.handleErrors}
                  validInput={UserModel.validLogin}
                />
                <MyInput
                  width={12}
                  schema={user}
                  value={user.password || ""}
                  type="password"
                  prop={"password"}
                  placeholder={"Password"}
                  handleChange={this.handleChange}
                  handleErrors={this.handleErrors}
                  validInput={UserModel.validLogin}
                  icon={<LockOpenIcon />}
                />
                <Row>
                  <Col sm={12} className="text-center">
                    {serverError}
                  </Col>
                </Row>
                <Row>
                  <Col sm={12} className="text-center">
                    <NavLink
                      to="/register"
                      exact
                      className="description text-center"
                    >
                      Don't have an account?
                    </NavLink>
                  </Col>
                </Row>
                <Row>
                  <Col sm={12} className="text-center">
                    <Button
                      className="btn-lg "
                      variant="info"
                      type="button"
                      onClick={this.handleLogIn}
                    >
                      Login
                    </Button>
                  </Col>
                </Row>
              </Container>
            </Form>
          </div>
        </aside>
      </div>
    );
  }

  public handleChange = (prop: string, value: string): void => {
    const user = { ...this.state.user };
    user[prop] = value;
    this.setState({ user, serverError: "" });
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
}

export default Login;
