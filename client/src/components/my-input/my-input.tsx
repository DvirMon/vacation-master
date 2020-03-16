import React, { Component } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import FormLabel from "react-bootstrap/FormLabel";
import { UserModel } from "../../models/user-model";
import { isRequired } from "../../services/validation";
import { Typography } from "@material-ui/core";
import clsx from "clsx";
import "./my-input.scss";

export interface MyInputProps {
  value?: string;
  prop?: string;
  icon?: any;
  label: string;
  type?: string;
  serverError?: string;
  handleChange(prop: string, input: string): void;
  handleErrors?(prop: string, error?: string): void;
}

export interface MyInputState {
  user: UserModel;
  error: string;
  on: boolean;
  success: boolean;
  danger: boolean;
}

class MyInput extends Component<MyInputProps, MyInputState> {
  constructor(props: MyInputProps) {
    super(props);

    this.state = {
      user: new UserModel(),
      error: "",
      on: false,
      success: false,
      danger: false
    };
  }

  render() {
    const { value, prop, icon, label, type, serverError } = this.props;
    const { error, success, danger } = this.state;

    return (
      <Row className="my-input">
        <Col
          sm={11}
          className={clsx({
            "form-group": true,
            "has-default": true,
            "has-success": success,
            "has-danger": danger
          })}
        >
          <FormLabel className="label">{label}</FormLabel>
          <InputGroup.Prepend style={{ textAlign: "right" }}>
            <InputGroup.Text>{icon}</InputGroup.Text>
          </InputGroup.Prepend>
          <InputGroup size="lg" className="mb-3">
            <FormControl
              value={value}
              type={type}
              aria-label={label}
              onChange={this.handleChange(prop)}
              onBlur={this.handleBlur(prop)}
              onFocus={this.handleFocus(prop)}
              autoComplete="off"
            />
          </InputGroup>
          <Typography>{serverError || error}</Typography>
        </Col>
      </Row>
    );
  }

  public setUser = (prop: string, input: string) => {
    const user = {};
    user[prop] = input;
    return user;
  };

  public handleBlur = (prop: string) => (
    event: React.FocusEvent<HTMLInputElement>
  ): void => {
    const input = event.target.value;
    const user = this.setUser(prop, input);
    this.validInput(prop, user);
    this.setState({ on: true });
  };

  public handleFocus = (prop: string) => (
    event: React.FocusEvent<HTMLInputElement>
  ): void => {
    const on = this.state.on;
    if (on === true) {
      const input = event.target.value;
      const user = this.setUser(prop, input);
      this.validInput(prop, user);
    }
  };

  public handleChange = (prop: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const on = this.state.on;
    const input = event.target.value;

    if (on === true) {
      const error = isRequired(input);
      this.setState({ error });
      if (error) {
        this.props.handleErrors(prop, error);
      } else {
        const user = this.setUser(prop, input);
        this.validInput(prop, user);
      }
    }
    // update user values in parent
    this.props.handleChange(prop, input);
  };

  public validInput = (prop: string, user: UserModel) => {

    const serverError = this.props.serverError
    const error = UserModel.validRegistration(user);

    if (error) {
      this.setState({ error, success: false, danger: true });
      this.props.handleErrors(prop, error);
      return;
    }

    if (serverError) {
      this.setState({success: false, danger: true });
      return;
    }

    this.setState({ error: "", success: true, danger: false });
    this.props.handleErrors(prop, "");
  };
}

export default MyInput;
