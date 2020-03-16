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
import { postRequest } from "../../services/server";
import { handleLoginResponse } from "./login-service";
import "./login.scss";

interface LoginState {
  user: UserModel;
  errors: string[];
}

export class Login extends Component<any, LoginState> {
  constructor(props: any) {
    super(props);

    this.state = {
      user: new UserModel(),
      errors: []
    };
  }

  public componentDidMount = async () => {
    try {
      //  check if user is still login 
      const storage = localStorage.getItem("user");
      const response = JSON.parse(storage);
      if (!response) {
        this.props.history.push("/login");
        console.log("Please Login")
        return;
      }
      const dbUser = response;
      const route = handleLoginResponse(response);
      console.log(route);
      if (route === 0) {
        this.props.history.push(`/user/${dbUser.userID}`);
        return;
      }
      this.props.history.push(`/admin`);
    } catch (err) {
      console.log(err);
    }
  };

  public legalLogin = user => {
    const errors = [...this.state.errors];
    if (
      user.password === undefined ||
      user.userName === undefined ||
      errors.length > 0
    ) {
      console.log(errors);
      return true;
    }
    return false;
  };

  public handleLogIn = async () => {
    const user = { ...this.state.user };

    // valid user login
    if (this.legalLogin(user)) {
      return;
    }

    try {
      const response = await this.logInRequest(user);
      const dbUser = response;
      const route = handleLoginResponse(response);
      if (route === 0) {
        this.props.history.push(`/user/${dbUser.userID}`);
        return;
      }
      this.props.history.push(`/admin`);
    } catch (err) {
      console.log(err);
    }
  };

  public logInRequest = async user => {
    try {
      const url = `http://localhost:3000/api/user/login`;
      const response = await postRequest(url, user);
      return response;
    } catch (err) {
      console.log(err);
    }
  };


  render() {
    
    const { user } = this.state;

    return (
      <div className="login">
        <aside>
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
              <Row>
                <Col sm={11} className="form-group has-default">
                  <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                      <InputGroup.Text>
                        <i className="material-icons">person</i>
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      value={user.userName || ""}
                      placeholder="Username"
                      aria-label="username"
                      onChange={this.handleChange("userName")}
                      onBlur={this.validInput("userName")}
                    />
                  </InputGroup>
                </Col>
              </Row>
              <Row>
                <Col sm={12}></Col>
              </Row>
              <Row>
                <Col sm={11} className="form-group has-default">
                  <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                      <InputGroup.Text>
                        <i className="material-icons">lock_outline</i>
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      type="password"
                      value={user.password || ""}
                      placeholder="Password"
                      aria-label="password"
                      onChange={this.handleChange("password")}
                      onBlur={this.validInput("password")}
                    />
                  </InputGroup>
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
        </aside>
      </div>
    );
  }

  public validInput = (prop: string) => (
    event: React.FocusEvent<HTMLInputElement>
  ): void => {
    const user = { ...this.state.user };
    const errors = UserModel.validLogin(user);
    if (errors) {
      this.setState({ errors });
      return;
    }
    this.setState({ errors: [] });
    return;
  };

  public handleChange = (prop: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const value = event.target.value;
    const user = { ...this.state.user };
    user[prop] = value;
    this.setState({ user });
  };
}

export default Login;
