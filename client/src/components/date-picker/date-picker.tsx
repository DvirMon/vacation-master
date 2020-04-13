import React, { Component } from "react";

import "date-fns";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";

import { ValidationService } from "../../services/validation-service";


interface DatePickerState {
  selectedDate: Date;
  setSelectedDate: Date;
  errorMessage: string;
  error: boolean;
  on: boolean;
  success: boolean;
  danger: boolean;
  isLoading: boolean;
}

interface DatePickerProps {
  dateNow?: string;
  schema?: {};
  label: string;
  prop: string;
  helperText?: string;
  handleChange(prop: string, input: string): void;
  handleErrors?(prop: string, error?: string): void;
  validInput?(schema: {}): string;
}

export class DatePicker extends Component<DatePickerProps, DatePickerState> {
  constructor(props) {
    super(props);

    this.state = {
      selectedDate: new Date(),
      setSelectedDate: new Date(),
      error: false,
      errorMessage: "",
      on: false,
      success: false,
      danger: false,
      isLoading: true
    };
  }

  public componentDidMount = () => {
    setTimeout(() => {
      if (this.props.dateNow) {
        const date = new Date(this.props.dateNow);
        this.handleDateChange(date, false);
      } else {
        const date = new Date();
        this.handleDateChange(date, false);
      }
    }, 1000);
  };

  render() {
    const { selectedDate, error, errorMessage } = this.state;
    const { label, helperText } = this.props;

    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Grid container justify="space-around">
          <KeyboardDatePicker
            margin="normal"
            id="date-picker-dialog"
            label={label}
            error={error}
            format="MM/dd/yyyy"
            value={selectedDate}
            onChange={this.handleDateChange}
            KeyboardButtonProps={{
              "aria-label": "change date"
            }}
            helperText={errorMessage ? errorMessage : helperText}
          />
        </Grid>
      </MuiPickersUtilsProvider>
    );
  }

  public handleDateChange = (date: Date | null, value) => {
    this.setState({ selectedDate: date });

    const input = date
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    if (value) {
      this.validInput(input, this.props.prop);
    }
   

    if (this.props.handleChange) {
      this.props.handleChange(this.props.prop, input);
    }
  };

  public validInput = (input: string, prop: string) => {
    let schema = {};

    if (this.props.schema) {
      schema = ValidationService.setObjectForSchema(this.props.schema, prop, input);
    } else {
      schema = ValidationService.setObjectForSchema(schema, prop, input);
    }

    const errorMessage = this.props.validInput(schema);

    this.handleErrors(errorMessage, prop);
  };

  public handleErrors = (errorMessage: string, prop: string): boolean => {
    if (errorMessage) {
      this.setState({
        errorMessage,
        error: true,
        success: false,
        danger: true
      });
      // this.props.handleErrors(prop, errorMessage);
      return;
    }

    this.setState({
      errorMessage: "",
      error: false,
      success: true,
      danger: false
    });

    // this.props.handleErrors(prop, "");
  };
}

export default DatePicker;
