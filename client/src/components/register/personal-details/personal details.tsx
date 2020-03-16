import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import { UserModel } from "../../../models/user-model";
import Row from "react-bootstrap/Row";
import MyInput from "../../my-input/my-input";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import "./personal-details.scss";

interface PersonalDetailsProps {
  user: UserModel;
  handleChange(prop: string, input: string): void;
  nextStep?(): void;
  prevStep?(): void;
}

interface PersonalDetailsState {
  errors: {
    firstName: string;
    lastName: string;
  };
}

export class PersonalDetails extends Component<
  PersonalDetailsProps,
  PersonalDetailsState
> {
  constructor(props: PersonalDetailsProps) {
    super(props);

    this.state = {
      errors: {
        firstName: "",
        lastName: ""
      }
    };
  }

  render() {
    const { user } = this.props;
    return (
      <Form>
        <Row className="card-header">
          <h2>Personal Details</h2>
        </Row>
        <MyInput
          value={user.firstName || ""}
          label="First Name"
          handleChange={this.handleChange}
          prop="firstName"
          handleErrors={this.handleErrors}
        ></MyInput>
        <MyInput
          value={user.lastName || ""}
          label="Last Name"
          handleChange={this.handleChange}
          handleErrors={this.handleErrors}
          prop="lastName"
        ></MyInput>
        <Row>
          <Col style={{ textAlign: "right" }}>
            <Button color="primary" variant="contained" onClick={this.nextStep}>
              Continue
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }

  public handleChange = (prop: string, input: string) => {
    this.props.handleChange(prop, input);
  };

  public nextStep = () => {
    const errors = { ...this.state.errors };
    if (
      errors.firstName.length > 0 ||
      errors.lastName.length > 0 ||
      this.props.user.firstName === undefined ||
      this.props.user.lastName === undefined
    ) {
      return;
    }
    if (this.props.nextStep) {
      this.props.nextStep();
    }
  };

  public handleErrors = (prop: string, error: string) => {
    const errors = { ...this.state.errors };
    errors[prop] = error;
    if (error.length > 0) {
      this.setState({ errors });
      return;
    }
    this.setState({ errors });
  };
}

export default PersonalDetails;
