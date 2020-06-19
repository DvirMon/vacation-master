import React, { Component } from "react";

// import my components
import MyForm from "../../my-components/my-form/my-form";
import Loader from "../../my-components/loader/loader";
import UpdateToken from "../../auth/updateToken/updateToken";
import VacCard from "../../vac-card/vac-card";

// import materiel-ui
import Grid from "@material-ui/core/Grid";

// import models
import { VacationModel } from "../../../models/vacations-model";
import { TokensModel } from "../../../models/tokens.model";
import {
  formAdminSetting,
  VacationCardModel,
} from "../../../models/vac-card-model";

// import services
import { VacationService } from "../../../services/vacations-service";
import { ValidationService } from "../../../services/validation-service";
import { AuthServices } from "../../../services/auth-service";
import { UpdateForm } from "./update-service";

// import redux
import { store } from "../../../redux/store";

import "./update.scss";

interface UpdateState {
  vacation: VacationModel;
  tokens: TokensModel;
  updated: boolean;
  settings: VacationCardModel;

}

export class Update extends Component<any, UpdateState> {
  
  private vacationService : VacationService = new VacationService()
  private authService : AuthServices = new AuthServices()
  private validationService : ValidationService = new ValidationService()

  constructor(props: any) {
    super(props);

    this.state = {
      vacation: new VacationModel(),
      tokens: store.getState().auth.tokens,
      updated: true,
      settings: formAdminSetting,
    };
  } 

  private UpdateForm = new UpdateForm(
    `http://localhost:3000/api/vacations/${this.props.match.params.id}`,
    "Vacation has been updated successfully!",
    this.props.history
  );

  public componentDidMount = async () => {
    await this.authService.handleAuth(
      () => this.validationService.verifyAdmin(this.props.history),
      this.props.history
    );
    try {
      const vacation = await this.UpdateForm.getVacation();
      this.setState({ vacation });
      setTimeout(() => this.setState({ updated: true }), 1100);
    } catch (err) {
      console.log(err);
    }
  };

  public handleUpdateRequest = async () => {
    const { vacation, updated } = this.state;

    try {
      if (this.UpdateForm.verifyChange(updated)) {
        return;
      }

      // validate form
      if (this.vacationService.validVacationForm(vacation)) {
        return;
      }

      // send update request
      const response = await this.UpdateForm.handleIUpdateRequest(vacation);
      // handle server response
      this.UpdateForm.handleIUpdateSuccess(response);
    } catch (err) {
      if (err.response.status === 500) {
        this.UpdateForm.handleError(
          "An error has occurred."
        );
      }
    }
  };

  render() {
    const { vacation, settings } = this.state;

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
                  handleVacation={this.handleUpdateRequest}
                  handleImage={this.handleImage}
                />
              )}
            </Grid>
            <Grid item xs={4}>
              {vacation && (
                <VacCard
                  vacation={vacation}
                  margin={false}
                  preview={settings.img}
                  vacationSettings={settings}
                />
              )}
            </Grid>
          </Grid>
        )}
        <UpdateToken />
      </React.Fragment>
    );
  }

  public handleImage = (preview: string) => {
    const settings = { ...this.state.settings };
    settings.img = preview;
    this.setState({ settings });
  };

  public handleChange = (prop: string, input: any) => {
    const vacation = { ...this.state.vacation };
    vacation[prop] = input;
    this.setState({ vacation, updated: false });
  };
}

export default Update;
