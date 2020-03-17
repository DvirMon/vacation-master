import React, { Component } from "react";
import "./insert.scss";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import VacCard from "../../vac-card/vac-card";
import { VacationModel } from "../../../models/vacations-model";
import MyForm from "../my-form/my-form";
import Container from "react-bootstrap/Container";

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
        <main>
          <MyForm vacation={vacation} handleChange={this.handleChange} />
        </main>
        <aside>
          <VacCard
            vacation={vacation}
            followIcon={false}
            admin={false}
            accessToken={""}
          />
        </aside>
      </div>
    );
  }

  public handleChange = (prop: string, value: string): void => {
    const vacation = { ...this.state.vacation };
    vacation[prop] = value;
    this.setState({ vacation });
  };
}

export default Insert;
