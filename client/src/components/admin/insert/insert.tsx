import React, { Component } from "react";
import VacCard from "../../vac-card/vac-card";
import MyForm from "../my-form/my-form";
import Button from "react-bootstrap/Button";
import { VacationModel } from "../../../models/vacations-model";
import "./insert.scss";

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

  public addVacation = (): void => {
  }; 

  render() {
    const { vacation } = this.state;
    return (
      <div className="insert">
        <main> 
          <MyForm 
            vacation={vacation} 
            handleChange={this.handleChange}
          />
        </main> 
        <aside>  
          <VacCard
            vacation={vacation}
            followIcon={false}
            admin={false}
            accessToken={""}
          />
          <Button onClick={this.addVacation}>Confirm Form</Button>
        </aside>
      </div>
    );
  }

  public handleChange = (prop: string, value: string): void => {
    const vacation = { ...this.state.vacation };
    vacation[prop] = value;
    console.log(vacation)
    this.setState({ vacation });
  };

  
}

export default Insert;
