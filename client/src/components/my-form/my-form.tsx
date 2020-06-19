import React, { Component } from "react";

import Grid from "@material-ui/core/Grid";
import DatePicker from "../date-picker/date-picker";
import Button from "@material-ui/core/Button";
import Form from "react-bootstrap/Form";

import MyInput from "../my-input/my-input";

import { VacationModel } from "../../models/vacations-model";

import "./my-form.scss";

interface MyFormProps {
  vacation: VacationModel;
  handleChange(prop: string, input: any): void;
  handleVacation(): any;
  handleImage(preview: string): void;
}

interface MyFormState {
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
      date: {
        startDate: this.props.vacation.startDate,
        endDate: this.props.vacation.endDate,
      },
    };
  }

  render() {
    const { vacation } = this.props;
    const { date } = this.state;

    return (
      <div className="my-form">
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
                disabledDate={vacation.startDate || ""}
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
              className="d-flex align-self-end justify-content-end mb-3"
            >
              <label className="upload-button">
                <input
                  className="input-file btn btn-primary"
                  type="file"
                  accept="image/*"
                  onChange={this.handleImage}
                  ref={(fi) => (this.fileInput = fi)}
                />
                <Button
                  className="upload-button"
                  component="span"
                  variant="contained"
                  color="primary"
                  disableRipple={true}
                  disableFocusRipple={true}
                >
                  Choose an image
                </Button>
              </label>
            </Grid>
          </Grid>
          <Grid container spacing={2} className="pos mb-3">
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
              className="d-flex align-self-end justify-content-center mb-3"
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

  // function to ass vacation
  public addVacation = () => {
    if (this.props.handleVacation) {
      this.props.handleVacation();
    }
  };
  // end of function

  // function to update vacation values
  public handleChange = (prop: string, input: any) => {
    
    if (prop === "startDate" || prop === "endDate") {
      this.handleDate(input, prop);
    }

    if (this.props.handleChange) {
      this.props.handleChange(prop, input);
    }
  };
  // end of function
 
  public handleDate = (input, prop) => {
    const date = { ...this.state.date };
    date[prop] = input;
    this.setState({ date });
  };
  // end of function

  // function to handle image file
  public handleImage = async (event) => {
    const image = event.target.files[0];

    if (!image) {
      alert("Please choose image");
      return;
    }

    try {
      this.displayImage(image);
      this.handleChange("image", image);
    } catch (err) {
      console.log(err);
    }
  };
  // end of function

  // Display image on client:
  public displayImage = (image) => {
    const reader = new FileReader();
    reader.onload = (args) => {
      if (this.props.handleImage) {
        this.props.handleImage(args.target.result.toString());
      }
    };
    reader.readAsDataURL(image);
  };
}
// end of function

export default MyForm;
