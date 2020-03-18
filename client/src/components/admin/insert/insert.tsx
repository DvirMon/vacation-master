import React, { Component } from "react";
import VacCard from "../../vac-card/vac-card";
import MyForm from "../my-form/my-form";
import Button from "react-bootstrap/Button";
import { VacationModel } from "../../../models/vacations-model";
import { VacationErrors } from "../../../models/error-model";
import { formLegalValues, formLegalErrors } from "../../../services/validation";
import "./insert.scss";
import { TokensModel } from "../../../models/tokens.model";
import { postRequest } from "../../../services/server";

interface InsertState {
  vacation: VacationModel;
  errors: VacationErrors;
  tokens: TokensModel;
}

export class Insert extends Component<any, InsertState> {
  constructor(props: any) {
    super(props);

    this.state = {
      vacation: new VacationModel(),
      errors: null,
      tokens: {
        accessToken: "",
        dbToken: null
      }
    };
  }

  public componentDidMount = () => {
    const tokens = this.props.location.state.detail;
    this.setState({ tokens });
  };

  public addVacation = async () => {
    if (this.vacationFormLegal()) {
      return;
    }

    try {

      const { vacation, tokens } = this.state;
      const url = `http://localhost:3000/api/vacations`;
      const response = await postRequest(url, vacation, tokens.accessToken);

      if (typeof response === "object") {
        this.props.history.push("/admin");
      }

    } catch (err) {
      console.log(err);
    }
  };

  render() {
    const { vacation } = this.state;
    return (
      <div className="insert">
        <main>
          <MyForm
            vacation={vacation}
            handleChange={this.handleChange}
            handleErrors={this.handleErrors}
            addVacation={this.addVacation}
          />
        </main>
        <aside>
          <VacCard
            vacation={vacation}
            followIcon={false}
            admin={false}
            accessToken={""}
          />
          {/* <Button onClick={this.addVacation}>Confirm Form</Button> */}
        </aside>
      </div>
    );
  }

  public handleChange = (prop: string, input: string): void => {
    console.log(input)
    console.log(prop)
    const vacation = { ...this.state.vacation };
    vacation[prop] = input;
    this.setState({ vacation });
    console.log(this.state.vacation)
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

  public vacationFormLegal = (): boolean => {
    const vacation = { ...this.state.vacation };
    const errors = { ...this.state.errors };

    const value = formLegalValues(vacation);
    if (value) {
      alert(`Filed ${value} is required`);
      return true;
    }

    const error = formLegalErrors(errors);
    if (error) {
      alert(error);
      return true;
    }
    return false;
  };
}

export default Insert;
