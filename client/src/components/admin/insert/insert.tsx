import React, { Component } from "react";

// import my components
import VacCard from "../../vac-card/vac-card";
import MyForm from "../../my-form/my-form";
import UpdateToken from "../../updateToken/updateToken";

// import material-ui
import Grid from "@material-ui/core/Grid";

// import models
import { VacationModel } from "../../../models/vacations-model";

// import services
import { VacationService } from "../../../services/vacations-service";
import { InsertService } from "./insertService";
import { ServerServices } from "../../../services/server-service";
import { AuthServices } from "../../../services/auth-service";

import "./insert.scss";
import {
  VacationCardSetting,
  formAdminSetting,
} from "../../../models/vac-card-model";

interface InsertState {
  vacation: VacationModel;
  settings: VacationCardSetting;
}

export class Insert extends Component<any, InsertState> {
  private InsertService = new InsertService();

  constructor(props: any) {
    super(props);

    this.state = {
      vacation: new VacationModel(),
      settings: formAdminSetting,
    };
  } 

  public componentDidMount = async () => {
    AuthServices.adminLoginLogic(this.props.history);
  };

  public handleInsertRequest = async () => {
    const { vacation } = this.state;

    try {
      // validate vacation
      if (VacationService.validVacationForm(vacation)) {
        return;
      }

      // send request
      const response = await this.InsertService.handleRequest(vacation);

      // handle server response
      ServerServices.handleServerResponse(
        response,
        (response) =>
          this.InsertService.handleSuccess(response, this.props.history),
        (response) => this.InsertService.handleError(response)
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
              preview={settings.img }
              vacationSettings={settings}
            />
          </Grid>
        </Grid>
        <UpdateToken />
      </React.Fragment>
    );
  }
 
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
