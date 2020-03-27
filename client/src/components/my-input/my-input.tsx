import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { isRequired, setObjectForSchema } from "../../services/validationService";
import "./my-input.scss";

export interface MyInputProps {
  width?: number;
  value?: string | number;
  schema?: {};
  type: string;
  prop?: string;
  label?: string;
  placeholder?: string;
  autoFocus?: boolean;
  fullWidth?: boolean;
  passwordIcon?: any;
  serverError?: string; 
  serverErrorStyle?: boolean;
  required? : boolean
  helperText? : string
  rows?: number;
  multiline? : boolean  

  handleChange?(prop: string, input: string): void;
  handleErrors?(prop: string, error?: string): void;
  validInput?(object: {}): string;
}

export interface MyInputState {
  errorMessage: string;
  on: boolean;
  success: boolean;
  danger: boolean;
  error: boolean;
}

class MyInput extends Component<MyInputProps, MyInputState> {
  constructor(props: MyInputProps) {
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
      passwordIcon,
      placeholder,
      helperText,
      serverError,
      serverErrorStyle,
      required,
      multiline,
      rows
    } = this.props;
    const { error, errorMessage } = this.state;

    return ( 
        <Grid item xs={width}>
          <TextField
            value={value}
            type={type} 
            autoFocus={autoFocus}
            fullWidth={fullWidth}
            label={label}
            placeholder={placeholder}
            error={error ? error : serverErrorStyle}
            required={required}
            multiline={multiline} 
            rows={rows}
            onChange={this.handleChange(prop)}
            onBlur={this.handleBlur(prop)}
            onFocus={this.handleFocus(prop)}
            InputProps={{
              endAdornment: passwordIcon
            }} 
            helperText={errorMessage || serverError ? errorMessage || serverError : helperText}
          />
      </Grid>
    );
  }

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


  public handleChange = (prop: string) => event => {
    const on = this.state.on;
    const input = event.target.value;

    if (on === true) {
      const errorMessage = isRequired(input);
      this.setState({ errorMessage });

      if (errorMessage) {
        this.props.handleErrors(prop, errorMessage);
      } else {
        this.validInput(input, prop);
      }
    }

    // update object values in parent
    this.props.handleChange(prop, input);
  };

  public validInput = (input: string, prop: string) => {
    
    const schema = {};
    const validSchema = setObjectForSchema(schema, prop, input);
    const error = this.props.validInput(validSchema);
    this.handleErrors(error, prop);
    
  };

  public handleErrors = (errorMessage: string, prop: string) => {
    
    const serverError = this.props.serverError;

    // joi errors
    if (errorMessage) {
      this.setState({
        errorMessage,
        error: true,
        success: false,
        danger: true
      });
      this.props.handleErrors(prop, errorMessage);
      return;
    }
    
    // server errors
    if (serverError) {
      this.setState({ error: true, success: false, danger: true });
      return;
    }
    
    // no errors
    this.setState({
      errorMessage: "",
      error: false,
      success: true,
      danger: false
    });
    
    this.props.handleErrors(prop, "");
  };
}

export default MyInput;
