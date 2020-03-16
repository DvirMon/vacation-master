import React, { Component } from "react";
import "./insert.scss";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import VacCard from "../../vac-card/vac-card";
import { VacationModel } from "../../../models/vacations-model";
import MyForm from "../my-form/my-form";

interface InsertState {
  vacation: VacationModel;
}

export class Insert extends Component<any, InsertState> {
  constructor(props: any) {
    super(props);

    this.state = {
      vacation: new VacationModel()
    };
  }

  render() {
    const { vacation } = this.state;
    return (
      <div className="insert">
        <Row>
          <Col sm="8">
            <MyForm />
          </Col>
          <Col sm="4">
            <VacCard vacation={vacation} user={false} accessToken={""} />
          </Col>
        </Row>
      </div>
    );
  }
}

export default Insert;
