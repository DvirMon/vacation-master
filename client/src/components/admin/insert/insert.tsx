import React, { Component } from "react";

// import my components
import VacCard from "../../vac-card/vac-card/vac-card";
import MyForm from "../../my-components/my-form/my-form";

// import material-ui
import Grid from "@material-ui/core/Grid";

// import models
import { VacationModel } from "../../../models/vacations-model";
import {
  VacationCardModel,
  formAdminSetting,
} from "../../../models/vac-card-model";

// import services
import { VacationService } from "../../../services/vacations-service";
import { ValidationService } from "../../../services/validation-service";
import { AuthServices } from "../../../services/auth-service";

import "./insert.scss";
import { Hidden } from "@material-ui/core";

interface InsertState {
  vacation: VacationModel;
  settings: VacationCardModel;
}

export class Insert extends Component<any, InsertState> {
  private authService: AuthServices = new AuthServices();
  private vacationService: VacationService = new VacationService();
  private validationService: ValidationService = new ValidationService();

  constructor(props: any) {
    super(props);

    this.state = {
      vacation: new VacationModel(),
      settings: formAdminSetting,
    };
  }

  public componentDidMount = async () => {
    await this.authService.handleAuth(() =>
      this.validationService.verifyAdmin()
    );
    this.setPreview();
  };

  public handleInsertRequest = async () => {
    const { vacation } = this.state;

    if (this.vacationService.validVacationForm(vacation)) {
      return;
    }

    // handle request
    await this.vacationService.addNewVacation(vacation);
  };

  render() {
    const { vacation, settings } = this.state;
    return (
      <React.Fragment>
        <Grid container className="insert">
          <Grid className="insert-form" item md={8} xs={11}>
            <MyForm
              vacation={vacation}
              handleChange={this.handleChange}
              handleVacation={this.handleInsertRequest}
              handleImage={this.handleImage}
            />
          </Grid>
          <Hidden smDown>
            <Grid item sm={4}>
              <VacCard
                vacation={vacation}
                margin={false}
                preview={settings.img}
                vacationSettings={settings}
              />
            </Grid>
          </Hidden>
        </Grid>
      </React.Fragment>
    );
  }

  public setPreview = () => {
    const settings = { ...this.state.settings };
    const preview = "alt";
    settings.img = preview;
    this.setState({ settings });
  };

  public handleImage = (preview: string) => {
    const settings = { ...this.state.settings };
    settings.img = preview;
    this.setState({ settings });
  };

  public handleChange = (prop: string, input: any): void => {
    const vacation = { ...this.state.vacation };
    vacation[prop] = input;
    this.setState({ vacation });
  };
}

export default Insert;
