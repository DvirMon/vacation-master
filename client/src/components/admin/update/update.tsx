import React, { Component, lazy, Suspense } from "react";

// import my como
// import VacCard from "../../vac-card/vac-card";

import MyForm from "../../my-form/my-form";
import Loader from "../../loader/loader";

// import materiel-ui
import Grid from "@material-ui/core/Grid";
import VacCard from "../../vac-card/vac-card";

// import models
import { VacationModel } from "../../../models/vacations-model";
import { TokensModel } from "../../../models/tokens.model";

// import services
import { UpdateService } from "./updateService";
import { ServerServices } from "../../../services/serverService";
import { TokensServices } from "../../../services/tokensService";
import { ValidationService } from "../../../services/validationService";
import { LoginServices } from "../../../services/loginService";

// import redux
import { store } from "../../../redux/store";
import { Unsubscribe } from "redux";

import "./update.scss";
import UpdateToken from "../../updateToken/updateToken";

// const VacCard = lazy(() => import("../../vac-card/vac-card"));

interface UpdateState {
  vacation: VacationModel;
  tokens: TokensModel;
  updated: boolean;
  preview: string;
}

export class Update extends Component<any, UpdateState> {
  constructor(props: any) {
    super(props);

    this.state = {
      vacation: new VacationModel(),
      tokens: store.getState().auth.tokens,
      updated: true,
      preview: "",
    };
  }

  private UpdateService = new UpdateService(+this.props.match.params.id);

  public componentDidMount = async () => {
    LoginServices.adminLoginLogic(this.props.history);

    try {
      const vacation = await this.UpdateService.getVacation();
      this.setState({ vacation });

      setTimeout(() => {
        this.setState({ updated: true });
      }, 1100);
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
      if (ValidationService.formLegal(vacation, VacationModel.validVacation)) {
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
                  handleVacation={this.handleUpdateRequest}
                  handleImage={this.handleImage}
                />
              )}
            </Grid>
            <Suspense fallback={<div>Loading.....</div>}>
              <Grid item xs={4}>
                <VacCard
                  vacation={vacation}
                  followIcon={false}
                  admin={false}
                  margin={false}
                  hover={false}
                  preview={preview}
                />
              </Grid>
            </Suspense>
          </Grid>
        )}
        <UpdateToken />
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
}

export default Update;
