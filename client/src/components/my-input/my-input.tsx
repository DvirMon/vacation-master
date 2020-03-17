import React, { Component } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import FormLabel from "react-bootstrap/FormLabel";
import { UserModel } from "../../models/user-model";
import { isRequired, setObjectForSchema } from "../../services/validation";
import { Typography } from "@material-ui/core";
import clsx from "clsx";
import "./my-input.scss";

export interface MyInputProps {
  width: number;
  value: string | number;
  type?: string;
  prop?: string;
  label?: string;
  placeholder?: string;
  icon?: any;
  passwordIcon?: any;
  serverError?: string;

  handleChange(prop: string, input: string): void;
  handleErrors?(prop: string, error?: string): void;
  validInput?(object: {}): string;
}

export interface MyInputState {
  // user: UserModel;
  error: string;
  on: boolean;
  success: boolean;
  danger: boolean;
}

class MyInput extends Component<MyInputProps, MyInputState> {
  constructor(props: MyInputProps) {
    super(props);

    this.state = {
      // user: new UserModel(),
      error: "",
      on: false,
      success: false,
      danger: false
    };
  }

  render() {
    const {
      width,
      value,
      prop,
      label,
      type,
      icon,
      passwordIcon,
      placeholder,
      serverError
    } = this.props;
    const { error, success, danger } = this.state;

    return (
      <Col
        sm={width}
        md={width}
        className={clsx({
          "my-input": true,
          "form-group": true,
          "has-default": true,
          "has-success": success,
          "has-danger": danger
        })}
      >
        <FormLabel className="label">{label}</FormLabel>
        <Typography
          style={{
            textAlign: "right",
            position: "relative",
            top: "2vh",
            zIndex: 1
          }}
        >
          {passwordIcon}
        </Typography>
        <InputGroup size="lg" className="mb-3">
          <InputGroup.Prepend>
            <InputGroup.Text>{icon}</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            value={value}
            type={type}
            aria-label={label}
            placeholder={placeholder}
            onChange={this.handleChange(prop)}
            onBlur={this.handleBlur(prop)}
            onFocus={this.handleFocus(prop)}
            autoComplete="off"
          />
        </InputGroup>
        <Typography>{serverError || error}</Typography>
      </Col>
    );
  }

  public handleBlur = (prop: string) => (
    event: React.FocusEvent<HTMLInputElement>
  ): void => {
    const input = event.target.value;
    const objectScheme = setObjectForSchema(prop, input);
    this.validInput(prop, objectScheme);
    this.setState({ on: true });
  };

  public handleFocus = (prop: string) => (
    event: React.FocusEvent<HTMLInputElement>
  ): void => {
    const on = this.state.on;
    if (on === true) {
      const input = event.target.value;
      const objectScheme = setObjectForSchema(prop, input);
      this.validInput(prop, objectScheme);
    }
  };

  public handleChange = (prop: string) => event => {

    const on = this.state.on;
    const input = event.target.value;

    if (on === true) {
      
      const error = isRequired(input);
      this.setState({ error });
      
      if (error) {
        this.props.handleErrors(prop, error);

      } else {
        const objectScheme = setObjectForSchema(prop, input);
        this.validInput(prop, objectScheme);
      }
    }
    // update objectScheme values in parent
    this.props.handleChange(prop, input);
  };

  public validInput = (prop: string, objectScheme: {}) => {
    
    const error = this.props.validInput(objectScheme);
    const serverError = this.props.serverError;


    if (error) {
      this.setState({ error, success: false, danger: true });
      this.props.handleErrors(prop, error);
      return;
    }

    if (serverError) {
      this.setState({ success: false, danger: true });
      return;
    }

    this.setState({ error: "", success: true, danger: false });
    this.props.handleErrors(prop, "");
  };
}

export default MyInput;
