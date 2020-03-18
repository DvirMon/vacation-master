import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import "./my-form.scss";
import MyInput from "../../my-input/my-input";
import Row from "react-bootstrap/Row";
import { VacationModel } from "../../../models/vacations-model";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import TextField from "@material-ui/core/TextField";
import { VacationErrors } from "../../../models/error-model";
import { postRequest, uploadImage } from "../../../services/server";
import DatePicker from "../../date-picker/date-picker";

interface MyFormProps {
  vacation: VacationModel;
  handleChange(prop: string, input: string): void;
  handleErrors(prop: string, error?: string): void;
  addVacation(): any;
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
            <Col sm={3}>
              <DatePicker
                prop="startDate"
                label="From"
                schema={date}
                handleChange={this.handleChange}
                handleErrors={this.handleErrors}
                validInput={VacationModel.validVacation}
              />
            </Col>
            <Col sm={4}>
              <DatePicker
                prop="endDate"
                label="To"
                schema={date}
                handleChange={this.handleChange}
                handleErrors={this.handleErrors}
                validInput={VacationModel.validVacation}
              />
            </Col>
            <Col sm={3} className="d-flex align-self-end">
              <input
                type="file"
                accept="image/*"
                onChange={this.getImage}
              ></input>
            </Col>
          </Row>
          <Row className="pos">
            <Col sm={8}>
              <textarea
                className="form-control text-area"
                cols={8}
                rows={5}
                placeholder="add description"
                onChange={this.handleTextArea("description")}
                // validInput={VacationModel.validVacation}
              ></textarea>
            </Col>
            <Col
              sm={4}
              className="d-flex align-self-end justify-content-center"
            >
              <Button onClick={this.addVacation}>Confirm & Send</Button>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }

  public addVacation = () => {

    if (this.props.addVacation) {
      this.props.addVacation();
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
