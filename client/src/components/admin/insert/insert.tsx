import React, { Component } from "react";

// import my components
import VacCard from "../../vac-card/vac-card";
import MyForm from "../../my-form/my-form";

// import material-ui
import Grid from "@material-ui/core/Grid";

// import models
import { VacationModel } from "../../../models/vacations-model";

// import services
import { InsertService } from "./insertService";
import { ValidationService } from "../../../services/validationService";
import { TokensServices } from "../../../services/tokensService";
import { ServerServices } from "../../../services/serverService";
import { LoginServices } from "../../../services/loginService";

import "./insert.scss";

interface InsertState {
  vacation: VacationModel;
  preview: string;
}

export class Insert extends Component<any, InsertState> {
  constructor(props: any) {
    super(props);

    this.state = {
      vacation: new VacationModel(),
      preview: "aaa",
    };
  }

  public componentDidMount = async () => {
    LoginServices.adminLoginLogic(this.props.history);
  };

  public componentWillUnmount(): void {
    clearInterval(this.handleTokens);
  }

  public handleInsertRequest = async () => {
    const { vacation } = this.state;

    try {

      // validate vacation
      if (ValidationService.formLegal(vacation, VacationModel.validVacation)) {
        return;
      }

      // handle request
      const response = await InsertService.handleRequest(vacation);

      // handle response
      ServerServices.handleServerResponseEx(
        response, 
        () => InsertService.handleSuccess(response.body, this.props.history),
        () => InsertService.handleError(response.body) 
      );
    } catch (err) {
      console.log(err);
    }
  };

  public handleTokens = setInterval(async () => {
    await TokensServices.getAccessToken();
  }, 360000);

  render() {
    const { vacation, preview } = this.state;
    return (
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
            followIcon={false}
            admin={false}
            preview={preview}
          />
        </Grid>
      </Grid>
    );
  }

  public handleImage = (preview: string) => {
    this.setState({ preview });
  };

  public handleChange = (prop: string, input: any): void => {
    const vacation = { ...this.state.vacation };
    vacation[prop] = input;
    this.setState({ vacation });
  };
}

export default Insert;
