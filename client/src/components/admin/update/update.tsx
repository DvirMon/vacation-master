import React, { Component, lazy, Suspense } from "react";

// import my components
import MyForm from "../../my-form/my-form";
import Loader from "../../loader/loader";
import UpdateToken from "../../updateToken/updateToken";
import VacCard from "../../vac-card/vac-card";

// import materiel-ui
import Grid from "@material-ui/core/Grid";
 
// import models
import { VacationModel } from "../../../models/vacations-model";
import { TokensModel } from "../../../models/tokens.model";

// import services
import { UpdateService } from "./updateService";
import { ServerServices } from "../../../services/server-service";
import { VacationService } from "../../../services/vacations-service";
import { AuthServices } from "../../../services/auth-service";

// import redux
import { store } from "../../../redux/store";

import "./update.scss";
import {
  formAdminSetting,
  VacationCardSetting,
} from "../../../models/vac-card-model";

interface UpdateState {
  vacation: VacationModel;
  tokens: TokensModel;
  updated: boolean;
  settings: VacationCardSetting;
}

export class Update extends Component<any, UpdateState> {
  constructor(props: any) {
    super(props);

    this.state = {
      vacation: new VacationModel(),
      tokens: store.getState().auth.tokens,
      updated: true,
      settings: formAdminSetting,
    };
  }

  private UpdateService = new UpdateService(+this.props.match.params.id);

  public componentDidMount = async () => {
    AuthServices.adminLoginLogic(this.props.history);

    try {
      const vacation = await this.UpdateService.getVacation();
      this.setState({ vacation });  
      setTimeout(() => this.setState({ updated: true }), 1100);
    } catch (err) { 
      console.log(err);
    }
  }; 
  


  public handleUpdateRequest = async () => {
    const { vacation, updated } = this.state;

    if (this.UpdateService.verifyChange(updated)) {
      return;
    }

    try {
      // validate form
      if (VacationService.validVacationForm(vacation)) {
        return;
      }

      // send update request
      const response = await this.UpdateService.handleRequest(vacation);

      // handle server response
      ServerServices.handleServerResponse(
        response,
        (response) =>
          this.UpdateService.handleSuccess(response, this.props.history),
        (response) => this.UpdateService.handleError(response)
      );
    } catch (err) {
      alert(err);
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
                  preview={settings.img }
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
