import React, { Component } from "react";

// import my components
import MyForm from "../../my-components/my-form/my-form";
import Loader from "../../my-components/loader/loader";
import VacCard from "../../vac-card/vac-card/vac-card";

// import materiel-ui
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";

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

// import redux
import { store } from "../../../redux/store";

import "./update.scss";
import { Hidden } from "@material-ui/core";

interface UpdateState {
  vacation: VacationModel;
  tokens: TokensModel;
  updated: boolean;
  settings: VacationCardModel;
}

export class Update extends Component<any, UpdateState> {
  private authService: AuthServices = new AuthServices();
  private vacationService: VacationService = new VacationService();
  private validationService: ValidationService = new ValidationService();

  constructor(props: any) {
    super(props);

    this.state = {
      vacation: new VacationModel(),
      tokens: store.getState().auth.tokens,
      updated: true,
      settings: formAdminSetting,
    };
  }

  public componentDidMount = async () => {
    await this.authService.handleAuth(() =>
      this.validationService.verifyAdmin()
    );
    
    const vacation = await this.vacationService.getVacation(
      this.props.match.params.id
    );
    this.setState({ vacation });
    setTimeout(() => this.setState({ updated: true }), 1100);
  };

  public handleUpdateRequest = async () => {
    const { vacation, updated } = this.state;

    if (this.verifyChange(updated)) {
      return;
    }

    // validate form
    if (this.vacationService.validVacationForm(vacation)) {
      return;
    }

    // send update request
    await this.vacationService.updateVacation(
      vacation,
      this.props.match.params.id
    );
  };

  render() {
    const { vacation, settings } = this.state;

    return (
      <React.Fragment>
        {!vacation ? (
          <Loader />
        ) : (
          <Grid container className="update">
            <Grid className="update-form" item md={8} xs={11}>
              {vacation && (
                <MyForm
                  vacation={vacation}
                  handleChange={this.handleChange}
                  handleVacation={this.handleUpdateRequest}
                  handleImage={this.handleImage}
                />
              )}
            </Grid>
            <Hidden smDown>
              <Grid item xs={4}>
                {vacation ? (
                  <VacCard
                    vacation={vacation}
                    margin={false}
                    preview={settings.img}
                    vacationSettings={settings}
                  />
                ) : <CircularProgress color="inherit" />
              }
              </Grid>
            </Hidden>
          </Grid>
        )}
      </React.Fragment>
    );
  }

  private handleImage = (preview: string) => {
    const settings = { ...this.state.settings };
    settings.img = preview;
    this.setState({ settings });
  };

  private handleChange = (prop: string, input: any) => {
    const vacation = { ...this.state.vacation };
    vacation[prop] = input;
    this.setState({ vacation, updated: false });
  };

  private verifyChange = (updated: boolean): boolean => {
    if (updated) {
      const answer = window.confirm(
        "No change has been notice, do you wish to continue?"
      );
      if (!answer) {
        return true;
      }
      return false;
    }
  };
}
export default Update;
