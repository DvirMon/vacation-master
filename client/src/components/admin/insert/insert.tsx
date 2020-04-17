import React, { Component } from "react";

// import my components
import VacCard from "../../vac-card/vac-card";
import MyForm from "../../my-form/my-form";
import UpdateToken from "../../updateToken/updateToken";

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
import { ServerServices } from "../../../services/server-service";
import { AuthServices } from "../../../services/auth-service";

import "./insert.scss";
import { FormService } from "../../../services/form-service";
import { ActionType } from "../../../redux/action-type";

interface InsertState {
  vacation: VacationModel;
  settings: VacationCardModel;
}

export class Insert extends Component<any, InsertState> {
  
  constructor(props: any) {
    super(props);

    this.state = {
      vacation: new VacationModel(),
      settings: formAdminSetting,
    };
  }

  private InsertForm = new FormService(
    `http://localhost:3000/api/vacations`,
    "New Vacation has been added!",
    ActionType.addVacation,
    "postRequestAsync",
    this.props.history
  );

  public componentDidMount = async () => {
    await AuthServices.handleAuth(this.props.history);
    this.setPreview();
  };

  public handleInsertRequest = async () => {
    const { vacation } = this.state;

    try {
      // validate vacation
      if (VacationService.validVacationForm(vacation)) {
        return;
      }

      // send request
      const response = await this.InsertForm.handleRequest(vacation);

      // handle server response
      ServerServices.handleServerResponse(
        response,
        (response) => this.InsertForm.handleSuccess(response),
        (response) => this.InsertForm.handleError(response)
      );
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    const { vacation, settings } = this.state;
    return (
      <React.Fragment>
        <Grid container className="insert">
          <Grid item xs={8}>
            <MyForm
              vacation={vacation}
              handleChange={this.handleChange}
              handleVacation={this.handleInsertRequest}
              handleImage={this.handleImage}
            />
          </Grid>
          <Grid item xs={4}>
            <VacCard
              vacation={vacation}
              margin={false}
              preview={settings.img}
              vacationSettings={settings}
            />
          </Grid>
        </Grid>
        <UpdateToken />
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
