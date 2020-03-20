import React, { Component } from "react";
import clsx from "clsx";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import TextField from "@material-ui/core/TextField";
import FormLabel from "react-bootstrap/FormLabel";
import { UserModel } from "../../models/user-model";
import { isRequired, setObjectForSchema } from "../../services/validation";
import { Typography } from "@material-ui/core";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import AccountCircle from "@material-ui/icons/AccountCircle";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import { store } from "../../redux/store/store";
import { Action } from "../../redux/action/action";
import { ActionType } from "../../redux/action-type/action-type";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import "./input.scss";

export interface InputProps {
  width: number;
  autoFocus?: number;
  value: string | number;
  schema?: {};
  type?: string;
  prop?: string;
  label?: string;
  placeholder?: string;
  startIcon?: any;
  passwordIcon?: any;
  serverError?: string;

  handleChange(prop: string, input: string): void;
  handleErrors(prop: string, error?: string): void;
  validInput?(object: {}): string;
}

export interface InputState {
  error: string;
  on: boolean;
  success: boolean;
  danger: boolean;
  showPassword: boolean;
}

class Input extends Component<InputProps, InputState> {
  constructor(props: InputProps) {
    super(props);

    this.state = {
      error: "",
      on: false,
      success: false,
      danger: false,
      showPassword: false
    };
  }

  render() {
    const {
      width,
      value,
      schema,
      prop,
      label,
      type,
      startIcon,
      passwordIcon,
      placeholder,
      serverError
    } = this.props;
    const { error, success, danger, showPassword } = this.state;

    return (
        <Grid className="t" spacing={6}>
          <Grid container   spacing={3} alignItems="flex-end">
            <Grid item>
              {startIcon}
              <AccountCircle />
            </Grid>
            <Grid className="has-success" item xs={6}>
              <TextField
                type={"text"}
                label="Username"
                onChange={this.handleChange(prop)} 
                onBlur={this.handleBlur(prop)}
                onFocus={this.handleFocus(prop)}
                autoFocus={true}
                fullWidth={true}
                error={false} 
                
                />
            </Grid>
          </Grid>
          <Grid container spacing={3} alignItems="flex-end">
            <Grid item>
              <AccountCircle />
            </Grid>
            <Grid item xs={6}>
              <TextField
                type={showPassword ? "text" : "password"}
                label="Password"
                onChange={this.handleChange("password")}
                fullWidth={true}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {passwordIcon}
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={this.handleClickShowPassword}
                        onMouseDown={this.handleMouseDownPassword}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />{" "}
            </Grid>
          </Grid>
        </Grid>
    ); 
  }

  public handleChange = (prop: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const input = event.target.value;
    const action: Action = {
      type: ActionType.updateField,
      payloud: { prop, input }
    };
    store.dispatch(action);
  };

  public handleBlur = (prop: string) => (
    event: React.FocusEvent<HTMLInputElement>
  ): void => {
    const input = event.target.value;
    // this.validInput(input, prop);
    this.setState({ on: true });
  };

  public handleFocus = (prop: string) => (
    event: React.FocusEvent<HTMLInputElement>
  ): void => {
    const on = this.state.on;
    if (on === true) {
      const input = event.target.value;
      // this.validInput(input, prop);
    }
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

  public validInput = (input: string, prop: string) => {
    let schema = {};

    if (this.props.schema) {
      schema = { ...this.props.schema };
    }

    const validSchema = setObjectForSchema(schema, prop, input);

    const error = this.props.validInput(validSchema);

    this.handleErrors(error, prop);
  };

  public handleErrors = (error: string, prop: string) => {
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

export default Input;
