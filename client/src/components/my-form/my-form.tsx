import React, { Component } from "react";
import MyInput from "../my-input/my-input";
import { VacationModel } from "../../models/vacations-model";
import { VacationErrors } from "../../models/error-model";
import { uploadImage } from "../../services/server";
import DatePicker from "../date-picker/date-picker";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import "./my-form.scss";

interface MyFormProps {
  vacation: VacationModel;
  handleChange(prop: string, input: string): void;
  handleErrors(prop: string, error?: string): void;
  handleVacation(): any;
}

interface MyFormState {
  errors: VacationErrors;
  date: {
    startDate: string;
    endDate: string;
  };
}

export class MyForm extends Component<MyFormProps, MyFormState> {
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

  public getImage = async event => {

    const selectedFile = event.target.files[0];
    const fd = new FormData();
    
    fd.append("image", selectedFile);

    const url = `http://localhost:3000/api/vacations/upload-image`;
    const response = await uploadImage(url, fd);
    this.props.handleChange("image", response);
  };

  public componentDidMount = () => {
    
    setTimeout(() => {
      if (this.props.vacation.startDate || this.props.vacation.endDate) {
        const date = { ...this.state.date };
        date.startDate = this.props.vacation.startDate;
        date.endDate = this.props.vacation.endDate;
        this.setState({ date });
        return;
      }
    }, 300); 
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
          <Row>
            <MyInput
              width={5}
              value={vacation.destination || ""}
              type="text"
              prop="destination"
              label="Destination"
              handleChange={this.handleChange}
              handleErrors={this.handleErrors}
              validInput={VacationModel.validVacation}
            />
            <MyInput
              width={5}
              value={vacation.price || ""}
              type="number"
              prop="price"
              label="Price"
              handleChange={this.handleChange}
              handleErrors={this.handleErrors}
              validInput={VacationModel.validVacation}
            />
          </Row>
          <Row>
            <Col sm={4}>
              <DatePicker
                dateNow={vacation.startDate || ""}
                prop="startDate"
                label="Departing"
                schema={date}
                handleChange={this.handleChange}
                handleErrors={this.handleErrors}
                validInput={VacationModel.validVacation}
              />
            </Col>
            <Col sm={4}  className="justify-content-center">
              <DatePicker
                dateNow={vacation.endDate || ""}
                prop="endDate"
                label="Returning"
                schema={date}
                handleChange={this.handleChange}
                handleErrors={this.handleErrors}
                validInput={VacationModel.validVacation}
              />
            </Col>
            <Col sm={3} className="d-flex align-self-end justify-content-end">
              <input 
                className="input-file btn btn-primary"
                type="file"
                id="upload-file"
                accept="image/*"
                onChange={this.getImage}
              />
              <label className="upload-button" htmlFor="upload-file">
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
            </Col>
          </Row>
          <Row className="pos">
            <Col sm={8}>
              <textarea
                className="form-control text-area"
                value={vacation.description || ""}
                cols={8}
                rows={5}
                placeholder="add description"
                onChange={this.handleTextArea("description")}
              ></textarea>
            </Col>
            <Col
              sm={4}
              className="d-flex align-self-end justify-content-center"
            >
              <Button
                variant="contained"
                color="primary"
                onClick={this.addVacation}
              >
                Confirm & Send
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }

  public addVacation = () => {
    if (this.props.handleVacation) {
      this.props.handleVacation();
    }
  };

  public handleChange = (prop: string, input: string) => {
    this.props.handleChange(prop, input);
  };

  public handleTextArea = (prop: string) => event => {
    const input = event.target.value;
    this.props.handleChange(prop, input);
  };

  public handleErrors = (prop: string, error: string) => {
    if (this.props.handleErrors) {
      this.props.handleErrors(prop, error);
    }
  };
}

export default MyForm;
