import React, { Component } from "react";

import "date-fns";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

import { ValidationService } from "../../services/validation-service";

interface DatePickerState {
  disabledDate: Date;
  selectedDate: Date;
  errorMessage: string;
  error: boolean;
  on: boolean;
}

interface DatePickerProps {
  dateNow?: string;
  schema?: {};
  label: string;
  disabledDate?: string;
  prop: string;
  helperText?: string;
  handleChange(prop: string, input: string): void;
  handleErrors?(prop: string, error?: string): void;
  validInput?(schema: {}): string;
}

export class DatePicker extends Component<DatePickerProps, DatePickerState> {

  private validationService : ValidationService = new ValidationService()

  constructor(props) {
    super(props);

    this.state = {
      disabledDate: new Date(),
      selectedDate: new Date(),
      error: false,
      errorMessage: "",
      on: false,
    };
  }

  public componentDidMount = () => {
    setTimeout(() => {

      if (this.props.dateNow) {
        const date = new Date(this.props.dateNow);
        this.handleDateChange(date, false);
        this.handleDisabledEbdDate();
        
      } else {
        const date = new Date();
        this.handleDateChange(date, false);
      }
    }, 1000);
  };
 
  private handleDisabledEbdDate() {
    if (this.props.disabledDate) {
      const disabledDate = new Date(this.props.disabledDate);
      this.setState({ disabledDate });
    }
  }

  render() {
    const { selectedDate, disabledDate, error, errorMessage } = this.state;
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
            shouldDisableDate={this.disablePrevDates(disabledDate)}
            onChange={this.handleDateChange}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
            helperText={errorMessage ? errorMessage : helperText}
          />
        </Grid>
      </MuiPickersUtilsProvider>
    );
  }

  public handleDateChange = (date: Date | null, value) => {
    this.setState({ selectedDate: date });

    const input = date.toISOString().slice(0, 19).replace("T", " ");

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
      schema = this.validationService.setObjectForSchema(
        this.props.schema,
        prop,
        input
      );
    } else {
      schema = this.validationService.setObjectForSchema(schema, prop, input);
    }

    const errorMessage = this.props.validInput(schema);
    this.handleErrors(errorMessage);
  };

  public handleErrors = (errorMessage: string): void => {
    errorMessage
      ? this.setState({ errorMessage, error: true })
      : this.setState({ errorMessage: "", error: false });
  };

  private disablePrevDates(startDate) {
    const startSeconds = Date.parse(startDate);
    return (date) => {
      return Date.parse(date) < startSeconds;
    };
  }
}

export default DatePicker;
