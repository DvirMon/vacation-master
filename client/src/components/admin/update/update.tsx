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
import { putRequest, getRequest } from "../../../services/serverService";
import { store } from "../../../redux/store/store";
import AppTop from "../../app-top/app-top/app-top";
import { getStorage } from "../../../services/loginService";
import Loader from "../../loader/loader";
import "./update.scss";

interface UpdateState {
  vacation: VacationModel;
  errors: VacationErrors;
  tokens: TokensModel;
  updated: boolean;
}

export class Update extends Component<any, UpdateState> {

  constructor(props: any) {
    super(props);

    this.state = {
      vacation: new VacationModel(),
      errors: null,
      tokens: new TokensModel(),
      updated: true
    };

  }

  public componentDidMount = async () => {
    const user = getStorage("user");

    if (!user || user.isAdmin === 0) {
      this.props.history.push("/login");
      console.log("Not Admin");
      return;
    }

    try {
      const tokens = getStorage("tokens");
      const vacationID = this.props.match.params.id;
      const url = `http://localhost:3000/api/vacations/${vacationID}`;
      const vacation = await getRequest(url);
      this.setState({ vacation, updated: true, tokens });
    } catch (err) {
      console.log(err);
    }
  };
 
  public updateVacation = async () => {
    if (this.state.updated) {
      const answer = window.confirm(
        "No change has been notice, do you wish to continue?"
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

      console.log(tokens);
      const vacationID = this.props.match.params.id;

      const url = `http://localhost:3000/api/vacations/${vacationID}`;
      const response = await putRequest(url, vacation, tokens.accessToken);

      if (response.message === "success") {
        this.props.history.push("/admin");
      }
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    const { vacation, tokens } = this.state;

    return (
      <React.Fragment>
        {!vacation ? (
          <Loader />
        ) : (
          <div className="update page">
            <nav>
              <AppTop
                user={true}
                admin={true}
                logo={"Travel-on"}
                tokens={tokens}
              ></AppTop>
            </nav>
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
        )}
      </React.Fragment>
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
