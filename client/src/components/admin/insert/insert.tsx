import React, { Component } from "react";

// import my components
import VacCard from "../../vac-card/vac-card";
import MyForm from "../../my-form/my-form";

// import material-ui
import Grid from "@material-ui/core/Grid";

// import models
import { VacationModel } from "../../../models/vacations-model";

// import services
import { VacationService } from "../../../services/vacationsService";
import { InsertService } from "./insertService";
import { ServerServices } from "../../../services/serverService";
import { LoginServices } from "../../../services/loginService";

import "./insert.scss";
import UpdateToken from "../../updateToken/updateToken";

interface InsertState {
  vacation: VacationModel;
  preview: string;
}

export class Insert extends Component<any, InsertState> {
  private InsertService = new InsertService();

  constructor(props: any) {
    super(props);

    this.state = {
      vacation: new VacationModel(),
      preview: "",
    };
  }

  public componentDidMount = async () => {
    LoginServices.adminLoginLogic(this.props.history);
  };

  public handleInsertRequest = async () => {
    const { vacation } = this.state;


    try {

      // validate vacation
     if(VacationService.validVacationForm(vacation)) {
       return
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
    const { vacation, preview } = this.state;
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
              followIcon={false}
              admin={false}
              preview={preview}
            />
          </Grid>
        </Grid>
        <UpdateToken />
      </React.Fragment>
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
