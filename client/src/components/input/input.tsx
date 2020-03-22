import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import { store } from "../../redux/store/store";
import { Action } from "../../redux/action/action";
import { ActionType } from "../../redux/action-type/action-type";
import "./input.scss";
import { setObjectForSchema } from "../../services/validation";

export interface InputProps {
  width?: number;
  value?: string | number;
  schema?: {};
  type?: string;
  prop?: string;
  label?: string;
  placeholder?: string;
  autoFocus?: boolean;
  fullWidth?: boolean;
  startIcon?: any;
  passwordIcon?: any;
  serverError?: string;

  handleChange?(): void;
  handleErrors?(prop: string, error?: string): void;
  validInput?(object: {}): string;
}

export interface InputState {
  errorMessage: string;
  on: boolean;
  success: boolean;
  danger: boolean;
  error: boolean;
}

class Input extends Component<InputProps, InputState> {
  constructor(props: InputProps) {
    super(props);

    this.state = {
      errorMessage: "",
      on: false,
      success: false,
      danger: false,
      error: false
    };
  }

  render() {
    const {
      width,
      value,
      type,
      prop,
      label,
      autoFocus,
      fullWidth,
      startIcon,
      passwordIcon,
      placeholder,
      serverError
    } = this.props;
    const { error, errorMessage, success, danger } = this.state;

    return (
      <Grid container spacing={3} alignItems="flex-end">
        <Grid item>{startIcon}</Grid>
        <Grid className="has-success" item xs={10}>
          <TextField
            type={type}
            autoFocus={autoFocus}
            fullWidth={fullWidth}
            label={label}
            error={error}
            onChange={this.handleChange(prop)}
            onBlur={this.handleBlur(prop)}
            onFocus={this.handleFocus(prop)}
            InputProps={{
              endAdornment: passwordIcon
            }}
            helperText={errorMessage || serverError}
          />
        </Grid>
      </Grid>
    );
  }

  public handleChange = (prop: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const input = event.target.value;

    // save in store
    const action: Action = {
      type: ActionType.updateField,
      payloud: { prop, input }
    };
    store.dispatch(action);

    //
    if (this.props.handleChange) {
      this.props.handleChange();
    }
  };

  public handleBlur = (prop: string) => (
    event: React.FocusEvent<HTMLInputElement>
  ): void => {
    const input = event.target.value;
    this.validInput(input, prop);
    this.setState({ on: true });
  };

  public handleFocus = (prop: string) => (
    event: React.FocusEvent<HTMLInputElement>
  ): void => {
    const on = this.state.on;
    if (on === true) {
      const input = event.target.value;
      this.validInput(input, prop);
    }
  };

  public validInput = (input: string, prop: string) => {
    let schema = {};

    if (this.props.schema) {
      schema = { ...this.props.schema };
    }

    const validSchema = setObjectForSchema(schema, prop, input);

    const errorMessage = this.props.validInput(validSchema);

    this.handleErrors(errorMessage, prop);
  };

  public handleErrors = (errorMessage: string, prop: string) => {

    if (errorMessage) {
      this.setState({ errorMessage, error: true });
      this.props.handleErrors(prop, errorMessage);
      return;
    }

    if (this.props.serverError) {
      this.setState({ error: true });
      return;
    }

    this.setState({
      errorMessage: "",
      error: false
    });
    this.props.handleErrors(prop, "");
  };
}

export default Input;
