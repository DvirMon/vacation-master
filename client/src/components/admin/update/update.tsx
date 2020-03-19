import React, { Component } from "react";
import VacCard from "../../vac-card/vac-card";
import MyForm from "../../my-form/my-form";
import { VacationModel } from "../../../models/vacations-model";
import { VacationErrors } from "../../../models/error-model";
import { formLegalValues, formLegalErrors } from "../../../services/validation";
import { TokensModel } from "../../../models/tokens.model";
import "./update.scss";
import { putRequest, getRequest } from "../../../services/server";
import { store } from "../../../redux/store/store";
import { Unsubscribe } from "redux";

interface UpdateState {
  vacation: VacationModel;
  errors: VacationErrors;
  tokens: TokensModel;
  updated: boolean;
}

export class Update extends Component<any, UpdateState> {
  private unsubscribeStore: Unsubscribe;

  constructor(props: any) {
    super(props);

    this.state = {
      vacation: new VacationModel(),
      errors: null,
      tokens: store.getState().tokens,
      updated: true
    };

    this.unsubscribeStore = store.subscribe(() => {
      this.setState({ tokens: store.getState().tokens });
    });
  }

  public componentDidMount = async () => {
    const vacationID = this.props.match.params.id;
    const url = `http://localhost:3000/api/vacations/${vacationID}`;
    const vacation = await getRequest(url);
    this.setState({ vacation });
  };

  public componentWillUnmount(): void {
    this.unsubscribeStore();
  }

  public updateVacation = async () => {
    if (this.state.updated) {
      const answer = window.confirm(
        "No change has been made do you want to continue?"
      );
      if (!answer) {
        return;
      }
    }

    // validate form
    if (this.vacationFormLegal()) {
      return;
    }

    try {
      const { vacation, tokens } = this.state;
      const vacationID = this.props.match.params.id;
      console.log(vacation);
      console.log(tokens.accessToken);

      const url = `http://localhost:3000/api/vacations/${vacationID}`;
      const response = await putRequest(url, vacation, tokens.accessToken);
      
      if(response.message === 'success') {
        this.props.history.push("/admin");
      } 

    } catch (err) {
      console.log(err);
    }
  };

  render() {
    const { vacation } = this.state;

    return (
      <div className="update">
        <main>
          {vacation && (
            <MyForm
              vacation={vacation}
              handleChange={this.handleChange}
              handleErrors={this.handleErrors}
              handleVacation={this.updateVacation}
            />
          )}
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
    this.setState({ vacation, updated: false });
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

export default Update;
