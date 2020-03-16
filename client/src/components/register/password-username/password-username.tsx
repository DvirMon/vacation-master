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
import generator from "generate-password";

interface PasswordUsernameProps {
  user: UserModel;
  handleChange(prop: string, input: string): void;
  nextStep?(): void;
  prevStep?(): void;
}

interface PasswordUsernamesState {
  errors: {
    userName: string;
    password: string;
  };
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
      errors: {
        userName: "",
        password: ""
      },
      password: "",
      serverError:  ""
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
      <Form>
        <Row className="card-header">
          <h2>Username And Password</h2>
        </Row>
        <MyInput
          type={"text"}
          value={user.userName || ""}
          label="Username"
          handleChange={this.handleChange}
          prop={"userName"}
          handleErrors={this.handleErrors}
          serverError={serverError}
        ></MyInput>

        <MyInput
          value={user.password || password}
          label="Password (8-24 characters)"
          icon={
            <Tooltip title="Generate strong password" placement="right">
              <IconButton onClick={this.getPassword}>
                <LockOutlinedIcon />
              </IconButton>
            </Tooltip>
          }
          handleChange={this.handleChange}
          prop={"password"}
          handleErrors={this.handleErrors}
        ></MyInput>
        <Row>
          <Col>
            <Button color="secondary" variant="contained" onClick={prevStep}>
              Back
            </Button>
          </Col>
          <Col style={{ textAlign: "right" }}>
            <Button color="primary" variant="contained" onClick={this.nextStep}>
              Continue
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }

  public handleChange = (prop: string, input: string) => {
    this.setState({ serverError : "" });
    this.props.handleChange(prop, input);
  };

  public nextStep = async () => {
    if (this.formLegal()) {
      return;
    }

    // sent request
    const response = await this.addUser();

    if (this.handleResponse(response)) {
      return;
    }

    if (this.props.nextStep) {
      this.props.nextStep();
    }
  };

  public formLegal = () => {
    const errors = { ...this.state.errors };
    if (
      errors.userName.length > 0 ||
      errors.password.length > 0 ||
      this.props.user.userName === undefined ||
      this.props.user.password === undefined
    ) {
      return true;
    }
    return false;
  };

  public getPassword = () => {
    const password = generator.generate({
      length: 10,
      numbers: true
    });
    this.setState({ password });
    this.handleChange("password", password);
  };

  public handleResponse = response => {
    switch (typeof response) {
      case "string":
        this.setState({ serverError : response });
        return true;
      case "object":
        // save user to localStorage
        localStorage.setItem("user", JSON.stringify(response));
        return false;
    }
  };
}

export default PasswordUsername;
