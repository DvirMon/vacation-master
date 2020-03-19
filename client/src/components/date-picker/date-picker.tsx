import React, { Component } from "react";
import "date-fns";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";
import { setObjectForSchema } from "../../services/validation";

interface DatePickerState {
  selectedDate: Date;
  setSelectedDate: Date;
  error: string;
  on: boolean;
  success: boolean;
  danger: boolean;
  isLoading: boolean;
}

interface DatePickerProps {
  dateNow?: string;
  schema: {};
  label: string;
  prop: string;
  handleChange(prop: string, input: string): void;
  handleErrors(prop: string, error?: string): void;
  validInput?(schema: {}): string;
}

export class DatePicker extends Component<DatePickerProps, DatePickerState> {
  constructor(props) {
    super(props);

    this.state = {
      selectedDate: new Date(),
      setSelectedDate: new Date(),
      error: "",
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
        this.setState({ selectedDate: date });
      }
    }, 300);
    
    const date = new Date();
    this.handleDateChange(date, false);
  };

  render() {
    const { selectedDate, error } = this.state;
    const { label } = this.props;

    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Grid container justify="space-around">
          <KeyboardDatePicker
            margin="normal"
            id="date-picker-dialog"
            label={label}
            format="MM/dd/yyyy"
            value={selectedDate}
            onChange={this.handleDateChange}
            KeyboardButtonProps={{
              "aria-label": "change date"
            }}
            helperText={error}
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

    const schema = setObjectForSchema(this.props.schema, prop, input);

    const error = this.props.validInput(schema);

    this.handleErrors(error, prop);
  };

  public handleErrors = (error: string, prop: string): boolean => {
    if (error) {
      this.setState({ error, success: false, danger: true });
      this.props.handleErrors(prop, error);
      return;
    }

    this.setState({ error: "", success: true, danger: false });
    this.props.handleErrors(prop, "");
  };
}

export default DatePicker;