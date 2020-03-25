import React, { Component } from "react";
import VacCard from "../../vac-card/vac-card";
import MyForm from "../../my-form/my-form";
import { VacationModel } from "../../../models/vacations-model";
import { VacationErrors } from "../../../models/error-model";
import {
  formLegalValues,
  formLegalErrors
} from "../../../services/validationService";
import { TokensModel } from "../../../models/tokens.model";
import { postRequest } from "../../../services/serverService";
import AppTop from "../../app-top/app-top/app-top";
import { getStorage } from "../../../services/loginService";
import "./insert.scss";

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
      tokens: new TokensModel()
    };
  }

  public componentDidMount = async () => {
    
    const user = getStorage("user");
    const tokens = getStorage("tokens");

    if (!user || user.isAdmin === 0) {
      this.props.history.push("/login");
      console.log("Not Admin");
      return;
    }

    this.setState({ tokens });
  };

  public addVacation = async () => {
    if (this.vacationFormLegal()) {
      return;
    }

    try {
      const { vacation, tokens } = this.state;
      const url = `http://localhost:3000/api/vacations`;

      await postRequest(url, vacation, tokens.accessToken);
      alert("New Vacation has been added!");
      this.props.history.push("/admin");
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    const { vacation, tokens } = this.state;
    return (
      <div className="insert page">
        <nav>
          <AppTop
            user={true}
            admin={true}
            logo={"Travel-on"}
            tokens={tokens}
          ></AppTop>
        </nav>
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
