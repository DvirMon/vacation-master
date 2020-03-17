import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import "./my-form.scss";
import MyInput from "../../my-input/my-input";
import Row from "react-bootstrap/Row";
import { VacationModel } from "../../../models/vacations-model";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

interface MyFormProps {
  vacation: VacationModel;
  handleChange(prop: string, input: string): void;
}

interface MyFormState {}

export class MyForm extends Component<MyFormProps, MyFormState> {
  constructor(props: MyFormProps) {
    super(props);

    this.state = {};
  }

  render() {
    const { vacation } = this.props;

    return (
      <div className="my-form">
        <Form action="">
          <Row>
            <MyInput
              width={5}
              value={vacation.destination || ""}
              type="text"
              prop="destination"
              label="Destination"
              handleChange={this.handleChange}
            />
            <MyInput
              width={5}
              type="number"
              value={vacation.price || ""}
              prop="price"
              label="Price"
              handleChange={this.handleChange}
            />
          </Row>
          <Row>
            <MyInput
              width={4}
              value={vacation.startDate || ""}
              type="date"
              prop="startDate"
              label="From"
              handleChange={this.handleChange}
              // validInput={}
            />
            <MyInput
              width={4}
              value={vacation.endDate || ""}
              type="date"
              prop="endDate"
              label="To"
              handleChange={this.handleChange}
            />
            <Col
              sm={3}
              className="d-flex justify-content-center align-self-end pb-4"
            >
              <Button>Add Image</Button>
            </Col>
          </Row>
          <Row>
            <Col sm={9}>
              <textarea
                value={vacation.description || ""}
                className="form-control text-area"
                cols={3}
                rows={3}
                placeholder="add description"
                onChange={this.handleTextArea("description")}
              ></textarea>
            </Col>
            <Col sm={2} className="d-flex align-self-end pos">
              <Button>Add Vacation</Button>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }

  public handleChange = (prop: string, input: string) => {
    this.props.handleChange(prop, input);
  };

  public handleTextArea = (prop: string) => event => {
    const input = event.target.value;
    this.props.handleChange(prop, input);
  };
}

export default MyForm;
