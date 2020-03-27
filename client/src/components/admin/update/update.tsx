import React, { Component } from "react";
import VacCard from "../../vac-card/vac-card";
import MyForm from "../../my-form/my-form";
import { VacationModel } from "../../../models/vacations-model";
import { VacationErrors } from "../../../models/error-model";
import {
  formLegalValues,
  formLegalErrors,
  formLegal
} from "../../../services/validationService";
import { TokensModel } from "../../../models/tokens.model";
import { putRequest, getRequest } from "../../../services/serverService";
import { store } from "../../../redux/store/store";
import { updateVacation } from "../../../services/serverService";
import Loader from "../../loader/loader";
import { ActionType } from "../../../redux/action-type/action-type";
import { Grid } from "@material-ui/core";
import { MenuModel, AdminMenu } from "../../../models/menu-model";
import "./update.scss";
import { getAccessToken } from "../../../services/tokensService";
import { setFormData } from "../../../services/vacationsService";
import { adminStyle } from "../../../services/styleService";

interface UpdateState {
  vacation: VacationModel;
  errors: VacationErrors;
  tokens: TokensModel;
  updated: boolean;
  preview: string;
}

export class Update extends Component<any, UpdateState> {
  constructor(props: any) {
    super(props);

    this.state = {
      vacation: new VacationModel(),
      errors: null,
      tokens: new TokensModel(),
      updated: true,
      preview: ""
    };
  }

  public componentDidMount = async () => {
    // verify admin
    const user = store.getState().user;
    if (!user || user.isAdmin === 0) {
      this.props.history.push("/login");
      console.log("Not Admin");
      return;
    }

    store.dispatch({type: ActionType.refreshVacation,payload: new VacationModel()});

    try {
      
      const vacationID = this.props.match.params.id;
      const url = `http://localhost:3000/api/vacations/${vacationID}`;
      const vacation = await getRequest(url);
      this.setState({ vacation });

      setTimeout(() => {
        this.setState({ updated: true });
      }, 1100);
    } catch (err) {
      console.log(err);
    }
  };

  public componentWillUnmount(): void {
    clearInterval(this.handleTokens);
  }


  public handleTokens = setInterval(async () => {
    const tokens = JSON.parse(sessionStorage.getItem("tokens"));
    if (!tokens) {
      return;
    }
    await getAccessToken(tokens);
    console.log(store.getState().tokens.accessToken)
  }, 600000);





  public updateVacation = async () => {
    if (this.state.updated) {
      const answer = window.confirm(
        "No change has been notice, do you wish to continue?"
      );
      if (!answer) {
        return;
      }
    }

    const { vacation } = this.state;

    // validate form
    if (formLegal(vacation)) {
      return;
    }

    try {
      const tokens = store.getState().tokens;
      const vacationID = this.props.match.params.id;

      // create formatDate file
      const myFormData = setFormData(vacation);

      const url = `http://localhost:3000/api/vacations/${vacationID}`;

      const response = await updateVacation(
        url,
        myFormData,
        tokens.accessToken
      );

      if (response.message === "success") {
        alert("Vacation has been updated successfully!");
        this.props.history.push("/admin");
      } else {
        alert(response.body);
      }
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    const { vacation, preview } = this.state;

    return (
      <React.Fragment>
        {!vacation ? (
          <Loader />
        ) : (
          <Grid container className="update">
            <Grid item xs={8}>
              {vacation && (
                <MyForm
                  vacation={vacation}
                  handleChange={this.handleChange}
                  handleErrors={this.handleErrors}
                  handleVacation={this.updateVacation}
                  handleImage={this.handleImage}
                />
              )}
            </Grid>
            <Grid item xs={4}>
              <VacCard
                vacation={vacation}
                followIcon={false}
                admin={false}
                hover={false}
                accessToken={""}
                preview={preview}
              />
            </Grid>
          </Grid>
        )}
      </React.Fragment>
    );
  }

  public handleImage = (preview: string) => {
    this.setState({ preview });
  };

  public handleChange = (prop: string, input: any) => {
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
