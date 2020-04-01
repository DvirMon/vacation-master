import React, { Component } from "react";

import Grid from "@material-ui/core/Grid";
import DatePicker from "../date-picker/date-picker";
import Button from "@material-ui/core/Button";
import Form from "react-bootstrap/Form";

import MyInput from "../my-input/my-input";

import { VacationModel } from "../../models/vacations-model";
import { VacationErrors } from "../../models/error-model";

import "./my-form.scss";

interface MyFormProps {
  vacation: VacationModel;
  handleChange(prop: string, input: any): void;
  handleErrors?(prop: string, error?: string): void;
  handleVacation(): any;
  handleImage(preview: string): void;
}

interface MyFormState {
  errors: VacationErrors;
  date: {
    startDate: string;
    endDate: string;
  };
}

export class MyForm extends Component<MyFormProps, MyFormState> {
  private fileInput: HTMLInputElement;

  constructor(props: MyFormProps) {
    super(props);

    this.state = {
      errors: null,
      date: {
        startDate: this.props.vacation.startDate,
        endDate: this.props.vacation.endDate
      }
    };
  }

  public componentDidMount = () => {
    setTimeout(() => {
      this.updateDate();
    }, 1500);
  };

  public updateDate = () => {
    const date = { ...this.state.date };
    date.startDate = this.props.vacation.startDate;
    date.endDate = this.props.vacation.endDate;
    this.setState({ date });
  };

  render() {
    const { vacation } = this.props;
    const { date } = this.state;

    return (
      <div className="my-form">
        <iframe name="hidden-iframe" style={{ display: "none" }}></iframe>
        <Form
          action="/upload-image"
          method="post"
          encType="multipart/form-data"
          target="hidden-iframe"
        >
          <Grid container spacing={2} className="pos">
            <MyInput
              width={5}
              value={vacation.destination || ""}
              fullWidth={true}
              type="text"
              prop="destination"
              label="Destination"
              handleChange={this.handleChange}
              handleErrors={this.handleErrors}
              validInput={VacationModel.validVacation}
              helperText={"Enter vacation destination"}
            />
            <MyInput
              width={5}
              fullWidth={true}
              value={vacation.price || ""}
              type="number"
              prop="price"
              label="Price"
              handleChange={this.handleChange}
              validInput={VacationModel.validVacation}
              helperText={"Enter vacation price"}
            />
          </Grid>
          <Grid container spacing={2} className="pos">
            <Grid item xs={3}>
              <DatePicker
                dateNow={vacation.startDate || ""}
                prop="startDate"
                label="Departing"
                handleChange={this.handleChange}
                validInput={VacationModel.validVacation}
                helperText={"Enter departing date"}
              />
            </Grid>
            <Grid item xs={5} className="justify-content-center">
              <DatePicker
                dateNow={vacation.endDate || ""}
                prop="endDate"
                label="Returning"
                schema={date}
                handleChange={this.handleChange}
                validInput={VacationModel.validVacation}
                helperText={"Enter returning date"}
              />
            </Grid>
            <Grid
              item
              xs={3}
              className="d-flex align-self-end justify-content-end"
            >
              <label className="upload-button">
                <input
                  className="input-file btn btn-primary"
                  type="file"
                  accept="image/*"
                  onChange={this.handleImage}
                  ref={fi => (this.fileInput = fi)}
                />
                <Button
                  className="upload-button"
                  component="span"
                  variant="contained"
                  color="primary"
                  disableRipple={true}
                  disableFocusRipple={true}
                >
                  Choose a file
                </Button>
              </label>
            </Grid>
          </Grid>
          <Grid container spacing={2} className="pos">
            <MyInput
              width={8}
              value={vacation.description || ""}
              type="text"
              label="Description"
              prop="description"
              placeholder="add description"
              fullWidth={true}
              multiline={true}
              rows={5}
              handleChange={this.handleChange}
              validInput={VacationModel.validVacation}
              helperText={"Enter vacation description"}
            ></MyInput>
            <Grid
              item
              xs={4}
              className="d-flex align-self-end justify-content-center"
            >
              <Button
                variant="contained"
                color="primary"
                onClick={this.addVacation}
              >
                Confirm & Send
              </Button>
            </Grid>
          </Grid>
        </Form>
      </div>
    );
  }

  public addVacation = () => {
    if (this.props.handleVacation) {
      this.props.handleVacation();
    }
  };

  public handleChange = (prop: string, input: any) => {
    if (prop === "startDate") {
      const date = { ...this.state.date };
      date.startDate = input;
      this.setState({ date });
    }

    if (this.props.handleChange) {
      this.props.handleChange(prop, input);
    }
  };

  public handleErrors = (prop: string, error: string) => {
    if (this.props.handleErrors) {
      this.props.handleErrors(prop, error);
    }
  };

  public handleImage = async event => {
    const image = event.target.files[0];
    if (!image) {
      alert("Please choose image");
      return;
    }

    // Display image on client:
    try {
      const reader = new FileReader();
      reader.onload = args => {
        if (this.props.handleImage) {
          this.props.handleImage(args.target.result.toString());
        }
      };
      reader.readAsDataURL(image); // Read the image.
      // update image in values
      this.handleChange("image", image);
      return;
    } catch (err) {
      console.log(err);
    }
  };
}

export default MyForm;
