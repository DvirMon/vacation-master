import React, { Component } from "react";
import VacCard from "../../vac-card/vac-card";
import MyForm from "../../my-form/my-form";
import Button from "react-bootstrap/Button";
import { VacationModel } from "../../../models/vacations-model";
import { VacationErrors } from "../../../models/error-model";
import { formLegalValues, formLegalErrors } from "../../../services/validationService";
import { TokensModel } from "../../../models/tokens.model";
import { postRequest } from "../../../services/serverService";

import { store } from "../../../redux/store/store";
import { Unsubscribe } from "redux";

import "./insert.scss";

interface InsertState {
  vacation: VacationModel;
  errors: VacationErrors;
  tokens: TokensModel;
}

export class Insert extends Component<any, InsertState> {
  private unsubscribeStore: Unsubscribe;

  constructor(props: any) {
    super(props);

    this.state = {
      vacation: new VacationModel(),
      errors: null,
      tokens: store.getState().tokens
    };

    this.unsubscribeStore = store.subscribe(() => {
      this.setState({ tokens: store.getState().tokens });
    });
  }

  public componentWillUnmount(): void {
    this.unsubscribeStore();
  }

  public addVacation = async () => {
    if (this.vacationFormLegal()) {
      return;
    }

    try {
      const { vacation, tokens } = this.state;

      const url = `http://localhost:3000/api/vacations`;
      const response = await postRequest(url, vacation, tokens.accessToken);

      this.props.history.push("/admin");
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
            handleVacation={this.addVacation}
          />
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

  public handleChange = (prop: string, input: string): void => {
    const vacation = { ...this.state.vacation };
    vacation[prop] = input;
    this.setState({ vacation });
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
