import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import { UserModel } from "../../../models/user-model";
import Row from "react-bootstrap/Row";
import MyInput from "../../my-input/my-input";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import { postRequest } from "../../../services/server";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { IconButton } from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";
import { loginLegal } from "../../../services/login";
import generator from "generate-password";
import { LoginErrors } from "../../../models/error-model";

interface PasswordUsernameProps {
  user: UserModel;
  handleChange(prop: string, input: string): void;
  nextStep?(): void;
  prevStep?(): void;
}

interface PasswordUsernamesState {
  errors: LoginErrors;
  password: string;
  serverError: string;
}

export class PasswordUsername extends Component<
  PasswordUsernameProps,
  PasswordUsernamesState
> {
  constructor(props: PasswordUsernameProps) {
    super(props);

    this.state = {
      errors: null,
      password: "",
      serverError: ""
    };
  }

  public handleErrors = (prop: string, error: string) => {
    const errors = { ...this.state.errors };
    errors[prop] = error;
    if (error.length > 0) {
      this.setState({ errors });
      return;
    }
    this.setState({ errors });
  };

  public addUser = async () => {
    const url = `http://localhost:3000/api/user`;
    const user = this.props.user;
    const response = await postRequest(url, user);
    return response;
  };

  render() {
    const { user, prevStep } = this.props;
    const { password, serverError } = this.state;

    return (
      <React.Fragment>
        <Row className="card-header">
          <h2>Username And Password</h2>
        </Row>
        <Form style={{ position: "relative", top: "5vh" }}>
          <MyInput
            width={12}
            value={user.password || password}
            prop={"password"}
            label="Password (8-24 characters)"
            passwordIcon={
              <Tooltip title="Generate strong password" placement="left">
                <IconButton onClick={this.getPassword}>
                  <LockOutlinedIcon />
                </IconButton>
              </Tooltip>
            }
            handleChange={this.handleChange}
            handleErrors={this.handleErrors}
            validInput={UserModel.validRegistration}
          ></MyInput>

          <MyInput
            width={12}
            value={user.userName || ""}
            type={"text"}
            prop={"userName"}
            label="Username"
            handleChange={this.handleChange}
            handleErrors={this.handleErrors}
            validInput={UserModel.validRegistration}
            serverError={serverError}
          ></MyInput>

          <Row>
            <Col>
              <Button color="secondary" variant="contained" onClick={prevStep}>
                Back
              </Button>
            </Col>
            <Col style={{ textAlign: "right" }}>
              <Button
                color="primary"
                variant="contained"
                onClick={this.nextStep}
              >
                Continue
              </Button>
            </Col>
          </Row>
        </Form>
      </React.Fragment>
    );
  }

  public handleChange = (prop: string, input: string) => {
    this.setState({ serverError: "" });
    this.props.handleChange(prop, input);
  };

  public nextStep = async () => {
    const user = { ...this.props.user };
    const errors = { ...this.state.errors };

    if (loginLegal(user, errors)) {
      return;
    }

    // sent request
    const response = await this.addUser();
    if (this.handleServerResponse(response)) {
      return;
    }

    if (this.props.nextStep) {
      this.props.nextStep();
    }
  };

  public getPassword = () => {
    const password = generator.generate({
      length: 10,
      numbers: true
    });
    this.setState({ password });
    this.handleChange("password", password);
  };

  public handleServerResponse = response => {
    switch (typeof response) {
      case "string":
        this.setState({ serverError: response });
        return true;
      case "object":
        // save user to localStorage
        localStorage.setItem("user", JSON.stringify(response));
        return false;
    }
  };
}

export default PasswordUsername;
