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
import { AuthServices } from "../../../services/auth-service";
import { InsertForm } from "./insert-service";

import "./insert.scss";
import { ValidationService } from "../../../services/validation-service";

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

  private InsertForm = new InsertForm(
    `http://localhost:3000/api/vacations`,
    "New Vacation has been added!",
    this.props.history
  );

  public componentDidMount = async () => {
      await AuthServices.handleAuth(
        () => ValidationService.verifyAdmin(this.props.history),
        this.props.history
      );
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
      const response = await this.InsertForm.handleInsertRequest(vacation);

      // handle server response
      this.InsertForm.handleInsertSuccess(response);

    } catch (err) {
      if (err.response.status === 500) {
        this.InsertForm.handleError(
          "Pay attention! you cant use apostrophe mark"
        );
      }
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
